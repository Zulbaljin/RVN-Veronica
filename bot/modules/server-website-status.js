let tcpp = require('tcp-ping');
let hasServerWebsiteStatusChannels = require('../helpers.js')
  .hasServerWebsiteStatusChannels;
let config = require('config');
let channelID = config.get('General').Channels.botspam;

exports.commands = ['status'];

exports.status = {
  usage: '<URL> <port>',
  description: 'displays if website or server is up or down',
  process: function(bot, msg, suffix) {
    words = suffix
      .trim()
      .split(' ')
      .filter(function(n) {
        return n !== '';
      });
    if (!hasServerWebsiteStatusChannels) {
      msg.channel.send(
        'Please use <#' + channelID + '> or DMs to talk to status/ping bot.'
      );
      return;
    }
    var Site = words[0];
    var SitePort = words[1];
    if (!Site || !SitePort) {
      msg.channel.send(
        'please provide a url and port to check\nExample: !status miningpanda.site 3636\n dont use : in the url, leave url and port seperataed by a space'
      );
      return;
    }
    tcpp.ping(
      { address: Site, port: SitePort, attempts: 5, timeout: 2000 },
      function(err, data) {
        if (!data.avg) {
          msg.channel.send(data.address + ':' + data.port + ' is Down!');
        } else {
          msg.channel.send(
            data.address +
              ' on port ' +
              data.port +
              ' is UP\n  average ping of ' +
              data.avg +
              ' ms\n  Pinged 5 times!'
          );
        }
      }
    );
  }
};
