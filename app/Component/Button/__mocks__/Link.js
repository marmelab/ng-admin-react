const React = require('react/react');

class Link extends React.Component {
    constructor() {
        super();

        this.state = {clickedTo: ''};
    }
    click(e) {
        e.preventDefault();

        // Unable to read state from outside (in the test for instance)
        // So we pass params in props
        this.setState({
            clickedTo: this.props.to,
            params: JSON.stringify(this.props.params),
            query: JSON.stringify(this.props.query)
        });
    }
    render() {
        return <a className={this.props.className} data-click-to={this.state.clickedTo} data-params={this.state.params} data-query={this.state.query} onClick={this.click.bind(this)}>{this.props.children}</a>
    }
}

export default Link;
