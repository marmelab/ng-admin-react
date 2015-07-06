import React from 'react';
import formatJson from 'format-json';
import Codemirror from 'react-codemirror';

class JsonField extends React.Component {
    constructor(props) {
        super(props);

        this.state = { value: props.value };
    }

    onChange(code) {
        this.setState({ value: code });

        if (code && 'string' === typeof code) {
            try {
                code = JSON.parse(code);
            } catch (e) {
                /* Invalid JSON*/
            }
        }

        this.props.updateField(this.props.name, code);
    }

    render() {
        let { value } = this.state;
        const onChange = this.onChange.bind(this);
        const options = {
            lineNumbers: true,
            matchBrackets: true,
            autoCloseBrackets: true,
            lineWrapping: true,
            tabSize: true,
            mode: 'javascript',
            gutters: ['CodeMirror-lint-markers'],
            stylesheet: 'css/jscolors.css',
            lint: true,
            styleActiveLine: true
        };

        if (value && 'object' === typeof value) {
            value = formatJson.plain(value);
        }

        return <Codemirror value={value} onChange={onChange} options={options} />;
    }
}

JsonField.propTypes = {
    name: React.PropTypes.string.isRequired,
    value: React.PropTypes.any,
    updateField: React.PropTypes.func
};

require('../../autoloader')('JsonField', JsonField);

export default JsonField;
