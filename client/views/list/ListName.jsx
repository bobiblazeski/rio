var Store = require('../../../lib/store');

var TaskName = module.exports = React.createClass({
    contextTypes: {
        router: React.PropTypes.func
    },
    getInitialState: function () {
        return { edit: false }
    },
    componentWillMount: function () {
        this.onDeleteList = function () {
            Store.listDelete.onNext({ id: this.props.listId });
            this.context.router.transitionTo('/');
        }.bind(this);
        this.onEditList = function(){
            this.setState({edit:true});
        }.bind(this);
        this.onUpdateListName = function(e){
            e.preventDefault();
            var listName = React.findDOMNode(this.refs.listName).value.trim();
            if(listName && listName != '') {
                Store.listUpdate.onNext({
                    id: this.props.listId,
                    name: listName
                });
                this.setState({ edit:false }, function(){
                    React.findDOMNode(this.refs.theInput).value
                }.bind(this));
            }
        }.bind(this);
        this.onCreateTask = function(e){
            e.preventDefault();
            var taskName = React.findDOMNode(this.refs.taskName).value.trim();
            if(taskName && taskName != '') {
                Store.taskCreate.onNext({
                    done: false,
                    item: taskName,
                    list: this.props.listId
                });
                this.setState({ edit:false },function(){
                    React.findDOMNode(this.refs.taskName).value = '';
                }.bind(this));
            }

        }.bind(this);
    },
    render: function () {
        var listName = this.state.edit ?
            (<form className="js-edit-form list-edit-form" onSubmit={this.onUpdateListName}>
                <input type="text"
                       name="name"
                       ref="listName"
                       defaultValue={this.props.listName}></input>
                <div className="nav-group right">
                    <a href="#" className="js-cancel nav-item">
                        <span className="icon-close js-cancel" title="Cancel"></span>
                    </a>
                </div>
            </form>) :
            (<div>
                <div className="nav-group">
                    <a href="#" className="js-menu nav-item">
                        <span className="icon-list-unordered" title="Show menu"></span>
                    </a>
                </div>
                <h1 className="js-edit-list title-page">
                    <span className="title-wrapper" onClick={this.onEditList}>{this.props.listName}</span>
                    <span className="count-list">{this.props.tasks.length}</span>
                </h1>
                <div className="nav-group right">
                    <div className="options-web">
                        <a className="js-toggle-list-privacy nav-item">
                            <span className="icon-unlock" title="Make list private"></span>
                        </a>
                        <a className="js-delete-list nav-item"
                           onClick={this.onDeleteList}>
                            <span className="icon-trash" title="Delete list"></span>
                        </a>
                    </div>
                </div>
            </div>);
        return (
            <nav className="js-title-nav">
                {listName}
                <form className="js-todo-new todo-new input-symbol" onSubmit={this.onCreateTask}>
                    <input type="text" placeholder="Type to add new tasks" ref="taskName" />
                    <span className="icon-add js-todo-add"></span>
                </form>
            </nav>
        );
    }
});