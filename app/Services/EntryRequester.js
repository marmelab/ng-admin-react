import objectAssign from 'object-assign';
import PromisesResolver from 'admin-config/lib/Utils/PromisesResolver';
import ReadQueries from 'admin-config/lib/Queries/ReadQueries';
import DataStore from 'admin-config/lib/DataStore/DataStore';

import RestWrapper from '../Services/RestWrapper';

class EntryRequester {
    constructor(configuration) {
        this.configuration = configuration;
        this.readQueries = new ReadQueries(new RestWrapper(), PromisesResolver, configuration);
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

        return promise.then((response) => {
            if (options.references || options.referencesList || options.choices) {
                dataStore.fillReferencesValuesFromEntry(response.entries[0], view.getReferences(), true);
            }

            dataStore.addEntry(view.entity.uniqueId, response.entries[0]);

            return dataStore;
        });
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

            var references = view.getReferences(),
                referencedData = objectAssign(nonOptimizedReferencedData, optimizedReferencedData),
                referencedEntries;

            for (var name in referencedData) {
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

            var referencedLists = view.getReferencedLists();

            // only works with one entry
            return this.readQueries.getReferencedListData(referencedLists, sortField, sortDir, entries[0].identifierValue);
        })
        .then((referencedListData) => {
            var referencedLists = view.getReferencedLists();
            var referencedList;
            var referencedListEntries;

            for (var i in referencedLists) {
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
            var choices = view.getReferences();
            var choiceEntries;

            for (var name in choicesData) {
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
