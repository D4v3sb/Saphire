const Database = require('../../../../modules/classes/Database')
const { Emojis: e } = Database
const client = require('../../../../index')

async function start(Msg, interaction, embed) {

    const { plugins: { formatString, emoji }, addPoint, randomizeFlags } = require('../index')
    const { channel } = interaction
    const flags = await Database.Flags.get('Flags') || []
    const control = { atualFlag: {}, usersPoints: [], rounds: 0, collected: false, winners: [], alreadyAnswer: [], wrongAnswers: [] }
    randomizeFlags(0, flags, control)
    return newRound()

    async function newRound() {
        control.rounds++

        if (Msg)
            Msg?.delete().catch(() => Database.registerChannelControl('pull', 'Flag', channel?.id))

        embed.description = `${e.Loading} | Qual é a bandeira?\n${control.atualFlag.flag} - ???`
        embed.image = { url: control.atualFlag.image || null }
        embed.footer = { text: `Round: ${control.rounds}` }

        let msg = await channel.send({ embeds: [embed] }).catch(() => Database.registerChannelControl('pull', 'Flag', channel?.id))

        return msg.channel.createMessageCollector({
            filter: m => control.atualFlag?.country.includes(m.content?.toLowerCase()),
            idle: 15000,
            max: 1,
            errors: ['idle', 'max']
        })
            .on('collect', async Message => {

                control.collected = true

                await addPoint(Message.author, control)

                embed.description = `${e.Check} | ${Message.author} acertou a bandeira!\n${control.atualFlag.flag} - ${formatString(Message.content.toLowerCase())}\n \n${e.Loading} Próxima bandeira...`
                embed.image = { url: null }

                msg.delete().catch(() => Database.registerChannelControl('pull', 'Flag', channel?.id))
                await randomizeFlags(0, flags, control)
                refreshField()
                let toDelMessage = await Message.reply({ embeds: [embed] }).catch(() => Database.registerChannelControl('pull', 'Flag', channel?.id))

                return setTimeout(async () => {
                    await toDelMessage.delete().catch(() => { })
                    newRound()
                }, 4000)

            })
            .on('end', () => {

                if (control.collected) return control.collected = false

                Database.Cache.pull('Flag', channel?.id)

                embed.color = client.red
                embed.description = `${e.Deny} | Ninguém acertou a bandeira.\n${control.atualFlag.flag} - ${formatString(control.atualFlag?.country[0])}\n🔄 ${control.rounds} Rounds`
                embed.footer = { text: 'Flag Game encerrado' }
                msg.delete().catch(() => { })

                return channel.send({ embeds: [embed] }).catch(() => { })
            })
    }

    function refreshField() {
        let ranking = control.usersPoints
            .sort((a, b) => b.points - a.points)
            .slice(0, 5)
            .map((d, i) => `${emoji(i)} ${d.name} - ${d.points} pontos`)
            .join('\n')

        if (embed.fields?.length === 1)
            embed.fields[0] = [{ name: '🏆 Pontuação', value: `${ranking || `${e.Deny} RANKING BAD FORMATED`}` }]
        else embed.fields = [{ name: '🏆 Pontuação', value: `${ranking || `${e.Deny} RANKING BAD FORMATED`}${control.usersPoints.length > 5 ? `\n+${control.usersPoints.length - 5} players` : ''}` }]
        return
    }
}

module.exports = start