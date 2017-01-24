"use strict";

var _ = require('lodash');
var ConfigFile = require("../config.json");
var Commands   = require('../utilities/commands.js').Commands;
var Utilities  = require('../utilities/utilities.js').Utilities;
var MessageQueue = require('../models/message-queue.js').MessageQueue;
var moment     = require('moment'); 

var FamiliarData = {
    // Hakanas Highlands
    "garme":    { name: "Garme",                 grade: "H", respawn: 60,    confirmed: true, tabs: 2 }, 
    "agnes":    { name: "Agnes the Red",         grade: "H", respawn: 60,    confirmed: true, tabs: 2 }, 
    // Parna's Coast
    "terror":   { name: "Terror Kerav",          grade: "H", respawn: 120,   confirmed: true, tabs: 2 },
    "caspert":  { name: "Venomous Caspert",      grade: "H", respawn: 120,   confirmed: true, tabs: 1 },
    "apoc":     { name: "Apocolypse",            grade: "H", respawn: 300,   confirmed: true, tabs: 4 },
    "karresh":  { name: "Karresh",               grade: "H", respawn: 140,   confirmed: true, tabs: 1 },
    // Triteal Rift
    "leto":     { name: "Void Letonsia",         grade: "H", respawn: 120,   confirmed: false, tabs: 2 },
    "void":     { name: "Void Kargyle",          grade: "H", respawn: 120,   confirmed: false, tabs: 2 },
    "twilight": { name: "Twilight Kargyle",      grade: "H", respawn: 120,   confirmed: false, tabs: 2 },
    "femuto":   { name: "Femuto",                grade: "H", respawn: 120,   confirmed: false, tabs: 2 },
    "lunafont": { name: "Lunafont",              grade: "H", respawn: 60,    confirmed: false, tabs: 2 },
    "karasha":  { name: "Karasha the Dark One",  grade: "H", respawn: 120,   confirmed: false, tabs: 2 },
    "paragas":  { name: "Paragas the Mad",       grade: "H", respawn: 120,   confirmed: false, tabs: 2 },
    "veldon":   { name: "Veldon",                grade: "H", respawn: 120,   confirmed: false, tabs: 2 },
    // Cloying Wastes
    "trino":    { name: "Trinoceros",            grade: "H", respawn: 120,   confirmed: false, tabs: 2 },
    "poyo":     { name: "Poyo",                  grade: "H", respawn: 120,   confirmed: false, tabs: 2 },
    "panos":    { name: "Panos",                 grade: "H", respawn: 120,   confirmed: false, tabs: 2 },
    "chanus":   { name: "Chanus",                grade: "H", respawn: 120,   confirmed: false, tabs: 2 },
    "tolus":    { name: "Tolus",                 grade: "H", respawn: 120,   confirmed: false, tabs: 2 },
    "bajarn":   { name: "Bajarn",                grade: "H", respawn: 120,   confirmed: false, tabs: 2 },
    "shakiba":  { name: "Shakiba",               grade: "L", respawn: 480,   confirmed: true,  tabs: 2 }
};

var extHelpMsg = "Tracks when a familiar was either tamed or killed and informs of its respawn.  List of Supported Familiars:";
for (var key in FamiliarData) {
    if (!FamiliarData.hasOwnProperty(key)) continue;
    extHelpMsg = extHelpMsg + "\n\t`"+key+"`:"+_.times(11-key.length, function(){return "  ";}).join("")+"**"+FamiliarData[key].name+"** ";
    if(FamiliarData[key].respawn){
        extHelpMsg = extHelpMsg + " *(respawn: "+FamiliarData[key].respawn+" minutes"+(FamiliarData[key].confirmed ? "" : "?")+")*";
    }
}

Commands.add("tame", {
    name: "tame",
    description: extHelpMsg,
    usage: "[familiar] [notes]",
    process: (message, suffix) => {
        if(suffix){
            var parts = suffix.split(" ");
            var familiar = FamiliarData[parts[0]];
            if(familiar){
                var killTime = new Date();
                var respawnTime = null;
                var notes = "";
                if(parts.length > 1){
                    notes = " ("+suffix.substring(suffix.indexOf(" ")+1, suffix.length)+")";
                }

                var msg = message.author + " killed / tamed **" + familiar.name + "**" + notes + " at " + moment(killTime).format("LT z")

                if(familiar.respawn){
                    var confirmedMsg = familiar.confirmed ? "" : "*(maybe?)*";
                    var respawnTime = new Date();
                    var respawnDuration = familiar.respawn / (familiar.grade === "H" ? ConfigFile.familiar_respawn_rate : 1);
                    respawnTime.setMinutes(respawnTime.getMinutes() + respawnDuration);
                    msg = msg + " :white_small_square: __respawn at " + moment(respawnTime).format("LT z") + "__ "+confirmedMsg;

                    var reminderTime = respawnTime;
                    reminderTime.setMinutes(reminderTime.getMinutes() - 5);
                    var reminderMessage = "**"+familiar.name+"**" + notes + " will respawn in 5 minutes. "+confirmedMsg;
                    MessageQueue.add(message.channel, reminderMessage, reminderTime);
                }

                message.channel.sendMessage(msg);
                Utilities.safeDeleteMessage(message);
            } else {
                message.channel.sendMessage(message.author + ": Familiar with the name *"+parts[0]+"* could not be found.   Type `-help tame` for a list of familiars");
            }
        } else {
            message.channel.sendMessage(message.author + ": You must include a familiar name.   Type `-help tame` for a list of familiars");
        }
    }
});


// Good monrin Riders!
// But dinos are a lot like chickens... :chicken:
// Popsicle chicken.
// We read most feedback on Discord

