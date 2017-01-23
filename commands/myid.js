var Commands = require('../utilities/commands.js').Commands;

Commands.add("myid", {
    name: "myid",
    description: "Returns the user id of the sender.",
    process: function(message) {
        message.channel.sendMessage(message.author.id);
    }
});
