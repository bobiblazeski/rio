var Link = require('react-router').Link;
var Store = require('../../lib/store');


var ListTodos = module.exports = React.createClass({
    getInitialState: function(){
        return {
            lists: Immutable.Map({}),
            tasks: Immutable.Map({})
        }
    },
    componentWillMount : function(){
        Store.allLists.subscribe(function(lists){
            this.setState({ lists: lists });
        }.bind(this));
        Store.allTasks.subscribe(function(tasks){
            this.setState({ tasks: tasks });
        }.bind(this));
        this.onCreateList = function(){            
            Store.listCreate.onNext({
                user: '',
                name: 'List '+Math.random().toFixed(3).toString()
            });
        }
    },
    render: function () {
        var pairs=R.toPairs( R.groupBy(R.prop('id'),this.state.lists.toArray()));
        var tasksGrouped=R.groupBy(R.prop('list'),this.state.tasks.toArray());
        var items = pairs.map(function(pair){
            var key = pair[0];
            var count =  tasksGrouped.hasOwnProperty(key) ?
                R.reject(R.prop('done'), tasksGrouped[key]).length : 0;
            return (
                <Link to="tasks"
                      key={key}
                      params={{name:key}}
                      className="list-todo">
                    <span className="count-list">{count}</span>
                    {pair[1][0].name}
                </Link>
            );
        });
        return (
            <div className="list-todos">
                <a className="js-new-list link-list-new" onClick={this.onCreateList}>
                    <span className="icon-plus"></span>New List</a>
                {items}
            </div>
        );
    }
});