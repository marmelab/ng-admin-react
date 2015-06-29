import objectAssign from 'object-assign';
import PromisesResolver from 'admin-config/lib/Utils/PromisesResolver';
import ReadQueries from 'admin-config/lib/Queries/ReadQueries';
import WriteQueries from 'admin-config/lib/Queries/WriteQueries';
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
                entries = dataStore.mapEntries(view.entity.name(), view.identifier(), view.getFields(), rawEntries);
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
            let entry = dataStore.createEntry(view.entity.name(), view.identifier(), view.getFields());

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
        let response;

        let promise = this.readQueries
            .getOne(view.getEntity(), view.type, identifierValue, view.identifier(), view.getUrl())
            .then((data) => {
                response = {
                    rawEntries: [data]
                };

                response.entries = [dataStore.mapEntry(
                    view.entity.name(),
                    view.identifier(),
                    view.getFields(),
                    response.rawEntries[0]
                )];

                return response;
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

        if (id) {
            query = this.writeQueries.updateOne(view, rawEntry, id);
        } else {
            query = this.writeQueries.createOne(view, rawEntry);
        }

        return query.then((data) => {
            let entry = dataStore.mapEntry(
                view.entity.name(),
                view.identifier(),
                view.getFields(),
                data
            );

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

            let references = view.getReferences(),
                referencedData = objectAssign(nonOptimizedReferencedData, optimizedReferencedData),
                referencedEntries;

            for (let name in referencedData) {
                referencedEntries = dataStore.mapEntries(
                    references[name].targetEntity().name(),
                    references[name].targetEntity().identifier(),
                    [references[name].targetField()],
                    referencedData[name]
                );

                dataStore.setEntries(
                    references[name].targetEntity().uniqueId + '_values',
                    referencedEntries
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
            let referencedList;
            let referencedListEntries;

            for (let i in referencedLists) {
                referencedList = referencedLists[i];
                referencedListEntries = referencedListData[i];

                referencedListEntries = dataStore.mapEntries(
                    referencedList.targetEntity().name(),
                    referencedList.targetEntity().identifier(),
                    referencedList.targetFields(),
                    referencedListEntries
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
            let choiceEntries;

            for (let name in choicesData) {
                choiceEntries = dataStore.mapEntries(
                    choices[name].targetEntity().name(),
                    choices[name].targetEntity().identifier(),
                    [choices[name].targetField()],
                    choicesData[name]
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
