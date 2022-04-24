const { MessageAttachment } = require('discord.js')
const { e } = require('../../../JSON/emojis.json')
const { Canvas } = require('canvacord')
const Error = require('../../../modules/functions/config/errors')


module.exports = {
    name: 'phub',
    aliases: ['pornhub', 'porn-hub'],
    category: 'images',
    ClientPermissions: ['ATTACH_FILES', 'MANAGE_MESSAGES'],
    emoji: '🔞',
    usage: '<phub> [@user] <text>',
    description: 'Recomendo não usar',

    run: async (client, message, args, prefix, MessageEmbed, Database) => {

        let user = message.mentions.users.first()
        if (!user) return message.reply(`${e.Info} | Tenta assim: \`${prefix}phub @user O texto em diante\` *(Limite de 50 caracteres)*`)

        let avatar = user.displayAvatarURL({ format: 'png' })

        let text = args.slice(1).join(" ")
        if (!text) return message.reply(`${e.Info} | Tenta assim: \`${prefix}phub @user O texto em diante\` *(Limite de 50 caracteres)*`)
        if (text.length > 50) return message.reply(`${e.Deny} | O limite do texto é de **50 caracteres**`)

        try {

            return message.reply(`${e.Loading} | Carregando`).then(async msg => {
                let image = new MessageAttachment(await Canvas.phub(options = { username: user.username, message: text, image: avatar }), 'phub.png')

                msg.delete().catch(() => { })
                message.channel.send({ files: [image] })
                message.delete().catch(() => { })
            })

        } catch (err) {
            Error(message, err)
        }
    }
}