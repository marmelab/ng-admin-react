import React from 'react';
import formatJson from 'format-json';
import Codemirror from 'react-codemirror';

require('codemirror/addon/edit/closebrackets');
require('codemirror/addon/edit/matchbrackets');
require('codemirror/addon/lint/lint');
require('codemirror/addon/lint/json-lint');
require('codemirror/addon/selection/active-line');
require('codemirror/mode/javascript/javascript');

class JsonField extends React.Component {
    onChange(code) {
        if (code && typeof(code) === 'string') {
            try {
                code = JSON.parse(code);
            } catch (e) {
                /* Invalid JSON*/
            }
        }

        this.props.updateField(this.props.name, code);
    }

    render() {
        let {value} = this.props;
        const onChange = this.onChange.bind(this);
        const options = {
            lineNumbers: true,
            matchBrackets: true,
            autoCloseBrackets: true,
            lineWrapping: true,
            tabSize: true,
            mode: 'javascript',
            gutters: ["CodeMirror-lint-markers"],
            stylesheet: "css/jscolors.css",
            lint: true,
            styleActiveLine: true
        };

        if (value && typeof(value) === 'object') {
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
