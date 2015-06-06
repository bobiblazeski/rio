var { Link} = require('react-router');

var Store = require('../../lib/store');
var Constants = require('../../lib/constants');

var User = module.exports = React.createClass({
    getInitialState: function () {
        return Store.user.value;
    },
    componentWillMount: function () {

        this.onLogout = function(){
            Store.user.onNext(Constants.user);
        }
    },
    render: function () {
        return this.state.email === '' ?
            (<div className="btns-group">
                <Link to="/signin" className="btn-secondary">Sign In</Link>
                <Link to="/join" className="btn-secondary">Join</Link>
            </div>) :
            (<div className="btns-group-vertical">
                <a className="js-user-menu btn-secondary" href="#">
                    <span className="icon-arrow-up"></span>
                    {this.state.email}
                </a>
                <a className='js-logout btn-secondary' onClick={this.onLogout}>LOGOUT</a>
            </div>);
    },
    componentDidMount: function(){
        Store.user.skip(1).subscribe(function(user){
            console.log('User componentWillMount',user);
            this.setState(user);
        }.bind(this));
    }

});

