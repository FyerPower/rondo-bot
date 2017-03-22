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
                (function(nextMessage){
                    nextMessage.channel.sendMessage(nextMessage.message)
                        .then(function(msg){
                            Logger.log("info", "Message Queue - Message Sent From Queue");
                            if(nextMessage.selfDeleteAfter){
                                Logger.log("info", "Message Queue - Message self destruct activated");
                                Utilities.safeDeleteMessage(msg, nextMessage.selfDeleteAfter);
                            }
                        })
                        .catch(function(){
                            Logger.log("info", "Message Queue - Error Sending Message from Queue");                        
                        });
                })(nextMessage);
                MessageQueue.remove(nextMessage);
                nextMessage = MessageQueue.nextMessage();
            }
        }, 15000);
    }

    stop(){
        if(this.interval){
            clearTimeout(this.interval);
        }
    }
}

exports.MessageQueueWorker = new MessageQueueWorker();
