"use strict";

var Commands = require('../utilities/commands.js').Commands;

Commands.add("xkcd", {
    name: "xkcd",
    description: "Returns a random (or chosen) xkcd comic",
    usage: "[current, or comic number]",
    process: function(message, suffix) {
        var request = require('request');
        request('http://xkcd.com/info.0.json', function(error, response, body) {
            if (!error && response.statusCode == 200) {
                var xkcdInfo = JSON.parse(body);
                if (suffix) {
                    var isnum = /^\d+$/.test(suffix);
                    if (isnum) {
                        if ([suffix] < xkcdInfo.num) {
                            request('http://xkcd.com/' + suffix + '/info.0.json', function(error, response, body) {
                                if (!error && response.statusCode == 200) {
                                    xkcdInfo = JSON.parse(body);
                                    message.channel.sendMessage(xkcdInfo.img);
                                } else {
                                    // Logger.log("warn", "Got an error: ", error, ", status code: ", response.statusCode);
                                }
                            });
                        } else {
                            message.channel.sendMessage("There are only " + xkcdInfo.num + " xkcd comics!");
                        }
                    } else {
                        message.channel.sendMessage(xkcdInfo.img);
                    }
                } else {
                    var xkcdRandom = Math.floor(Math.random() * (xkcdInfo.num - 1)) + 1;
                    request('http://xkcd.com/' + xkcdRandom + '/info.0.json', function(error, response, body) {
                        if (!error && response.statusCode == 200) {
                            xkcdInfo = JSON.parse(body);
                            message.channel.sendMessage(xkcdInfo.img);
                        } else {
                            // Logger.log("warn", "Got an error: ", error, ", status code: ", response.statusCode);
                        }
                    });
                }

            } else {
                // Logger.log("warn", "Got an error: ", error, ", status code: ", response.statusCode);
            }
        });
    }
});
