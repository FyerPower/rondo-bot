"use strict";

var Commands = require('../utilities/commands.js').Commands;
var Logger   = require("../utilities/logger.js").Logger;

Commands.add("purge", {
    name: "purge",
    usage: "[number-of-messages-to-delete] [force]",
    description: "I'll delete a certain ammount of messages.",
    process: function(message, suffix, client) {
        if (message.channel.type != "text") {
            message.channel.sendMessage("You can only do this in a guilds text channel, dummy!");
            return;
        }
        if (!suffix){
            message.channel.sendMessage("Please define an ammount of messages for me to delete!");
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
        
        var suffixParts = suffix.split(" ");
        var numMessages = parseInt(suffixParts[0]);
        var forceful = suffixParts.length > 1 && suffixParts[1].toLowerCase() === "force";

        if(suffixParts[0] != numMessages){
            message.channel.sendMessage("The first argument must be a valid number");
            return;
        }
        if (numMessages > 20 && !forceful){
            message.channel.sendMessage("I can't delete that much messages in safe-mode, add `force` to the end of your message to force me to delete.");
            return;
        }
        if (numMessages > 100){
            message.channel.sendMessage("The maximum number of message that can be purged is 100 (20 without `force`)");
            return;
        }

        message.channel.fetchMessages({limit: numMessages}).then(messages => {
            messages.deleteAll();
            message.channel.sendMessage("Deleted "+numMessages+" messages.").then(msg => {
                client.setTimeout(() =>{
                    msg.delete();
                }, 3000);
            });
        });
    }
});
