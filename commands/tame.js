var Commands  = require('../utilities/commands.js').Commands;
var Utilities = require('../utilities/utilities.js').Utilities;
var moment    = require('moment'); 

var FamiliarData = {
    "garme":    { name: "Garme",                respawn: 60   },
    "agnes":    { name: "Agnes the Red",        respawn: 60   },
    "terror":   { name: "Terror Kerav",         respawn: 120  },
    "caspert":  { name: "Venomous Caspert",     respawn: 120  },
    "apoc":     { name: "Apocolypse",           respawn: 300  },
    "karresh":  { name: "Karresh",              respawn: 140  },
    "leto":     { name: "Void Letonsia",        respawn: null },
    "void":     { name: "Void Kargyle",         respawn: null },
    "twilight": { name: "Twilight Kargyle",     respawn: null },
    "femuto":   { name: "Femuto",               respawn: null },
    "lunafont": { name: "Lunafont",             respawn: 120  },
    "karasha":  { name: "Karasha the Dark One", respawn: null },
    "paragas":  { name: "Paragas the Mad",      respawn: null },
};

var extHelpMsg = "List of Supported Familiars:";
for (var key in FamiliarData) {
    if (!FamiliarData.hasOwnProperty(key)) continue;
    extHelpMsg = extHelpMsg + "\n\t`"+key+": "+FamiliarData[key].name+"`";
    if(FamiliarData[key].respawn){
        extHelpMsg = extHelpMsg + " (respawn: "+FamiliarData[key].respawn+" minutes)";
    }
}

Commands.add("tame", {
    name: "tame",
    description: "Tracks when a familiar was either tamed or killed and informs of its respawn",
    extendedhelp: extHelpMsg,
    usage: "[familiar] [notes]",
    process: (message, suffix) => {
        if(suffix){
            var parts = suffix.split(" ");
            var familiar = FamiliarData[parts[0]];
            if(familiar){
                var killTime = new Date();
                var respawnTime = null;
                var msg = message.author + " killed / tamed **" + familiar.name + "** at " + moment(killTime).format("LT z")

                if(parts.length > 1){
                    msg = msg + " ("+suffix.substring(suffix.indexOf(" "), suffix.length)+")";
                }

                if(familiar.respawn){
                    var respawnTime = new Date();
                    respawnTime.setMinutes(respawnTime.getMinutes() + familiar.respawn);
                    msg = msg + " :white_small_square: __respawn at " + moment(respawnTime).format("LT z") + "__";
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
