const { e } = require('../../../JSON/emojis.json')

module.exports = {
    name: 'ideia',
    aliases: ['sugerir', 'sugestão', 'ideias', 'sugestao'],
    category: 'servidor',
    ClientPermissions: ['ADD_REACTIONS', 'EMBED_LINKS'],
    emoji: '💭',
    usage: '/sugest',
    description: 'Dê suas ideias para o servidor votar',

    execute: async (client, message, args, prefix, MessageEmbed, Database) => {
        return message.reply(`${e.Info} | Este comando foi movido para Slash Command e será excluído em breve. Use \`/sugest\``)
    }
}