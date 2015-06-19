jest.autoMockOff();

import AdminFileField from 'admin-config/lib/Field/FileField';

describe('FileField', () => {
    let React, TestUtils, FileField, AjaxUpload, values = {}, uploadCb;
    const onChange = (name, value) => { values[name] = value; };

    beforeEach(() => {
        const empty = function () {
            return this;
        };

        jest.setMock('superagent', {
            post: empty,
            on: empty,
            off: empty,
            attach: empty,
            end: function (cb) {
                uploadCb = cb;
            }
        });

        React = require('react/addons');
        TestUtils = React.addons.TestUtils;
        FileField = require('../FileField');
        AjaxUpload = require('rc-upload/lib/AjaxUploader.jsx');
    });

    it('should display a upload button and change value on upload', () => {
        let field = new AdminFileField();

        field.uploadInformation({
            url: '/upload',
            apifilename: 'name'
        });

        const instance = TestUtils.renderIntoDocument(<FileField name="my_field" field={field} value={null} updateField={onChange}/>);
        const upload = TestUtils.findRenderedComponentWithType(instance, AjaxUpload);

        upload._post({name: 'cat.jpg'});

        uploadCb(null, {status: 200, body: JSON.stringify({name: "my-cat.jpeg"})});

        expect(values).toEqual({ 'my_field': 'my-cat.jpeg' });
    });
});
