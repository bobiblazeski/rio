var Router = require('react-router');
var { Route, Redirect, RouteHandler, DefaultRoute, Link} = Router;

var App = require('./views/App');
var SignIn = require('./views/SignIn');
var Join = require('./views/Join');
var Tasks = require('./views/list/Tasks');
var Transfer = require('./transfer');


var routes = (
    <Route handler={App}>
        <DefaultRoute handler={Tasks}/>
        <Route name="tasks" path="/tasks/:name" handler={Tasks}/>
        <Route name="signin" path="signin" handler={SignIn}/>
        <Route name="join" path="join" handler={Join}/>
    </Route>
);

Router.run(routes, Router.HistoryLocation, function(Handler){
   React.render(<Handler/>, document.body)
});

// <ListsShow title={Store.lists[0].title} items={Store.lists[0].items} />