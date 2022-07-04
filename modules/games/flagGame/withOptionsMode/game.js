const Database = require('../../../../modules/classes/Database')
const { Emojis: e } = Database
const client = require('../../../../index')

async function executeNewGame(Msg, interaction, embed = {}) {

    const { generateButtons, plugins: { formatString, emoji }, addPoint } = require('../index')
    const { channel } = interaction
    const control = { atualFlag: {}, usersPoints: [], rounds: 0, collected: false, winners: [], alreadyAnswer: [], wrongAnswers: [] }
    return newRound()

    async function newRound() {
        control.rounds++
        await generateButtons(control, formatString)
        let blockedChannels = Database.Cache.get('Flag') || []

        if (!blockedChannels?.includes(channel?.id))
            Database.Cache.push('Flag', channel?.id)

        if (Msg)
            Msg.delete().catch(() => Database.Cache.pull('Flag', channel?.id))

        embed.description = `${e.Loading} | Qual é a bandeira?\n${control.atualFlag.flag} - ???`
        embed.image = { url: control.atualFlag.image || null }
        embed.footer = { text: `Round: ${control.rounds}` }

        let msg = await channel.send({
            embeds: [embed],
            components: control.buttons
        }).catch(() => Database.Cache.pull('Flag', channel?.id))

        msg.createMessageComponentCollector({
            filter: () => true,
            time: 10000,
            errors: ['time']
        })
            .on('collect', async int => {
                await int.deferUpdate().catch(() => { })

                if (control.alreadyAnswer?.includes(int.user.id)) return
                control.alreadyAnswer.push(int.user.id)

                if (control.atualFlag.country[0] === int.customId)
                    control.winners.push({ username: int.user.username, id: int.user.id })

                return await int.followUp({
                    content: `${e.Check} | Sua resposta foi registrada com sucesso.`,
                    ephemeral: true
                })
            })
            .on('end', async () => {

                let winners = control.winners

                if (winners.length === 0) {

                    Database.Cache.pull('Flag', channel?.id)

                    embed.color = client.red
                    embed.description = `${e.Deny} | Ninguém acertou a bandeira.\n${control.atualFlag.flag} - ${formatString(control.atualFlag?.country[0])}\n🔄 ${control.rounds} Rounds`
                    embed.footer = { text: 'Flag Game encerrado.' }
                    msg.delete().catch(() => { })

                    return channel.send({ embeds: [embed] }).catch(() => { })
                }

                embed.description = `${e.Check} | ${winners.length > 1 ? `${winners.slice(0, 4)?.map(u => u.username).join(', ')}${winners.length - 4 > 0 ? ` e mais ${winners.length - 4} jogadores` : ''} acertaram` : `${winners[0].username} acertou`} o país!\n${control.atualFlag.flag} - ${formatString(control.atualFlag?.country[0])}\n \n${e.Loading} Próxima bandeira...`
                embed.image = { url: null }
                msg.delete().catch(() => Database.Cache.pull('Flag', channel?.id))

                for (let u of winners)
                    addPoint({ username: u.username, id: u.id }, control)
                refreshField()

                let toDelMessage = await channel.send({ embeds: [embed], components: [] }).catch(() => Database.Cache.pull('Flag', channel?.id))

                control.winners = []
                control.alreadyAnswer = []
                control.wrongAnswers = []

                if (!Database.Cache.get('Flag')?.includes(channel?.id))
                    Database.Cache.push('Flag', channel?.id)
                return setTimeout(async () => {
                    await toDelMessage.delete().catch(() => { })
                    if (!Database.Cache.get('Flag')?.includes(channel?.id))
                        Database.Cache.push('Flag', channel?.id)
                    newRound()
                }, 5000)
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

module.exports = executeNewGame