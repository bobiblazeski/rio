var async = require('async');
var R = require('ramda');
var data = require('./data');
var Constants = require('../lib/constants');


var r = require('rethinkdbdash')({
    host: 'localhost',
    port: 28015,
    db: 'test'
});

var Db = module.exports = {};


Db.allTasks = function (userId, cb) {
    r.db('rio').table('task').filter({user: userId}).run(cb);
};

Db.allLists = function (userId, cb) {
    r.db('rio').table('list').filter({user: userId}).run(cb);
};


function logError(err) {
    if (err) console.log(err);
}
Db.changes = function (subject,table) {
    r.db('rio').table(table).changes().run(function iterateCursor(err, cursor) {
        cursor.each(function (res, change) {
            subject.onNext(change);
        });
    });
};

Db.createEntry = function (table,data) {
    r.db('rio').table(table).insert(data).run(logError);
};


Db.taskUpdate = function (task) {
    r.db('rio').table('task').get(task.id).update(task).run(logError);
};

Db.taskDelete = function (task) {
    r.db('rio').table('task').get(task.id).delete().run(logError);
};

Db.listUpdate = function (info) {
    r.db('rio').table('list').get(info.id).update({name: info.name}).run(logError);
};

Db.listDelete = function (data) {
    r.db('rio').table('list').get(data.id).delete().run(logError);
};

Db.signIn = function signIn(info, cb) {
    r.db('rio').table('user').filter(R.pick(['email', 'password'], info))
        .run(function (err, res) {
            cb(err || res.length == 0 ? Constants.user : res[0])
        });
};

Db.join = function join(info, cb) {
    r.db('rio').table('user')
        .filter({email: info.email})
        .run(function (err, res) {
            if (err) {
                cb({errors: [err]});
            } else {
                r.db('rio').table('user')
                    .insert(R.omit(['id'], info))
                    .run(function (err, res) {
                        cb(!err && res.inserted ? {
                            email: info.email,
                            id: res.generated_keys[0]
                        } : {errors: ['server error']});
                    });
            }
        });
};

Db.setup = function setup(mainCallback) {
    async.waterfall([
        function (callback) {
            r.dbList().run(function (err, res) {
                callback(err, res);
            });
        },
        function (databases, callback) {
            if (databases.indexOf('rio') == -1) {
                r.dbCreate('rio').run(function (err) {
                    callback(err, true);
                });
            } else {
                callback(null, false);
            }
        },
        function (create, callback) {
            if (create) {
                r.db('rio').tableCreate('user')
                    .run(function (err, res) {
                        callback(err, create);
                    });
            } else {
                callback(null, create);
            }

        },
        function (create, callback) {
            if (create) {
                r.db('rio').tableCreate('list')
                    .run(function (err, res) {
                        callback(err, create);
                    });
            } else {
                callback(null, create);
            }
        },
        function (create, callback) {
            if (create) {
                r.db('rio').tableCreate('task')
                    .run(function (err, res) {
                        callback(err, create);
                    });
            } else {
                callback(null, create);
            }
        },
        function (create, callback) {
            if (create) {
                r.db('rio').table('list').insert(data.lists)
                    .run(function (err, res) {
                        callback(err, res);
                    });
            } else {
                callback(null, create);
            }
        },
        function (create, callback) {
            if (create) {
                r.db('rio').table('list')
                    .run(function (err, res) {
                        if (err) {
                            callback(err, res);
                        } else {
                            r.db('rio').table('task').insert(data.tasks(res))
                                .run(function (err, res) {
                                    callback(err, res);
                                });
                        }
                    });
            } else {
                callback(null);
            }
        }
    ], function (err, res) {
        mainCallback(err, res);
    })
};

