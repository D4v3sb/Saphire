const { e } = require('../../../JSON/emojis.json')

module.exports = {
  name: 'drama',
  aliases: ['afe'],
  category: 'reactions',
  ClientPermissions: ['EMBED_LINKS'],
  emoji: '😩',
  usage: '/reaction',
  description: 'Um draminha não faz mal a ninguém',

  execute: async (client, message, args, prefix, MessageEmbed, Database) => {
    return message.reply(`${e.Info} | Este comando foi movido para Slash Command e será excluído em breve. Use \`/reaction\``)
  }
}