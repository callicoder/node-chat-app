'use strict';

var passport = require('passport');

module.exports = function(app) {
	// User Routes
	var users = require('../../app/controllers/users.server.controller');

    // Setting up the users authentication api
    app.route('/auth/signup').post(users.signup);
    app.route('/auth/signin').post(users.signin);
    app.route('/auth/signout').get(users.signout);
};
