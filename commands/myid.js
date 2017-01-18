var Commands = require('../utilities/commands.js').Commands;

Commands.add("myid", {
    name: "myid",
    description: "Returns the user id of the sender.",
    extendedhelp: "This will print your Discord ID to the channel, useful if you want to define admins in your own instance.",
    process: function(message) {
        message.channel.sendMessage(message.author.id);
    }
});
