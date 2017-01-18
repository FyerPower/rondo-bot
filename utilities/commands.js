var ConfigFile = require("../config.json");

function Commands(){
    this.commandList = [];

    this.add = function(key, value){
        this.commandList[key] = value;
    };

    this.hasCommand = function(key){
        return this.commandList.hasOwnProperty(key);
    };

    this.getCommand = function(key){
        return this.commandList[key];
    };

    this.hasCooldown = function(key){
        var command = this.getCommand(key);
        if(command.hasOwnProperty("timeout") && command.hasOwnProperty("lastExecutedTime")){
            var lastExecutedTime = new Date(command.lastExecutedTime);
            lastExecutedTime.setSeconds(lastExecutedTime.getSeconds() + command.timeout);
            return (new Date()) < lastExecutedTime;
        }
        return false;
    };

    this.hasPermission = function(key, userId){
        var command = this.getCommand(key);
        if(command.hasOwnProperty("adminOnly") && command.adminOnly === true){
            return (ConfigFile.admin_ids.indexOf(userId) > -1);
        }
        return true;
    };

    this.execute = function(key, message, suffix){
        var command = this.getCommand(key);
        command.process(message, suffix);
    };
}

exports.Commands = new Commands();
