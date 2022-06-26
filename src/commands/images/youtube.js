const { e } = require('../../../JSON/emojis.json')

module.exports = {
    name: 'youtube',
    aliases: ['ytb'],
    category: 'images',
    ClientPermissions: ['ATTACH_FILES'],
    emoji: '📺',
    usage: '/youtube',
    description: 'Youtube comentário',

    execute: async (client, message, args, prefix, MessageEmbed, Database) => {
        return message.reply(`${e.Info} | Este comando foi movido para Slash Command e será excluído em breve. Use \`/youtube\``)
    }
}