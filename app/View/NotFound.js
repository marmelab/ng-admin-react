import React from 'react';

class NotFoundView extends React.Component {
    render() {
        return (
            <div>
                <div className="row">
                    <div className="col-lg-12">
                        <div className="page-header">
                            <h1>Not Found</h1>
                        </div>
                    </div>
                </div>

                <div className="row dashboard-content">
                    <div className="col-lg-12">
                        The page you are looking for cannot be found. Take a break before trying again.
                        <br/>
                        <br/>
                        <br/>
                        <br/>
                    </div>

                    <pre className="ascii col-lg-offset-4 col-lg-4 col-md-offset-3 col-md-6 col-sm-offset-2 col-sm-8 col-cs-offset-1 col-xs-10">
<br/>
&nbsp;         |\      _,,,---,,_<br/>
&nbsp;         /,`.-'`'    -.  ;-;;,_<br/>
&nbsp;        |,4-  ) )-,_..;\ (  `'-'<br/>
&nbsp;       '---''(_/--'  `-'\_)<br/>
<br/>
                    </pre>
                </div>
            </div>
        );
    }
}

require('../autoloader')('NotFoundView', NotFoundView);

export default NotFoundView;
