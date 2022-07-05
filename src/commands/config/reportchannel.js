const { e } = require('../../../JSON/emojis.json')

module.exports = {
    name: 'reportchannel',
    aliases: ['setreportchannel'],
    category: 'config',
    UserPermissions: ['MANAGE_GUILD'],
    ClientPermissions: ['SEND_MESSAGES', 'ADD_REACTIONS'],
    emoji: `${e.ModShield}`,
    usage: '/config',
    description: 'Escolhe um canal para receber reports dos membros',

    execute: async (client, message, args, prefix, MessageEmbed, Database) => {
        return message.reply(`${e.Info} | Este comando foi movido para Slash Command e será excluído em breve. Use \`/config\``)
    }
}