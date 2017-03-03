"use strict";

var _ = require('lodash');
var ConfigFile   = require("../config.json");
var Commands     = require('../utilities/commands.js').Commands;
var Utilities    = require('../utilities/utilities.js').Utilities;
var MessageQueue = require('../models/message-queue.js').MessageQueue;
var moment       = require('moment'); 

var BossData = {
    // Triteal Rift
    "ikeria":     { name: "Ikeria",            zone: "Triteal Rift",    respawn: 480 },
    "faudrus":    { name: "Faudrus",           zone: "Triteal Rift",    respawn: 480 },
    "kelsier":    { name: "Kelsier",           zone: "Triteal Rift",    respawn: 480 },
    "flam":       { name: "Flam",              zone: "Triteal Rift",    respawn: 480 },
    "jumawu":     { name: "Lazart",            zone: "Triteal Rift",    respawn: 1140 },
    // Cloying Wastes
    "lazart":     { name: "Lazart",            zone: "Cloying Wastes",  respawn: 480 },
    "mupadin":    { name: "Mupadin",           zone: "Cloying Wastes",  respawn: 480 },
    "zenon":      { name: "Zenon the Slayer",  zone: "Cloying Wastes",  respawn: 480 },
    "sandstorm":  { name: "Sandstorm",         zone: "Cloying Wastes",  respawn: 480 },
};

var extHelpMsg = ["Tracks when a Worldboss was last killed and informs of its respawn.  List of Supported Bosses:"];
var msgGroup = [];
var lastZone = "";
for (var key in BossData) {
    if (!BossData.hasOwnProperty(key)) continue;
    
    if(lastZone === "" || lastZone != BossData[key].zone){
        if(msgGroup.length > 0){
            extHelpMsg.push(msgGroup.join("\n"));
            msgGroup = [];
        }
        msgGroup.push("\t**"+BossData[key].zone+"**:");
        lastZone = BossData[key].zone;
    }
    msgGroup.push("\t`"+key+"`:"+_.times(11-key.length, function(){return "  ";}).join("")+" **"+BossData[key].name+"** *(respawn: "+BossData[key].respawn+" minutes)*");
}
extHelpMsg.push(msgGroup.join("\n"));



Commands.add("boss", {
    name: "boss",
    description: extHelpMsg,
    usage: "[boss] [notes] (Example: `-boss lazart ch1`)",
    process: (message, suffix) => {
        if(suffix){
            var parts = suffix.split(" ");
            var boss = BossData[parts[0]];
            if(boss){
                var killTime = new Date();
                var respawnTime = null;
                var notes = "";
                if(parts.length > 1){
                    notes = " ("+suffix.substring(suffix.indexOf(" ")+1, suffix.length)+")";
                }

                var msg = "**" + boss.name + "**" + notes + " was slain at " + moment(killTime).format("LT z") + " EST";
                if(boss.respawn){
                    var respawnTime = new Date();
                    respawnTime.setMinutes(respawnTime.getMinutes() + boss.respawn);
                    msg = msg + " :white_small_square: *respawn at " + moment(respawnTime).format("LT z") + " EST*";

                    var reminderTime = respawnTime;
                    reminderTime.setMinutes(reminderTime.getMinutes() - 10);
                    var reminderMessage = "**"+boss.name+"**" + notes + " will respawn in 10 minutes. (__" + moment(respawnTime).format("LT z") + " EST__)";
                    MessageQueue.add(message.channel, reminderMessage, reminderTime);
                }

                message.channel.sendMessage(msg);
                Utilities.safeDeleteMessage(message);
            } else {
                message.channel.sendMessage(message.author + ": Boss with the name *"+parts[0]+"* could not be found.   Type `-help boss` for a list of Bosses");
            }
        } else {
            message.channel.sendMessage(message.author + ": You must include a boss name.   Type `-help boss` for a list of bosses");
        }
    }
});