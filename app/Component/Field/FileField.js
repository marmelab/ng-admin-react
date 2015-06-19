import React from 'react';
const Upload = require('rc-upload/lib/AjaxUploader.jsx');

class FileField extends React.Component {
    constructor() {
        super();

        this.state = {
            progression: 0,
            error: null,
            message: null
        };
    }

    onChange(response, file) {
        const setState = this.setState.bind(this);
        const field = this.props.field;
        const uploadInformation = field.uploadInformation();
        const apiFilename = uploadInformation.hasOwnProperty('apifilename') ? uploadInformation.apifilename : false;
        let fileName = file.name;

        if (response && apiFilename) {
            if (typeof(response) === 'string') {
                response = JSON.parse(response);
            }

            fileName = response[apiFilename];
        }

        this.props.updateField(this.props.name, fileName);

        setState({
            progression: 100,
            error: false,
            message: `${file.name} uploaded correctly.`
        });

        setTimeout(() => (
            setState({progression: null})
        ), 1000);
    }

    onProgress(step) {
        this.setState({progression: step});
    }

    empty() {
        this.setState({
            progression: 0,
            error: false,
            message: null
        });

        this.props.updateField(this.props.name, null);
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
        const {progression, message, error} = this.state;
        const uploadInformation = field.uploadInformation();
        if (!uploadInformation.hasOwnProperty('url')) {
            throw new Error('You must provide a URL property to allow the upload of files.');
        }

        const completed = +progression;
        const empty = this.empty.bind(this);
        let accept = '*';
        let messageBlock = null;
        const progressBarStyles = {
            width: completed + '%'
        };

        if (progression === null){
            progressBarStyles.display = 'none';
        }

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

        if (message) {
            const className = `text-${error ? 'warning' : 'success'}`;

            messageBlock = <div className={className}>{message}</div>
        } else if (value) {
            messageBlock = <div>Current file: {value} - <a onClick={empty}>Remove</a></div>
        }

        return <div className="upload-field">
            <div>
                <Upload {...attributes} className="form-control">
                    <a className="btn btn-default">Browse</a>
                </Upload>
            </div>

            <div className="progressbar-container" >
                <div className="progressbar-progress" style={progressBarStyles} />
            </div>

            {messageBlock}
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
