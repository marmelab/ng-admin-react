import React from 'react';
import Editor from 'react-medium-editor/lib/editor';

class WysiwygField extends React.Component {
    onChange(text) {
        this.props.updateField(this.props.name, text);
    }

    render() {
        const { value } = this.props;
        const onChange = this.onChange.bind(this);

        return (
            <Editor className="wysiwyg-field form-control"
                text={value}
                onChange={onChange}
                options={{
                    buttons: ['bold', 'italic', 'underline', 'anchor', 'header1', 'header2', 'quote'],
                    anchor: { customClassOptionText: 'Button', placeholderText: 'Paste or type a link' }
                }}
                />
            );
    }
}

WysiwygField.propTypes = {
    name: React.PropTypes.string.isRequired,
    value: React.PropTypes.any,
    updateField: React.PropTypes.func
};

require('../../autoloader')('WysiwygField', WysiwygField);

export default WysiwygField;
