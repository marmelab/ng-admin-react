import React from 'react';

class MaBackButton extends React.Component {
    back() {
        window.history.back();
    }
    render() {
        const size = this.props.size ? ` btn-${this.props.size}` : '',
            className = `btn btn-back btn-default${size}`;

        return (
            <a className={className} onClick={this.back}>
                <span className="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>&nbsp;{this.props.label || 'Back'}
            </a>
        );
    }
}

MaBackButton.propTypes = {
    size: React.PropTypes.string,
    label: React.PropTypes.string
};

require('../../autoloader')('MaBackButton', MaBackButton);

export default MaBackButton;
