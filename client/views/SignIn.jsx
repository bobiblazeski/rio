var Link = require('react-router').Link;
var Store = require('../../lib/store');

var SignIn = module.exports = React.createClass({
    contextTypes: {
        router: React.PropTypes.func
    },
    getInitialState: function () {
        return {
            enabled : false,
            errors: []
        }
    },
    componentWillMount: function () {
        this.onSignIn = function(e){
            e.preventDefault();
            var email = React.findDOMNode(this.refs.email).value;
            var password = React.findDOMNode(this.refs.password).value;
            Store.signInRequest.onNext({
                email: email,
               password: password
            });
        }.bind(this);
    },
    render: function () {
        return (
            <div className="page auth">
                <nav>
                    <div className="nav-group">
                        <a href="#" className="js-menu nav-item">
                            <span className="icon-list-unordered"></span>
                        </a>
                    </div>
                </nav>
                <div className="content-scrollable">
                    <div className="wrapper-auth">
                        <h1 className="title-auth">Sign In.</h1>
                        <p className="subtitle-auth">Signing in allows you to view private lists</p>
                        <form onSubmit={this.onSignIn}>
                            <div className="list-errors">
                                <div className="list-item"></div>
                            </div>
                            <div className="input-symbol">
                                <input type="email" name="email" placeholder="Your Email" ref='email'/>
                                <span className="icon-email" title="Your Email"></span>
                            </div>
                            <div className="input-symbol">
                                <input type="password" name="password" placeholder="Password" ref='password'/>
                                <span className="icon-lock" title="Password"></span>
                            </div>
                            <button type="submit" className="btn-primary">Sign in</button>
                        </form>
                    </div>
                    <Link to="join" className="link-auth-alt">Need an account? Join Now.</Link>
                </div>
            </div>
        );
    }
});