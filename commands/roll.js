"use strict";

var Commands    = require('../utilities/commands.js').Commands;
var Utilities   = require('../utilities/utilities.js').Utilities;
var RollHistory = require('../models/roll-history').RollHistory;

Commands.add("roll", {
    name: "roll",
    description: "Random number generator, yay!",
    extendedhelp: "I'll randomize some numbers for you, handy!",
    usage: "[number] | -roll [behalfOf] | -roll [number] [behalfOf]",
    process: function(message, suffix) {
        var maxRoll = 100;
        var behalfOf = "";
        suffix = suffix.trim();
        if(suffix){
            var parts = suffix.split(" ");
            if(parseInt(parts[0]) == parts[0]){
                maxRoll = parseInt(parts[0]);
                if(parts.length > 1){
                    behalfOf = suffix.substring(suffix.indexOf(" "), suffix.length);
                }
            } else {
                behalfOf = suffix.substring(suffix.indexOf(" "), suffix.length);
            }
        }
        var roll = Math.ceil(Math.random() * maxRoll);
        RollHistory.add(message.author, roll);
        if(behalfOf){
            message.channel.sendMessage(message.author + " (for "+behalfOf+") rolled a number between 1-"+maxRoll+" and received **" + roll + "**");
        } else {
            message.channel.sendMessage(message.author + " rolled a number between 1-"+maxRoll+" and received **" + roll + "**");
        }
        Utilities.safeDeleteMessage(message);
    }
});
