"use strict";

var ConfigFile = require("../config.json");

class Commands {
    constructor(){
        this.commandList = [];
    }

    add(key, value){
        this.commandList[key] = value;
    }

    hasCommand(key) {
        return this.commandList.hasOwnProperty(key);
    }

    getCommand(key) {
        return this.commandList[key];
    }

    getCommands() {
        return this.commandList;
    }

    hasCooldown(key) {
        var command = this.getCommand(key);
        if(command.hasOwnProperty("timeout") && command.hasOwnProperty("lastExecutedTime")){
            var lastExecutedTime = new Date(command.lastExecutedTime);
            lastExecutedTime.setSeconds(lastExecutedTime.getSeconds() + command.timeout);
            return (new Date()) < lastExecutedTime;
        }
        return false;
    }

    hasPermission(key, userId) {
        var command = this.getCommand(key);
        if(command.hasOwnProperty("adminOnly") && command.adminOnly === true){
            return (ConfigFile.admin_ids.indexOf(userId) > -1);
        }
        return true;
    }

    execute(key, message, suffix, client) {
        var command = this.getCommand(key);
        command.process(message, suffix, client);
    }
}

exports.Commands = new Commands();
