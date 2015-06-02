/* global jest,describe,it,beforeEach,expect */

jest.autoMockOff();
jest.setMock('react-router', {Link : require('../Button/__mocks__/Link')});

var React = require('react/addons');
var TestUtils = React.addons.TestUtils;
var DashboardPanel = require('../DashboardPanel');
var routerWrapper = require('../../Test/RouterWrapper');

var Entity = require('admin-config/lib/Entity/Entity');
var Entry = require('admin-config/lib/Entry');
var NumberField = require('admin-config/lib/Field/NumberField');
var Field = require('admin-config/lib/Field/Field');
var DateField = require('admin-config/lib/Field/DateField');

function getPanel(view, label, dataStore, sortDir, sortField) {
    return routerWrapper(() => <DashboardPanel
        view={view}
        label={label}
        dataStore={dataStore}
        sortDir={sortDir}
        sortField={sortField}
        />
    );
}

describe('DashboardPanel', () => {
    var entity;
    var view;
    var dataStore;

    beforeEach(() => {
        entity = new Entity('posts');

        view = entity
            .listView('myView')
            .fields([
            new NumberField('id').label('#'),
            new Field('title').label('Title'),
            new DateField('created_at').label('Creation date')
        ]);

        dataStore = {
            getEntries: () => [
                new Entry('posts', { 'id': 1, 'title': 'First Post', 'created_at': '2015-05-28' }, 1)
            ]
        };
    });

    describe('Panel header', () => {
        it('should set header with label', () => {
            var panel = getPanel(view, entity.label(), dataStore, null, null);
            panel = React.findDOMNode(panel);

            var headers = [].slice.call(panel.getElementsByClassName('panel-heading')).map(h => h.textContent);
            expect(headers).toEqual(['Posts']);
        });

        it('should set header with clickable label', () => {
            var panel = getPanel(view, entity.label(), dataStore, null, null);
            panel = React.findDOMNode(panel);

            var list = panel.getElementsByClassName('panel-heading')[0].querySelector('a');
            TestUtils.Simulate.click(list);

            expect(list.attributes['data-click-to'].value).toEqual('list');
            expect(list.attributes['data-params'].value).toEqual('{"entity":"posts"}');
        });
    });

    describe('Panel entries', () => {
        it('should set rows with correct values for each field', () => {
            var panel = getPanel(view, entity.label(), dataStore, null, null);
            panel = React.findDOMNode(panel);

            var rows = panel.querySelectorAll('table tbody tr');

            expect(rows.length).toEqual(1);
            expect(rows[0].childNodes.length).toEqual(3);
            expect(rows[0].childNodes[1].textContent).toEqual('First Post');
        });
    });
});
