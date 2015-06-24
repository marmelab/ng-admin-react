jest.autoMockOff();
jest.mock('rc-upload/lib/IframeUploader', jest.genMockFromModule('rc-upload/lib/IframeUploader'));

describe('FileField', () => {
    const React = require('react/addons');
    const TestUtils = React.addons.TestUtils;
    const AdminFileField = require('admin-config/lib/Field/FileField');
    const FileField = require('../FileField');
    const IframeUploader = require('rc-upload/lib/IframeUploader');

    let values = {};
    const onChange = (name, value) => { values[name] = value; };

    beforeEach(() => {
        IframeUploader.mockClear();
    });

    it('should display a upload button and change value on upload', () => {
        let field = new AdminFileField();

        field.uploadInformation({
            url: '/upload',
            apifilename: 'name'
        });

        const instance = TestUtils.renderIntoDocument(<FileField name="my_field" field={field} value={null} updateField={onChange}/>);
        const upload = TestUtils.findRenderedComponentWithType(instance, IframeUploader);

        upload.props.onSuccess('{ "name": "my-cat.jpeg" }', { name: 'cat.jpg' });

        jest.clearAllTimers(); // to avoid waiting for the end of setTimout calls

        expect(values).toEqual({ 'my_field': 'my-cat.jpeg' });
    });
});
