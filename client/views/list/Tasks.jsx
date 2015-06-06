var Store = require('../../../lib/store');
var TaskItems = require('./TaskItems.jsx');
var ListName = require('./ListName.jsx');

var Tasks = module.exports = React.createClass({
    contextTypes: {
        router: React.PropTypes.func
    },
    getInitialState: function () {
        return {
            lists: Store.allLists.value,
            tasks: Store.allTasks.value
        }
    },
    componentWillMount: function () {
        Store.allLists.subscribe(function (lists) {
            this.setState({lists: lists});
        }.bind(this));
        Store.allTasks.subscribe(function (tasks) {
            this.setState({tasks: tasks});
        }.bind(this));
    },
    render: function () {
        var nameParam = this.context.router.getCurrentParams().name;
        if (!nameParam && this.state.lists.count() > 0) {
            nameParam = this.state.lists.first().id;
        }
        var list = this.state.lists.get(nameParam) || {id: '', name: 'unknown'};
        var tasksGrouped = R.groupBy(R.prop('list'), this.state.tasks.toArray());
        var tasks = tasksGrouped.hasOwnProperty(nameParam) ?
            tasksGrouped[nameParam] : [];
        return (
            <div className="page lists-show">
                <ListName listId={list.id} listName={list.name} tasks={tasks}/>
                <TaskItems tasks={tasks}/>
            </div>
        );
    }
});