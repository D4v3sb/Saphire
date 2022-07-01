const simplydjs = require('simply-djs')

module.exports = {
    name: 'calculadora',
    aliases: ['cal'],
    category: 'util',
    emoji: '🧮',
    usage: '/calculadora',
    description: 'Calculadora simples',

    execute: async (client, message, args, prefix, MessageEmbed, Database) => {
        return message.reply(`${e.Info} | Este comando foi movido para Slash Command e será excluído em breve. Use \`/calculadora\``)
    }
}