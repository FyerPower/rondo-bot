"use strict";

var _ = require('lodash');
var Commands    = require('../utilities/commands.js').Commands;
var Utilities   = require('../utilities/utilities.js').Utilities;
var RollHistory = require('../models/roll-history').RollHistory;

Commands.add("winner", {
    name: "winner",
    description: "Announces the winner of who had the higest rolls.",
    usage: "",
    process: function(message, suffix) {
        var numHighRollers = 1;
        if(parseInt(suffix) == suffix){
            numHighRollers = parseInt(suffix);
        }

        var highest = RollHistory.highest(numHighRollers);
        var msg = "";

        if(highest.length === 0){ 
            msg = message.author + ": There are no rolls currently recorded.";
        } else if(highest.length === 1){
            msg = "WINNER: \t" + highest[0].member + " with a roll of **" + highest[0].roll + "**";
        } else {
            highest = _.map(highest, (highRoller) => {
                return highRoller.member + " with **" + highRoller.roll + "**";
            });
            msg = "WINNERS: \t" + highest.join(", ");
        }
        
        message.channel.sendMessage(msg);
        Utilities.safeDeleteMessage(message);
    }
});