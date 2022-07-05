const { e } = require('../../../JSON/emojis.json')

module.exports = {
    name: 'config',
    aliases: ['serverstatus', 'serverconfig', 'configserver', 'configstatus'],
    category: 'servidor',
    emoji: `${e.ModShield}`,
    usage: '/config',
    description: 'Status da configuração do servidor',

    execute: async (client, message, args, prefix, MessageEmbed, Database) => {
        return message.reply(`${e.Info} | Este comando foi movido para Slash Command e será excluído em breve. Use \`/config\``)
    }
}