"use strict";

var _ = require('lodash');
var ConfigFile = require("../config.json");
var Commands = require('../utilities/commands.js').Commands;

Commands.add("help", {
    name: "help",
    description: "",
    process: function(message, suffix) {
        suffix = suffix.toLowerCase();
        if(suffix === "") {
            message.channel.sendMessage("These are the currently avalible commands, use `" + ConfigFile.command_prefix + "help <command_name>` to learn more about a specific command.\n\n`" + ConfigFile.command_prefix + _.keys(Commands.getCommands()).join("`\n`"+ConfigFile.command_prefix) + "`");
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

                message.channel.sendMessage(msgArray.join("\n"));
            } else {
                message.channel.sendMessage(message.author + ": No command `"+suffix+"` could be found.");
            }
        }
    }
});