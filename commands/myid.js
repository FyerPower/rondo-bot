"use strict";

var Commands = require('../utilities/commands.js').Commands;

Commands.add("myid", {
    name: "myid",
    description: "Returns the user id of the sender.",
    excludeInHelp: true,
    process: function(message) {
        message.channel.sendMessage(message.author.id);
    }
});
