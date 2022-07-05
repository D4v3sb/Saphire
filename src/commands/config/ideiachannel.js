const { e } = require('../../../JSON/emojis.json')

module.exports = {
    name: 'ideiachannel',
    aliases: ['setideiachannel', 'canaldeideias'],
    category: 'config',
    UserPermissions: ['MANAGE_GUILD'],
    ClientPermissions: ['ADD_REACTIONS', 'EMBED_LINKS'],
    emoji: `${e.ModShield}`,
    usage: '/sugest',
    description: 'Selecione um canal para envio de ideias',

    execute: async (client, message, args, prefix, MessageEmbed, Database) => {
        return message.reply(`${e.Info} | Este comando foi movido para Slash Command e será excluído em breve. Use \`/sugest\``)
    }
}