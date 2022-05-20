const { g } = require('../../../modules/Images/gifs.json')
const { e } = require('../../../JSON/emojis.json')

module.exports = {
    name: 'cutucar',
    aliases: ['poke'],
    category: 'interactions',

    ClientPermissions: ['EMBED_LINKS', 'ADD_REACTIONS'],
    emoji: '👉',
    usage: '<cutucar> <@user>',
    description: 'Cutucar irrita, faz isso não',

    execute: async (client, message, args, prefix, MessageEmbed, Database) => {

        let rand = g.Cutucar[Math.floor(Math.random() * g.Cutucar.length)],
            user = message.mentions.members.first() || message.mentions.repliedUser

        if (!user) return message.reply(`${e.Info} | Marca alguém.`)

        if (user.id === client.user.id)
            return message.reply(`Não me cutuca não, sai ${e.MaikaAngry}`)

        if (user.id === message.author.id) return message.reply(`${e.Deny} | Marca alguém lerdinho(a)`)

        const embed = new MessageEmbed()
            .setColor('#246FE0')
            .setDescription(`👉 | ${message.author} está te cutucando ${user}`)
            .setImage(rand)
            .setFooter({ text: '🔁 retribuir' })

        return message.reply({ embeds: [embed] }).then(msg => {

            msg.react('🔁').catch(() => { }) // Check

            const filter = (reaction, u) => { return ['🔁'].includes(reaction.emoji.name) && u.id === user.id }

            msg.awaitReactions({ filter, max: 1, time: 15000, errors: ['time'] }).then(collected => {
                const reaction = collected.first()

                if (reaction.emoji.name === '🔁') {

                    const TradeEmbed = new MessageEmbed().setColor('RED').setDescription(`👉 ${message.author} e ${user} estão se cutucando 👈`).setImage(g.Cutucar[Math.floor(Math.random() * g.Cutucar.length)])
                    msg.edit({ embeds: [TradeEmbed] }).catch(() => { })
                }

            }).catch(() => {

                embed.setColor('RED')
                msg.edit({ embeds: [embed] }).catch(() => { })
            })
        })
    }
}