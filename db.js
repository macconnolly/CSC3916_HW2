/**
 * Created by Mac Connolly on 2/11/19.
 */

'use strict;';

let crypto = require('crypto');

module.exports = function () {
    return {
        userList: [],

        /*
        *  Save the user inside the "db"
        */

        save: function(user) {
            user.id = crypto.randomBytes(20).toString('hex');
            this.userList.push(user);
            // console.log(this.userList);
            return 1;

        },
        /*
        *  Retrieve a movie with a given id or return all of the movies if ID is undefined.
        */
        find: function (id) {
            // console.log('Finding id: ' + id);
            if(id) {
                return this.userList.find(function (element) {
                    // console.log('find element id = ' + element.id);
                    return element.id === id;

                });
            }
            else {
                return this.userList;
            }
        },
        findOne: function (name) {
            // console.log('Finding on username: ' + name);
            if (name) {
                return this.userList.find(function (element) {
                    // console.log('Find One Found element id: ' + element.id)
                    return element.username === name;
                });
            }
            else {

                return this.userList;
            }
        }
    }
}