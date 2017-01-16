import objectAssign from 'object-assign';
import PromisesResolver from 'admin-config/lib/Utils/PromisesResolver';
import ReadQueries from 'admin-config/lib/Queries/ReadQueries';
import WriteQueries from 'admin-config/lib/Queries/WriteQueries';
import Entry from 'admin-config/lib/Entry';
import DataStore from 'admin-config/lib/DataStore/DataStore';

class EntryRequester {
    constructor(configuration, restWrapper) {
        this.configuration = configuration;
        this.readQueries = new ReadQueries(restWrapper, PromisesResolver, configuration);
        this.writeQueries = new WriteQueries(restWrapper, PromisesResolver, configuration);
    }

    getEntries(dataStore, view, page=1, options={}) {
        options = objectAssign({
            references: false,
            choices: false,
            sortField: null,
            sortDir: null,
            filters: []
        }, options);

        let totalItems, rawEntries, entries;

        let promise = this.readQueries
            .getAll(view, page, options.filters, options.sortField, options.sortDir)
            .then((response) => {
                rawEntries = response.data;
                entries = view.mapEntries(rawEntries);
                totalItems = +response.totalItems;

                return { rawEntries, entries };
            });

        if (options.references) {
            promise = this.getReferencesEntries(promise, view, dataStore);
        }

        if (options.choices) {
            promise = this.getChoicesEntries(promise, view, dataStore);
        }

        return promise.then((response) => {
            if (options.references || options.referencesList || options.choices) {
                dataStore.fillReferencesValuesFromCollection(response.entries, view.getReferences(), true);
            }

            dataStore.setEntries(view.entity.uniqueId, response.entries);

            return { dataStore, totalItems };
        });
    }

    createEntry(view) {
        let dataStore = new DataStore();

        let promise = new Promise((resolve) => {
            const entry = Entry.createForFields(view.getFields(), view.entity.name());

            resolve({
                rawEntries: [],
                entries: [entry]
            });
        });

        promise = this.getChoicesEntries(promise, view, dataStore);

        return promise.then((response) => {
            dataStore.addEntry(view.entity.uniqueId, response.entries[0]);

            return dataStore;
        });
    }

    getEntry(view, identifierValue, options={}) {
        options = objectAssign({
            references: false,
            referencesList: false,
            choices: false,
            sortField: null,
            sortDir: null
        }, options);

        let dataStore = new DataStore();

        let promise = this.readQueries
            .getOne(view.getEntity(), view.type, identifierValue, view.identifier(), view.getUrl())
            .then((data) => {
                return {
                    rawEntries: [data],
                    entries: [view.mapEntry(data)]
                };
            });

        if (options.references) {
            promise = this.getReferencesEntries(promise, view, dataStore);
        }

        if (options.referencesList) {
            promise = this.getReferencesListEntries(promise, view, dataStore, options.sortField, options.sortDir);
        }

        if (options.choices) {
            promise = this.getChoicesEntries(promise, view, dataStore);
        }

        return promise.then((r) => {
            if (options.references || options.referencesList) {
                dataStore.fillReferencesValuesFromEntry(r.entries[0], view.getReferences(), true);
            }

            dataStore.addEntry(view.entity.uniqueId, r.entries[0]);

            return dataStore;
        });
    }

    saveEntry(dataStore, view, rawEntry, id=null) {
        let query;
        let entry = rawEntry.transformToRest(view.fields());

        if (id) {
            query = this.writeQueries.updateOne(view, entry, id);
        } else {
            query = this.writeQueries.createOne(view, entry);
        }

        return query.then((data) => {
            entry = view.mapEntry(data);
            dataStore.fillReferencesValuesFromEntry(entry, view.getReferences(), true);
            dataStore.setEntries(view.getEntity().uniqueId, [entry]);

            return dataStore;
        });
    }

    deleteEntry(view, id) {
        return this.writeQueries.deleteOne(view, id);
    }

    getReferencesEntries(promise, view, dataStore) {
        let rawEntries, entries, nonOptimizedReferencedData, optimizedReferencedData;

        return promise.then((response) => {
            rawEntries = response.rawEntries;
            entries = response.entries;

            return this.readQueries.getFilteredReferenceData(view.getNonOptimizedReferences(), rawEntries);
        })
        .then((nonOptimizedReference) => {
            nonOptimizedReferencedData = nonOptimizedReference;

            return this.readQueries.getOptimizedReferencedData(view.getOptimizedReferences(), rawEntries);
        })
        .then((optimizedReference) => {
            optimizedReferencedData = optimizedReference;

            const references = view.getReferences();
            let referencedData = objectAssign(nonOptimizedReferencedData, optimizedReferencedData);

            for (let name in referencedData) {
                dataStore.setEntries(
                    references[name].targetEntity().uniqueId + '_values',
                    view.mapEntries(referencedData[name])
                );
            }

            return { rawEntries, entries };
        });
    }

    getReferencesListEntries(promise, view, dataStore, sortField, sortDir) {
        let rawEntries, entries;

        return promise.then((response) => {
            rawEntries = response.rawEntries;
            entries = response.entries;

            const referencedLists = view.getReferencedLists();

            // only works with one entry
            return this.readQueries.getReferencedListData(referencedLists, sortField, sortDir, entries[0].identifierValue);
        })
        .then((referencedListData) => {
            const referencedLists = view.getReferencedLists();

            for (let i in referencedLists) {
                let referencedList = referencedLists[i];
                let referencedListEntries = referencedListData[i];

                referencedListEntries = Entry.createArrayFromRest(
                    referencedListEntries,
                    referencedList.targetFields(),
                    referencedList.targetEntity().name(),
                    referencedList.targetEntity().identifier()
                );

                dataStore.setEntries(
                    referencedList.targetEntity().uniqueId + '_list',
                    referencedListEntries
                );
            }

            return { rawEntries, entries };
        });
    }

    getChoicesEntries(promise, view, dataStore) {
        let rawEntries, entries;

        return promise.then((response) => {
            rawEntries = response.rawEntries;
            entries = response.entries;

            return this.readQueries.getAllReferencedData(view.getReferences());
        })
        .then((choicesData) => {
            const choices = view.getReferences();

            for (let name in choicesData) {
                let choiceEntries = Entry.createArrayFromRest(
                    choicesData[name],
                    [choices[name].targetField()],
                    choices[name].targetEntity().name(),
                    choices[name].targetEntity().identifier()
                );

                dataStore.setEntries(
                    choices[name].targetEntity().uniqueId + '_choices',
                    choiceEntries
                );
            }

            return { rawEntries, entries };
        });
    }
}

export default EntryRequester;
