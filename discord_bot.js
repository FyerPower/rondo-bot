/*
========================
    This is a "ping-pong bot"
    Everytime a message matches a command, the bot will respond
========================
*/

var ConfigFile = require("./config.json");
var ChatLog    = require("./utilities/logger.js").ChatLog;
var Logger     = require("./utilities/logger.js").Logger;
var Commands   = require('./utilities/commands.js').Commands;
var MessageQueueWorker = require('./utilities/message-queue-worker.js').MessageQueueWorker;

var Discord = require("discord.js");
var client = new Discord.Client();

/*
========================
    Load Commands
========================
*/

var fs = require('fs');
fs.readdir('./commands', (err, files) => {
    files.forEach((file) => {
        require('./commands/'+file);
    });
});

/*
========================
    Start the connection to Discord!
========================
*/

function init(){
    Logger.log("info", "Successfully logged into discord");
}

client.on("ready", () => {
    Logger.log("info", "Ready!");
    MessageQueueWorker.start();
    client.user.setGame("with Aisha");
});

client.on("disconnected", () => {
    Logger.log("error", "Disconnected!");
    MessageQueueWorker.stop();
    process.exit(0); // exit node.js without an error, seeing this is 9 out of 10 times intentional.
});

/*
========================
    Command interpeter
========================
*/

client.on("message", (message) => {
    if (message.author == client.user) { return; }
    if (message.author.id != client.user.id && (message.content[0] === ConfigFile.command_prefix)) {
        Logger.log("info", message.author.username + " executed <" + message.content + ">");
        var cmdTxt = message.content.split(" ")[0].substring(1).toLowerCase();
        var suffix = message.content.substring(cmdTxt.length + 2); //add one for the prefix and one for the space

        if (Commands.hasCommand(cmdTxt)) {
            if(Commands.hasCooldown(cmdTxt)){
                message.channel.sendMessage("Hey " + message.sender + ", this command is on cooldown!");
                return false;
            }
            if(!Commands.hasPermission(cmdTxt, message.author.id)){
                message.channel.sendMessage("Hey " + message.sender + ", you are not allowed to do that!");
                return false;
            }
            Commands.execute(cmdTxt, message, suffix);
        } else {
            message.channel.sendMessage("Hey " + message.sender + ", that command couldn't be found!");
        }
    }
});

client.login(ConfigFile.discord_token).then(init);
