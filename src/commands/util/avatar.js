const { e } = require('../../../JSON/emojis.json')

module.exports = {
    name: 'avatar',
    aliases: ['foto', 'pfp', 'pic', 'icon', 'icone', 'faixa', 'bn', 'banner'],
    category: 'util',
    ClientPermissions: ['EMBED_LINKS', 'ADD_REACTIONS'],
    emoji: '📷',
    description: "Veja a foto de perfil, sua ou a de alguém",
    usage: '/avatar',

    execute: async (client, message, args, prefix, MessageEmbed, Database) => {
        return message.reply(`${e.Info} | Este comando foi movido para Slash Command e será excluído em breve. Use \`/avatar\``)
    }
}