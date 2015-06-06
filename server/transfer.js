var socketIo = require('socket.io');
var R = require('ramda');
var Data = require('./data');
var Db = require('./db');
var Store = require('../lib/store');
var Constants = require('../lib/constants');

var Transfer = module.exports = {};


Transfer.setup = function setup(server) {
    var io = socketIo(server);
    io.on('connection', function (socket) {
        Db.setup(function (err) {
            if (!err) {
                Db.changes(Store.listChange,'list');
                Db.changes(Store.taskChange,'task');
                listen(socket);
            }
            console.log('Database setup err:', err);
        });
    });
};

Store.joinRequest.skip(1).subscribe(function (val) {
    Db.join(val, function (res) {
        Store.joinResult.onNext(res);
    });
});

Store.signInRequest.skip(1).subscribe(function (val) {
    Db.signIn(val, function (res) {
        Store.signInResult.onNext(res);
    });
});


Store.taskCreate.skip(1).subscribe(R.partial(Db.createEntry,'task'));
Store.taskUpdate.skip(1).subscribe(Db.taskUpdate);
Store.taskDelete.skip(1).subscribe(Db.taskDelete);

Store.listCreate.skip(1).subscribe(R.partial(Db.createEntry,'list'));
Store.listUpdate.skip(1).subscribe(Db.listUpdate);
Store.listDelete.skip(1).subscribe(Db.listDelete);

var toChange = R.map(function (entry) {
    return entry.hasOwnProperty('old_val') ? entry
        : {old_val: null, new_val: entry};
});

function listen(socket) {
    function emit(address, change) {
        socket.emit(address, change);
    }

    socket.on(Constants.sendAll, function sendAll(user) {
        Db.allLists(user.id, function (err, res) {
            toChange(err ? [] : res).forEach(function (d) {
                emit(Constants.listChange, d);
            });
        });
        Db.allTasks(user.id, function (err, res) {
            toChange(err ? [] : res).forEach(function (d) {
                emit(Constants.taskChange, d);
            });
        });
    });

    Store.listChange.skip(1).subscribe(R.partial(emit, Constants.listChange));
    Store.taskChange.skip(1).subscribe(R.partial(emit, Constants.taskChange));
    Store.signInRequest.skip(1).subscribe(function (data) {
        socket.emit('signin', data);
    });
    function onNext(subject, data) {
        console.log(data);
        subject.onNext(data);
    }

    socket.on(Constants.taskCreate, R.partial(onNext, Store.taskCreate));
    socket.on(Constants.taskUpdate, R.partial(onNext, Store.taskUpdate));
    socket.on(Constants.taskDelete, R.partial(onNext, Store.taskDelete));
    socket.on(Constants.listCreate, R.partial(onNext, Store.listCreate));
    socket.on(Constants.listUpdate, R.partial(onNext, Store.listUpdate));
    socket.on(Constants.listDelete, R.partial(onNext, Store.listDelete));
    socket.on(Constants.joinRequest, R.partial(onNext, Store.joinRequest));
    socket.on(Constants.signInRequest, R.partial(onNext, Store.signInRequest));

    Store.joinResult.skip(1).subscribe(function (data) {
        socket.emit(Constants.joinResult, data);
    });
    Store.signInResult.skip(1).subscribe(function (data) {
        socket.emit(Constants.signInResult, data);
    });
}
   