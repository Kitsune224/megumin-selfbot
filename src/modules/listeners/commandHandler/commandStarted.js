const { Listener } = require('discord-akairo');

function exec(message, command) {
    this.client.logger.logFrom(message.channel, 0, `=> ${command.id}`);
}

module.exports = new Listener('commandStarted', exec, {
    emitter: 'commandHandler',
    eventName: 'commandStarted',
    type: 'on',
    category: 'commandHandler'
});
