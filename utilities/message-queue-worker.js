"use strict";

var MessageQueue = require("../models/message-queue").MessageQueue;
var Logger = require("../utilities/logger.js").Logger;

class MessageQueueWorker {
    constructor(){
        this.interval = null;
    }    

    start(){
        this.interval = setInterval(() => {
            var nextMessage = MessageQueue.nextMessage();
            while(nextMessage && nextMessage.time < new Date()) {
                Logger.log("info", "Sending Message from Queue");
                nextMessage.channel.sendMessage(nextMessage.message);
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
