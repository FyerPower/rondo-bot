"use strict";

var _ = require('lodash');
var ConfigFile = require("../config.json");
var Commands = require('../utilities/commands.js').Commands;
var Logger   = require("../utilities/logger.js").Logger;

Commands.add("help", {
    name: "help",
    description: "",
    excludeInHelp: true,
    process: function(message, suffix) {
        suffix = suffix.toLowerCase();
        if(suffix === "") {
            var msgArray = [];
            msgArray.push("These are the currently avalible commands, use `" + ConfigFile.command_prefix + "help <command_name>` to learn more about a specific command.");
            _.forEach(Commands.getCommands(), (command, key) => {
                if(!command.hasOwnProperty("excludeInHelp") || command.excludeInHelp === false){
                    msgArray.push("\t`" + ConfigFile.command_prefix + key + "`")
                }
            });
            message.channel.sendMessage(msgArray);
        } else if(suffix === "help") {
            message.channel.sendMessage(message.author + ": You cannot help help.");
        } else {
            var command = Commands.getCommand(suffix);
            if(command) {
                var msgArray = [];
                msgArray.push("**Command:** `" + command.name + "`");
                if(command.hasOwnProperty("usage")){
                    msgArray.push("**Usage:** `" + ConfigFile.command_prefix + command.name + " " + command.usage + "`");
                }
                if(command.hasOwnProperty("description") && command.description){
                    msgArray.push("**Description:** " + command.description);
                }

                message.channel.sendMessage(msgArray);
            } else {
                message.channel.sendMessage(message.author + ": No command `"+suffix+"` could be found.");
            }
        }
    }
});