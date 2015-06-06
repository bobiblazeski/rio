var Store = require('../../../lib/store');

var TaskItems = module.exports = React.createClass({
    componentWillMount: function(){
        this.onChecked = function(user,taskId,event) {
            Store.taskUpdate.onNext({
                id: taskId,
                user: user,
                done: event.target.value
            })
        }.bind(this);
    },
    render: function(){
        var items = this.props.tasks.map(function (d) {
            var key = d.user+':'+d.list+':'+d.item;
            return (
                <div key={key} className="list-item">
                    <label className="checkbox">
                        <input type="checkbox"
                               name="checked"
                               defaultChecked={d.done}
                               onChange={R.partial(this.onChecked,d.user,d.id)} />
                        <span className="checkbox-custom"></span>
                    </label>
                    <input type="text" placeholder={d.item}/>
                    <a className="js-delete-item delete-item" href="#">
                        <span className="icon-trash"></span>
                    </a>
                </div>
            );
        }.bind(this));
        return (
            <div className="content-scrollable list-items">
                {items}
            </div>
        );
    }
});