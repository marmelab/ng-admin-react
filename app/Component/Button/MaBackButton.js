import React from 'react';

class MaBackButton extends React.Component {
    back() {
        window.history.back();
    }
    render() {
        let size = this.props.size ? ' btn-' + size : '',
            className = 'btn btn-default' + size;

        return (
            <a className={className} click={this.back}>
                <span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>&nbsp;{this.props.label || 'Back'}
            </a>
        );
    }
}

MaBackButton.propTypes = {
    size: React.PropTypes.string,
    label: React.PropTypes.string
};

export default MaBackButton;
