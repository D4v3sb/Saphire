const { e } = require('../../../JSON/emojis.json')

module.exports = {
    name: 'shit',
    aliases: ['cocô'],
    category: 'images',
    ClientPermissions: ['ATTACH_FILES'],
    emoji: '💩',
    usage: '/image',
    description: 'Pisei no cocô meme',

    execute: async (client, message, args, prefix, MessageEmbed, Database) => {
        return message.reply(`${e.Info} | Este comando foi movido para Slash Command e será excluído em breve. Use \`/image\``)
    }
}