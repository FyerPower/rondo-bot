"use strict";

var Commands = require('../utilities/commands.js').Commands;
var RollHistory = require('../models/roll-history').RollHistory;

Commands.add("item", {
    name: "item",
    description: "",
    usage: "[item name]",
    process: function(message, suffix) {
        RollHistory.clear();
        var response = "**==-==-==-==-==-==-==**\n";
        response    += "__Item__:   **"+suffix+"**\n";
        response    += "__Roll__:    type `-roll`\n";
        response    += "**==-==-==-==-==-==-==**";
        message.channel.sendMessage(response);
        safeDeleteMessage(message);
    }
});


function safeDeleteMessage(message){
    setTimeout(function(){
        message.delete();
    }, 100);
}
