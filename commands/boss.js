"use strict";

var _ = require('lodash');
var ConfigFile   = require("../config.json");
var Commands     = require('../utilities/commands.js').Commands;
var Utilities    = require('../utilities/utilities.js').Utilities;
var MessageQueue = require('../models/message-queue.js').MessageQueue;
var BossKills    = require('../models/boss-kills.js').BossKills;
var moment       = require('moment'); 

var BossData = {
    // Triteal Rift
    "ikeria":     { name: "Ikeria",            zone: "Triteal Rift",    respawn: 480 },
    "faudrus":    { name: "Faudrus",           zone: "Triteal Rift",    respawn: 480 },
    "kelsier":    { name: "Kelsier",           zone: "Triteal Rift",    respawn: 480 },
    "flam":       { name: "Flam",              zone: "Triteal Rift",    respawn: 480 },
    "jumawu":     { name: "Jumawu",            zone: "Triteal Rift",    respawn: 1140 },
    // Cloying Wastes
    "lazart":     { name: "Lazart",            zone: "Cloying Wastes",  respawn: 480 },
    "mupadin":    { name: "Mupadin",           zone: "Cloying Wastes",  respawn: 480 },
    "zenon":      { name: "Zenon the Slayer",  zone: "Cloying Wastes",  respawn: 480 },
    "sandstorm":  { name: "Sandstorm",         zone: "Cloying Wastes",  respawn: 1140 }
};
// "test":  { name: "Tester McTesty", zone: "Testing Zone",  respawn: 5 }

Commands.add("boss", {
    name: "boss",
    description: generateBossHelp(),
    usage: "[boss] [notes] (Example: '-boss lazart ch1')",
    process: (message, suffix) => {
        if(suffix){
            var indexOfSpace = suffix.indexOf(" ") > 0 ? suffix.indexOf(" ") : suffix.length;
            var bossName  = suffix.substring(0, indexOfSpace);
            var bossNotes = suffix.substring(indexOfSpace+1, suffix.length);

            if(bossName === 'list'){
                displayBossList(message.channel);
            } else if(BossData.hasOwnProperty(bossName)){
                trackBossKill(message.channel, BossData[bossName], bossName, bossNotes);
            } else {
                message.channel.sendMessage(message.author + ": Boss with the name *"+bossName+"* could not be found.   Type `-help boss` for a list of Bosses");
                Utilities.safeDeleteMessage(message, Utilities.minutesToMs(1));
            }
            Utilities.safeDeleteMessage(message);
        } else {
            message.channel.sendMessage(message.author + ": You must include a boss name.   Type `-help boss` for a list of bosses");
        }
    }
});

function notes(notes){
    return notes ? (" ("+notes+")") : "";
}

function displayBossList(channel){
    var msg = ["__List of upcoming boss spawns:__"];
    _.each(BossKills.list(), function(bk){
        msg.push(":white_small_square: **"+bk.boss.name+"**"+notes(bk.notes)+" respawns at: " + moment(bk.respawnTime).format("LT z") + " EST");
    });
    channel.sendMessage(msg);
}

function trackBossKill(channel, boss, bossName, bossNotes){
    var boss = BossData[bossName];
    var killTime = new Date();
    var respawnTime = null;

    // Announce boss kill
    var msg = "**" + boss.name + "**" + notes(bossNotes) + " was slain at " + moment(killTime).format("LT z") + " EST";
    
    // Queue respawn announcement
    var respawnTime = new Date();
    respawnTime.setMinutes(respawnTime.getMinutes() + boss.respawn);
    msg = msg + " :white_small_square: *respawn at " + moment(respawnTime).format("LT z") + " EST*";

    var reminderTime = new Date(respawnTime);
    reminderTime.setMinutes(reminderTime.getMinutes() - 10);
    var reminderMessage = "**"+boss.name+"**" + notes(bossNotes) + " will respawn in 10 minutes. *(at roughly: " + moment(respawnTime).format("LT z") + " EST)*";
    MessageQueue.add(channel, reminderMessage, reminderTime, Utilities.minutesToMs(15));

    channel.sendMessage(msg);
    BossKills.add(boss, bossNotes, channel, killTime, respawnTime);
}

function generateBossHelp(){
    var extHelpMsg = ["Tracks when a Worldboss was last killed and informs of its respawn.", "Type `-boss list` to obtain a list of next boss respawns", "List of Supported Bosses:"];
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
    return extHelpMsg;
}