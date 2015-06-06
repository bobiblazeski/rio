var R = require('ramda');
var Constants = require('../lib/constants');


var lists = [
    {
        user:Constants.user.id,
        name: "Meteor Principles",
        items: ["Data on the Wire",
            "One Language",
            "Database Everywhere",
            "Latency Compensation",
            "Full Stack Reactivity",
            "Embrace the Ecosystem",
            "Simplicity Equals Productivity"
        ]
    },
    {
        user:Constants.user.id,
        name: "Languages",
        items: ["Lisp",
            "C",
            "C++",
            "Python",
            "Ruby",
            "JavaScript",
            "Scala",
            "Erlang",
            "6502 Assembly"
        ]
    },
    {
        user:Constants.user.id,
        name: "Favorite Scientists",
        items: ["Ada Lovelace",
            "Grace Hopper",
            "Marie Curie",
            "Carl Friedrich Gauss",
            "Nikola Tesla",
            "Claude Shannon"
        ]
    }
];

exports.lists = R.map(R.pick(['name','user']),lists);

exports.tasks = function (dbLists) {
    console.log(dbLists);
    return R.reduce(function(acc,d) {
        return acc.concat(R.map(function (e) {
            var dbList = R.find(function(dbEntry){
                return dbEntry.name == d.name;
            },dbLists);
            return {
                user: Constants.user.id,
                list: dbList.id,
                item: e,
                done: false
            }
        }, d.items));
    },[],lists);
};


