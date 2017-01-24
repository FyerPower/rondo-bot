"use strict";

var Commands = require('../utilities/commands.js').Commands;

Commands.add("random", {
    name: "random",
    description: "Returns a random item from the supplied choices",
    usage: "[comma seperated list]",
    process: function(message, suffix, client) {
        var choices = suffix.split(",");
        var index = Math.ceil(Math.random() * choices.length) - 1;
        message.channel.sendMessage(message.author+": You should go with **"+choices[index].trim()+"**");
    }
});
