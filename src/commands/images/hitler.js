const { MessageAttachment } = require('discord.js')
const { e } = require('../../../JSON/emojis.json')
const { Canvas } = require('canvacord')
const Error = require('../../../modules/functions/config/errors')


module.exports = {
    name: 'hitler',
    category: 'images',
    ClientPermissions: ['ATTACH_FILES'],
    emoji: `${e.Deny}`,
    usage: '<hitler> [@user]',
    description: 'Pior que o Hitler',

    run: async (client, message, args, prefix, MessageEmbed, Database) => {

        let user = message.mentions.users.first() || message.mentions.repliedUser || await client.users.cache.get(args[0]) || message.author
        let avatar = user.displayAvatarURL({ format: 'png' })

        try {
            return message.reply(`${e.Loading} | Carregando...`).then(async msg => {
                msg.delete().catch(() => { })
                message.reply({ files: [new MessageAttachment(await Canvas.hitler(avatar), 'hitler.png')] })
            })
        } catch (err) {
            Error(message, err)
        }
    }
}