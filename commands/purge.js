var Commands = require('../utilities/commands.js').Commands;

Commands.add("purge", {
    name: "purge",
    usage: "<number-of-messages-to-delete> [force]",
    extendedhelp: "I'll delete a certain ammount of messages.",
    process: function(message, suffix) {
        // if (!message.channel.server) {
        //     message.channel.sendMessage("You can't do that in a DM, dummy!");
        //     return;
        // }
        // if (!suffix){
        //     message.channel.sendMessage("Please define an ammount of messages for me to delete!");
        //     return;
        // }
        // if (!message.channel.permissionsOf(message.sender).hasPermission("manageMessages")) {
        //     message.channel.sendMessage("Sorry, your permissions doesn't allow that.");
        //     return;
        // }
        // if (!message.channel.permissionsOf(bot.user).hasPermission("manageMessages")) {
        //     message.channel.sendMessage("I don't have permission to do that!");
        //     return;
        // }
        // if (suffix.split(" ")[0] > 20 && message.content != "force"){
        //     message.channel.sendMessage("I can't delete that much messages in safe-mode, add `force` to your message to force me to delete.");
        //     return;
        // }
        // if (suffix.split(" ")[0] > 100){
        //     message.channel.sendMessage("The maximum is 100, 20 without `force`.");
        //     return;
        // }
        // if (suffix.split(" ")[0] == "force"){
        //     message.channel.sendMessage("Please put `force` at the end of your message.");
        //     return;
        // }
        // bot.getChannelLogs(message.channel, suffix.split(" ")[0], function(error, messages){
        //     if (error){
        //         message.channel.sendMessage("Something went wrong while fetching logs.");
        //         return;
        //     } else {
        //         Logger.info("Beginning purge...");
        //         var todo = messages.length,
        //         delcount = 0;
        //         for (message of messages){
        //             bot.deleteMessage(message);
        //             todo--;
        //             delcount++;
        //             if (todo === 0){
        //                 message.channel.sendMessage("Done! Deleted " + delcount + " messages.");
        //                 Logger.info("Ending purge, deleted " + delcount + " messages.");
        //                 return;
        //             }}
        //         }
        //     }
        // );
    }
});
