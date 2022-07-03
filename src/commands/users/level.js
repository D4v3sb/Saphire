const { e } = require('../../../JSON/emojis.json')

module.exports = {
    name: 'level',
    aliases: ['xp', 'nivel', 'lvl', 'l'],
    category: 'level',
    ClientPermissions: ['ATTACH_FILES'],
    emoji: `${e.Star}`,
    cooldown: 5000,
    usage: '/level',
    description: 'Confira seu nível ou o de alguém',

    execute: async (client, message, args, prefix, MessageEmbed, Database) => {
        return message.reply(`${e.Info} | Este comando foi movido para Slash Command e será excluído em breve. Use \`/level\``)
    }
}