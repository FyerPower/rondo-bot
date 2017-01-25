"use strict";

var Commands    = require('../utilities/commands.js').Commands;
var Utilities   = require('../utilities/utilities.js').Utilities;

Commands.add("pass", {
    name: "pass",
    description: "Informs everyone the member has passed on a roll opportunity",
    excludeInHelp: true,
    process: function(message) {
        var choices = [
            " has passed.",
            " opted out of rolling.",
            " feels they are too good for this item.",
            " is not ~~interesting~~interested.",
            " doesn't want this piece of @%^! item."
        ];
        message.channel.sendMessage(message.author + choices[Math.floor(Math.random()*choices.length)]);
        Utilities.safeDeleteMessage(message);
    }
});
