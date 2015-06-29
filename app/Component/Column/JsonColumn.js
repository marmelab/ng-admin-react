import React from 'react';

class JsonColumn extends React.Component {
    guessType(obj) {
        const type = Object.prototype.toString.call(obj);

        switch (type) {
            case '[object Object]': return 'Object';
            case '[object Array]': return 'Array';
            default: return 'Literal';
        }
    }

    getSubContent(value, key) {
        const type = this.guessType(value);
        const content = 'Literal' === type ? value : <JsonColumn value={value} />;
        const keyLabel = key ? <th className="active">{ key }</th> : null;

        return (
            <tr>
                {keyLabel}
                <td>{content}</td>
            </tr>
        );
    }

    render() {
        const value = this.props.value;
        const type = this.guessType(value);
        let result = null;
        let rows;

        switch (type) {
            case 'Array':
                rows = value.map((subValue) => this.getSubContent(subValue));

                result = <table className="table table-condensed"><tbody>{rows}</tbody></table>;
                break;

            case 'Object':
                rows = Object.keys(value).map((key) => this.getSubContent(value[key], key));

                result = <table className="table table-condensed table-bordered"><tbody>{rows}</tbody></table>;
                break;
        }

        return (
            <div>{result}</div>
        );
    }
}

JsonColumn.propTypes = {
    value: React.PropTypes.oneOfType([
        React.PropTypes.object,
        React.PropTypes.array
    ]).isRequired
};

require('../../autoloader')('JsonColumn', JsonColumn);

export default JsonColumn;
