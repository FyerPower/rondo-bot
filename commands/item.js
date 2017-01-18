var Commands = require('../utilities/commands.js').Commands;

Commands.add("item", {
    name: "item",
    description: "",
    extendedhelp: "",
    usage: "[item name]",
    process: function(message, suffix) {
        var response = "**==-==-==-==-==-==-==**\n";
        response    += "__Item__:   **"+suffix+"**\n";
        response    += "__Roll__:    type `-roll`\n";
        response    += "**==-==-==-==-==-==-==**";
        message.channel.sendMessage(response);
        safeDeleteMessage(message);
    }
});


function safeDeleteMessage(message){
    setTimeout(function(){
        message.delete();
    }, 100);
}
