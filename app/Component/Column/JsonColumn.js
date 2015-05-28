import React from 'react';

class JsonColumn extends React.Component {
    guessType(obj) {
        var type = Object.prototype.toString.call(obj);

        switch (type) {
            case '[object Object]': return 'Object';
            case '[object Array]': return 'Array';
            default: return 'Literal';
        }
    }

    getSubContent(value, key) {
        let type = this.guessType(value);
        let content = type === 'Literal' ? value : <JsonColumn value={value} />;
        let keyLabel = key ? <th className="active">{ key }</th>  : null;

        return <tr>
                    {keyLabel}
                    <td>{content}</td>
               </tr>;
    }

    render() {
        let value = this.props.value;
        let type = this.guessType(value);
        let getSubContent = this.getSubContent.bind(this);
        let result = null;

        switch (type) {
            case 'Array':
                let rows = value.map((subValue) => getSubContent(subValue));

                result = <table className="table table-condensed"><tbody>{rows}</tbody></table>;
                break;

            case 'Object':
                let rows = Object.keys(value).map((key) => getSubContent(value[key], key));

                result = <table className="table table-condensed table-bordered"><tbody>{rows}</tbody></table>;
                break;
        }

        return (
            <div>{result}</div>
        );
    }
}

export default JsonColumn;
