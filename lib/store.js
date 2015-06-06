var Rx = require('rx');
var Immutable = require('immutable');
var Constants = require('./constants');

var Store = module.exports = {
    user : new Rx.BehaviorSubject(Constants.user), // Client only
    allLists : new Rx.BehaviorSubject(Immutable.Map({})),// Client only
    allTasks : new Rx.BehaviorSubject(Immutable.Map({})),// Client only
    sendAll: new Rx.BehaviorSubject(),

    signInRequest : new Rx.BehaviorSubject(),
    signInResult : new Rx.BehaviorSubject(),
    joinRequest : new Rx.BehaviorSubject(),
    joinResult : new Rx.BehaviorSubject(),
    listChange : new Rx.BehaviorSubject(),
    listCreate : new Rx.BehaviorSubject(),
    listUpdate : new Rx.BehaviorSubject(),
    listDelete : new Rx.BehaviorSubject(),
    taskChange : new Rx.BehaviorSubject(),
    taskCreate : new Rx.BehaviorSubject(),
    taskUpdate : new Rx.BehaviorSubject(),
    taskDelete : new Rx.BehaviorSubject()
};