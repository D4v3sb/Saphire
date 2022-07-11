
const { e } = require('../../../JSON/emojis.json')

module.exports = {
    name: 'serverinfo',
    aliases: ['si', 'infoserver', 'guildinfo', 'guildstats', 'serverstats'],
    category: 'servidor',
    ClientPermissions: ['VIEW_GUILD_INSIGHTS', 'MANAGE_GUILD'],
    emoji: `${e.Info}`,
    usage: '/serverinfo',
    description: "Informações sobre o servidor",

    execute: async (client, message, args, prefix, MessageEmbed, Database) => {
        return message.reply(`${e.Info} | Este comando foi movido para Slash Command e será excluído em breve. Use \`/serverinfo\``)
    }
}