"use strict";

var MessageQueue = require("../models/message-queue").MessageQueue;
var Logger       = require("../utilities/logger.js").Logger;
var Utilities    = require('../utilities/utilities.js').Utilities;

class MessageQueueWorker {
    constructor(){
        this.interval = null;
    }    

    start(){
        this.interval = setInterval(() => {
            var nextMessage = MessageQueue.nextMessage();
            while(nextMessage && nextMessage.time < new Date()) {
                nextMessage.channel.sendMessage(nextMessage.message).then(function(msg){
                    Logger.log("silly", "Message Queue - Message Sent From Queue");
                    if(nextMessage.selfDeleteAfter){
                        Logger.log("silly", "Message Queue - Message self destruct activated");
                        Utilities.safeDeleteMessage(msg, nextMessage.selfDeleteAfter);
                    }
                });
                MessageQueue.remove(nextMessage);
                nextMessage = MessageQueue.nextMessage();
            }
        }, 15000, MessageQueue);
    }

    stop(){
        if(this.interval){
            clearTimeout(this.interval);
        }
    }
}

exports.MessageQueueWorker = new MessageQueueWorker();
