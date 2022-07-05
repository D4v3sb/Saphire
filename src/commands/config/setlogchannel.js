const { e } = require('../../../JSON/emojis.json')

module.exports = {
    name: 'setlogchannel',
    aliases: ['logs', 'setlogs', 'logchannel', 'log', 'gsn', 'notification'],
    category: 'config',
    UserPermissions: ['MANAGE_GUILD'],
    ClientPermissions: ['ADD_REACTIONS', 'VIEW_AUDIT_LOG', 'MANAGE_CHANNELS'],
    emoji: `${e.ModShield}`,
    usage: '/config',
    description: 'Canal de referência para o sistema 🛰️ | **Global System Notification**',

    execute: async (client, message, args, prefix, MessageEmbed, Database) => {
        return message.reply(`${e.Info} | Este comando foi movido para Slash Command e será excluído em breve. Use \`/config\``)
    }
}