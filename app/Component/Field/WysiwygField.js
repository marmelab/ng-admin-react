import React from 'react';
import Editor from 'react-medium-editor/lib/editor';

class WysiwygField extends React.Component {
    onChange(text) {
        this.props.updateField(this.props.name, text);
    }

    render() {
        const {value} = this.props;
        const onChange = this.onChange.bind(this);

        return <Editor
            text={value}
            onChange={onChange}
            options={{buttons: ['bold', 'italic', 'underline']}}
            />;
    }
}

WysiwygField.propTypes = {
    field: React.PropTypes.object.isRequired,
    name: React.PropTypes.object.isRequired,
    value: React.PropTypes.any,
    updateField: React.PropTypes.func
};

export default WysiwygField;
