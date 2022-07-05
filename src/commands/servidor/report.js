const { e } = require('../../../JSON/emojis.json')

module.exports = {
    name: 'report',
    aliases: ['reporte', 'denunciar', 'denuncia', 'rpt', 'reports', 'reportes'],
    category: 'servidor',
    ClientPermissions: ['MANAGE_MESSAGES'],
    emoji: `${e.Loud}`,
    usage: '/enviar',
    description: 'Reporte algo ou alguém para a staff do servidor',

    execute: async (client, message, args, prefix, MessageEmbed, Database) => {
        return message.reply(`${e.Info} | Este comando foi movido para Slash Command e será excluído em breve. Use \`/enviar\``)
    }
}