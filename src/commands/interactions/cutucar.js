const { e } = require('../../../JSON/emojis.json')

module.exports = {
  name: 'cutucar',
  aliases: ['poke'],
  category: 'interactions',
  ClientPermissions: ['EMBED_LINKS', 'ADD_REACTIONS'],
  emoji: '👉',
  usage: '/interaction',
  description: 'Cutucar irrita, faz isso não',

  execute: async (client, message, args, prefix, MessageEmbed, Database) => {
    return message.reply(`${e.Info} | Este comando foi movido para Slash Command e será excluído em breve. Use \`/interaction\``)
  }
}