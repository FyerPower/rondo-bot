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
    "ikeria":     {  name: "Ikeria",            zone: "Triteal Rift",     respawn: 480,   reminder: 10,  selfDestructReminder: 10 },
    "faudrus":    {  name: "Faudrus",           zone: "Triteal Rift",     respawn: 480,   reminder: 10,  selfDestructReminder: 10 },
    "kelsier":    {  name: "Kelsier",           zone: "Triteal Rift",     respawn: 480,   reminder: 10,  selfDestructReminder: 10 },
    "flam":       {  name: "Flam",              zone: "Triteal Rift",     respawn: 480,   reminder: 10,  selfDestructReminder: 10 },
    "jumawu":     {  name: "Jumawu",            zone: "Triteal Rift",     respawn: 1140,  reminder: 10,  selfDestructReminder: 10 },
    // Cloying Wastes
    "lazart":     {  name: "Lazart",            zone: "Cloying Wastes",   respawn: 480,   reminder: 10,  selfDestructReminder: 10 },
    "mupadin":    {  name: "Mupadin",           zone: "Cloying Wastes",   respawn: 480,   reminder: 10,  selfDestructReminder: 10 },
    "zenon":      {  name: "Zenon the Slayer",  zone: "Cloying Wastes",   respawn: 480,   reminder: 10,  selfDestructReminder: 10 },
    "sandstorm":  {  name: "Sandstorm",         zone: "Cloying Wastes",   respawn: 1140,  reminder: 10,  selfDestructReminder: 10 },
    // Ellora Sanctuary
    "lenazar":    {  name: "Lenazar",           zone: "Ellora Sanctuary", respawn: 480,   reminder: 10,  selfDestructReminder: 10 },
    // Windy Canyon
    "roa":        {  name: "Prion Roa",         zone: "Windy Canyon",     respawn: 480,   reminder: 10,  selfDestructReminder: 10 },

    // TEST
    "test":       {  name: "Tester McTesty",    zone: "Testing Zone",     respawn: 3,     reminder: 1,   selfDestructReminder: 1 }
};

Commands.add("boss", {
    name: "boss",
    description: generateBossHelp(),
    usage: "[boss] [notes] (Example: '-boss lazart ch1')",
    process: (message, suffix) => {
        if(suffix){
            var indexOfSpace = suffix.indexOf(" ") > 0 ? suffix.indexOf(" ") : suffix.length;
            var bossName  = suffix.substring(0, indexOfSpace).toLowerCase();
            var bossNotes = suffix.substring(indexOfSpace+1, suffix.length);

            if(bossName === 'list'){
                displayBossList(message.channel);
            } else if(bossName === 'clear'){
                if(message.channel.permissionsFor(message.author).hasPermission("MANAGE_MESSAGES")){
                    BossKills.clear();
                }
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
    if(msg.length === 1){
        msg.push(":white_small_square: *No Upcoming Bosses*");
    }
    channel.sendMessage(msg);
}

function trackBossKill(channel, boss, bossName, bossNotes){
    var boss = BossData[bossName];
    var killTime = new Date();
    var respawnTime = Utilities.date(killTime, boss.respawn);
    var reminderTime = Utilities.date(respawnTime, (-1 * boss.reminder));

    // Announce boss kill
    var msg = "**" + boss.name + "**" + notes(bossNotes) + " was slain at " + moment(killTime).format("LT z") + " EST "+
              ":white_small_square: *respawn at " + moment(respawnTime).format("LT z") + " EST*";
    channel.sendMessage(msg);

    // Queue reminder message
    var reminderMessage = "**"+boss.name+"**" + notes(bossNotes) + " will respawn in "+boss.selfDestructReminder+" minutes. *(at roughly: " + moment(respawnTime).format("LT z") + " EST)*";
    MessageQueue.add(channel, reminderMessage, reminderTime, Utilities.minutesToMs(boss.selfDestructReminder));

    // Track boss kill
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

        var respawnText = BossData[key].respawn > 60 ? (Utilities.round((BossData[key].respawn / 60), 2) + " hours") : (BossData[key].respawn + " minutes");

        msgGroup.push("\t`"+key+"`:"+_.times(11-key.length, function(){return "  ";}).join("")+" **"+BossData[key].name+"** *(respawn: "+respawnText+")*");
    }
    extHelpMsg.push(msgGroup.join("\n"));
    return extHelpMsg;
}