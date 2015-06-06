var { RouteHandler} = require('react-router');

var Notifications = require('./Notifications');
var ListTodos = require('./ListTodos');
var User = require('./User');

var App = module.exports = React.createClass({
    render: function () {
        return (
            <div id="container">
                <section id="menu">
                    <User />
                    <ListTodos />
                </section>
                <div className="content-overlay"></div>

                <div id="content-container">
                    <RouteHandler/>
                </div>
            </div>
        );
    }
});
//Below  <div className="content-overlay"></div>
// <Notifications />