"use strict";

var Commands = require('../utilities/commands.js').Commands;
var Logger   = require("../utilities/logger.js").Logger;

Commands.add("clean", {
    name: "clean",
    usage: "",
    description: "Looks at the last 10 messages, deletes any made by users (unless its pinned)",
    process: function(message, suffix, client) {
        if (message.channel.type != "text") {
            message.channel.sendMessage("You can only do this in a guilds text channel, dummy!");
            return;
        }
        if (!message.channel.permissionsFor(message.author).hasPermission("MANAGE_MESSAGES")) {
            message.channel.sendMessage("Sorry, your permissions doesn't allow that.");
            return;
        }
        if (!message.channel.permissionsFor(client.user).hasPermission("MANAGE_MESSAGES")) {
            message.channel.sendMessage("I don't have permission to do that!");
            return;
        }
        
        message.channel.fetchMessages({limit: 11}).then(messages => {
            messages.filter(msg => {
                return !msg.author.bot && !msg.pinned;
            }).deleteAll();
        });
    }
});
