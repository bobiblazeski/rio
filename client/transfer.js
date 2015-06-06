var Store= require('../lib/store');
var Ramda = require('ramda');
var Constants = require('../lib/constants');

var socket = io();

var Transfer = module.exports = {};

Transfer.setup = function setup(socket){
    socket.on(Constants.listChange,function(change){
        Store.listChange.onNext(change);
    });
    socket.on(Constants.taskChange,function(change){
        Store.taskChange.onNext(change);
    });
    function emit(address, data){
        console.log(address,data);
        socket.emit(address, R.merge(data,{ user: Store.user.value.id}));
        console.log('after emit',address,data);
    }

    Store.taskCreate.skip(1).subscribe(R.partial(emit,Constants.taskCreate));
    Store.taskUpdate.skip(1).subscribe(R.partial(emit,Constants.taskUpdate));
    Store.taskDelete.skip(1).subscribe(R.partial(emit,Constants.taskDelete));

    Store.listCreate.skip(1).subscribe(R.partial(emit,Constants.listCreate));
    Store.listUpdate.skip(1).subscribe(R.partial(emit,Constants.listUpdate));
    Store.listDelete.skip(1).subscribe(R.partial(emit,Constants.listDelete));
    // User management
    Store.signInRequest.skip(1).subscribe(R.partial(emit,Constants.signInRequest));
    socket.on(Constants.signInResult,function(result){
        Store.signInResult.onNext(result);
    });
    Store.joinRequest.skip(1).subscribe(R.partial(emit,Constants.joinRequest));
    socket.on(Constants.joinResult, function(result){
        console.log(Constants.joinResult,result);
        Store.joinResult.onNext(result);
        console.log('after',Constants.joinResult,result);
    });
    Store.user.subscribe(function(user){
        Store.allLists.onNext(filtered(Store.allLists.value,user.id));
        Store.allTasks.onNext(filtered(Store.allTasks.value,user.id));
        emit(Constants.sendAll,user);
    });
};

Transfer.setup(socket);

Store.listChange.skip(1).subscribe(function(change){
    if(!change.new_val) { // DELETE
        Store.allLists.onNext(Store.allLists.value.delete(change.old_val.id));
    } else { // READ, UPDATE
        Store.allLists.onNext(Store.allLists.value.set(change.new_val.id, change.new_val));
    }
});

Store.taskChange.skip(1).subscribe(function(change){
    if(!change.new_val) { // DELETE
        Store.allTasks.onNext(Store.allTasks.value.delete(change.old_val.id));
    } else { // READ, UPDATE
        Store.allTasks.onNext(Store.allTasks.value.set(change.new_val.id, change.new_val));
    }
});

Store.signInResult.skip(1).subscribe(function(d){
    Store.user.onNext(d);
});

function filtered(map,user){
    return map.filter(function(d){
        return d.user == user;
    });
}
