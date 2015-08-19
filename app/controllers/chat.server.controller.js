'use strict';
var _ = require('lodash');

// Create the chat configuration
module.exports = function(io, socket, app) {
	// Emit the status event when a new socket client is connected

    io.emit('chatMessage', {
        type: 'status',
        text: socket.request.user.username + ' joined the conversation.',
        created: Date.now(),
        username: socket.request.user.username,
    });

    console.log(app.locals.socketCount);
 
    io.emit('analytics', {
        numUsers: ++app.locals.socketCount
    });
    // Send a chat messages to all connected sockets when a message is received 
    socket.on('chatMessage', function(message) {
        message.type = 'message';
        message.created = Date.now();
        message.username = socket.request.user.username;

        // Emit the 'chatMessage' event
        io.emit('chatMessage', message);
    });

    // Emit the status event when a socket client is disconnected
    socket.on('disconnect', function() {
        io.emit('chatMessage', {
            type: 'status',
            text: socket.request.user.username + ' left the conversation.',
            created: Date.now(),
            username: socket.request.user.username,
        });

        io.emit('analytics', {
            numUsers: --app.locals.socketCount
        });
    });
};
