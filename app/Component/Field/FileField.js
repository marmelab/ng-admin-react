import React from 'react';
const Upload = require('rc-upload/lib/Upload.jsx');

class FileField extends React.Component {
    constructor() {
        super();

        this.state = {
            progression: 0,
            error: null,
            message: null
        };
    }

    onChange(err, file) {
        this.props.updateField(this.props.name, file.name);

        this.setState({
            progression: 0,
            error: false,
            message: `${file.name} uploaded correctly.`
        });
    }

    onProgress(step) {
        this.setState({progression: step});
    }

    onError(error) {
        this.setState({
            progression: 0,
            error: true,
            message: error
        });
    }

    render() {
        const {field, value} = this.props;
        const uploadInformation = field.uploadInformation();
        if (!uploadInformation.hasOwnProperty('url')) {
            throw new Error('You must provide a URL property to allow the upload of files.');
        }

        const completed = +this.state.completed;
        let accept = '*';
        let message = null;
        if (uploadInformation.hasOwnProperty('accept')) {
            accept = typeof uploadInformation.accept === 'function' ? uploadInformation.accept() : "'" + uploadInformation.accept + "'";
        }

        const attributes = {
            action: uploadInformation.url,
            accept,
            onSuccess: this.onChange.bind(this),
            onProgress: this.onProgress.bind(this),
            onError: this.onError.bind(this)
        };

        if (this.state.message) {
            const className = `text-${this.state.error ? 'warning' : 'success'}`;

            message = <div className={className}>{this.state.message}</div>
        } else if (value) {
            message = <div>Current file: {value}</div>
        }

        return <div className="upload-field">
            <Upload {...attributes} className="form-control">
                <a className="btn btn-default">Browse</a>
            </Upload>

            {message}

            <div className="progressbar-container" >
                <div className="progressbar-progress" style={{width: completed + '%'}} />
            </div>
        </div>;
    }
}

FileField.propTypes = {
    name: React.PropTypes.string.isRequired,
    field: React.PropTypes.object.isRequired,
    value: React.PropTypes.any,
    updateField: React.PropTypes.func
};

require('../../autoloader')('FileField', FileField);

export default FileField;
