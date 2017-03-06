"use strict";

var _ = require('lodash');
var ConfigFile   = require("../config.json");
var Commands     = require('../utilities/commands.js').Commands;
var Utilities    = require('../utilities/utilities.js').Utilities;
var MessageQueue = require('../models/message-queue.js').MessageQueue;
var moment       = require('moment'); 

var FamiliarData = {
    // Hakanas Highlands
    "garme":    { name: "Garme",                 zone: "Hakanas Highlands", grade: "H",    respawn: 60,    confirmed: true  }, 
    "agnes":    { name: "Agnes the Red",         zone: "Hakanas Highlands", grade: "H",    respawn: 60,    confirmed: true  }, 
    // Parna's Coast
    "terror":   { name: "Terror Kerav",          zone: "Parna's Coast", grade: "H",    respawn: 120,   confirmed: true  },
    "caspert":  { name: "Venomous Caspert",      zone: "Parna's Coast", grade: "H",    respawn: 120,   confirmed: true  },
    "apoc":     { name: "Apocolypse",            zone: "Parna's Coast", grade: "H",    respawn: 300,   confirmed: true  },
    "karresh":  { name: "Karresh",               zone: "Parna's Coast", grade: "H",    respawn: 140,   confirmed: true  },
    // Triteal Rift
    "leto":     { name: "Void Letonsia",         zone: "Triteal Rift", grade: "H",    respawn: 360,   confirmed: true  },
    "void":     { name: "Void Kargyle",          zone: "Triteal Rift", grade: "H",    respawn: 120,   confirmed: false },
    "twilight": { name: "Twilight Kargyle",      zone: "Triteal Rift", grade: "H",    respawn: 120,   confirmed: false },
    "femuto":   { name: "Femuto",                zone: "Triteal Rift", grade: "H",    respawn: 120,   confirmed: false },
    "lunafont": { name: "Lunafont",              zone: "Triteal Rift", grade: "H",    respawn: 60,    confirmed: false },
    "karasha":  { name: "Karasha the Dark One",  zone: "Triteal Rift", grade: "H",    respawn: 120,   confirmed: false },
    "paragas":  { name: "Paragas the Mad",       zone: "Triteal Rift", grade: "H",    respawn: 120,   confirmed: false },
    "veldon":   { name: "Veldon",                zone: "Triteal Rift", grade: "H",    respawn: 120,   confirmed: false },
    // Cloying Wastes
    "shakiba":  { name: "Shakiba",               zone: "Cloying Wastes", grade: "L",    respawn: 480,   confirmed: true  },
    "trino":    { name: "Trinoceros",            zone: "Cloying Wastes", grade: "H",    respawn: 120,   confirmed: false },
    "poyo":     { name: "Poyo",                  zone: "Cloying Wastes", grade: "H",    respawn: 120,   confirmed: false },
    "panos":    { name: "Panos",                 zone: "Cloying Wastes", grade: "H",    respawn: 120,   confirmed: false },
    "chanus":   { name: "Chanus",                zone: "Cloying Wastes", grade: "H",    respawn: 120,   confirmed: false },
    "tolus":    { name: "Tolus",                 zone: "Cloying Wastes", grade: "H",    respawn: 120,   confirmed: false },
    "bajarn":   { name: "Bajarn",                zone: "Cloying Wastes", grade: "H",    respawn: 120,   confirmed: false },
    // Stygaea
    "jamiot":   { name: "Jamiot",                zone: "Stygaea", grade: "L",    respawn: 600,   confirmed: false },
    "calyptos": { name: "Calyptos",              zone: "Stygaea", grade: "H",    respawn: 600,   confirmed: true },
    "finion":   { name: "Finion",                zone: "Stygaea", grade: "H",    respawn: 360,   confirmed: true },
    "magnatu":  { name: "Magnatu",               zone: "Stygaea", grade: "H",    respawn: 360,   confirmed: false },
};

var extHelpMsg = ["Tracks when a familiar was either tamed or killed and informs of its respawn.  List of Supported Familiars:"];
var gradeEmoji = { "H": "<:heroic:276033765417943040>", "L": "<:legendary:276033783101259777>" };
var msgGroup = [];
var lastZone = "";
for (var key in FamiliarData) {
    if (!FamiliarData.hasOwnProperty(key)) continue;
    
    if(lastZone === "" || lastZone != FamiliarData[key].zone){
        if(msgGroup.length > 0){
            extHelpMsg.push(msgGroup.join("\n"));
            msgGroup = [];
        }
        msgGroup.push("\t**"+FamiliarData[key].zone+"**:");
        lastZone = FamiliarData[key].zone;
    }

    var msg = "\t`"+key+"`:"+_.times(11-key.length, function(){return "  ";}).join("")+gradeEmoji[FamiliarData[key].grade]+" **"+FamiliarData[key].name+"** ";
    if(FamiliarData[key].respawn){
        msg = msg + " *(respawn: "+FamiliarData[key].respawn+" minutes"+(FamiliarData[key].confirmed ? "" : "?")+")*";
    }
    msgGroup.push(msg);
}
extHelpMsg.push(msgGroup.join("\n"));



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

                    var reminderTime = new Date(respawnTime);
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