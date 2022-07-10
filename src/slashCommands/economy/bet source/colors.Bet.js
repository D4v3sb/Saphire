const Database = require('../../../../modules/classes/Database')
const client = require('../../../../index')
const { e } = require('../../../../JSON/emojis.json')

async function betColor(interaction, value, authorMoney, moeda) {

    if (value > authorMoney)
        return await interaction.reply({
            content: `${e.Deny} | Você não possui todo esse dinheiro.`,
            ephemeral: true
        })

    const control = {
        prize: 0,
        blueUsers: [],
        redUsers: [],
        greenUsers: [],
        grayUsers: [],
        usersInColors: [],
        alreadyAnswer: [],
        SECONDARY: 'Cinza',
        SUCCESS: 'Verde',
        PRIMARY: 'Azul',
        DANGER: 'Vermelho'
    }

    const buttons = getButtons(control)

    const prizes = {
        bluePrize: () => control.blueUsers.length > 0 ? parseInt(control.prize / control.blueUsers.length) : 0,
        grayPrize: () => control.grayUsers.length > 0 ? parseInt(control.prize / control.grayUsers.length) : 0,
        greenPrize: () => control.greenUsers.length > 0 ? parseInt(control.prize / control.greenUsers.length) : 0,
        redPrize: () => control.redUsers.length > 0 ? parseInt(control.prize / control.redUsers.length) : 0,
    }

    const formatPrizes = () => {
        return `🔵 **${prizes.bluePrize()} ${moeda}**\n⚫ **${prizes.grayPrize()} ${moeda}**\n🟢 **${prizes.greenPrize()} ${moeda}**\n🔴 **${prizes.redPrize()} ${moeda}**`
    }

    const msg = await interaction.reply({
        embeds: [
            {
                color: client.blue,
                title: `${e.MoneyWings} | ${interaction.user.username} iniciou um Bet Colors`,
                description: `O valor desta rodada é **${value.currency()} ${moeda}**.`,
                fields: [
                    {
                        name: '💰 Prêmio',
                        value: `${formatPrizes()}`
                    },
                    {
                        name: `${e.Info} Info`,
                        value: `O valor do prêmio é o total de **(${control.prize} ${moeda})** dividido para todos os membros de sua cor.`
                    }
                ]
            }
        ],
        fetchReply: true,
        components: [buttons]
    })

    return msg.createMessageComponentCollector({
        filter: int => true,
        time: 20000
    })
        .on('collect', async int => {

            const { customId, user } = int

            if (control.usersInColors.includes(user.id)) {
                if (control.alreadyAnswer.includes(user.id)) return await int.deferUpdate().catch(() => { })
                control.alreadyAnswer.push(user.id)
                await int.reply({
                    content: `${e.Info} | Você já entrou nesta aposta.`,
                    ephemeral: true
                })
                return await int.deferUpdate().catch(() => { })
            }

            const userData = await Database.User.findOne({ id: user.id }, 'Balance')

            if (!userData || !userData.Balance || userData.Balance <= 0 || userData.Balance < value)
                return await int.reply({
                    content: `${e.Deny} | Você não tem dinheiro o suficiente para participar desta aposta.`,
                    ephemeral: true
                })

            Database.subtract(user.id, value)
            Database.PushTransaction(user.id, `${e.loss} Apostou ${value} Safiras no *bet colors*`)
            control[customId].push(user.id)
            control.usersInColors.push(user.id)
            control.prize += value
            await int.deferUpdate().catch(() => { })
            return refreshEmbed()
        })
        .on('end', async () => {

            const buttons = getButtons(control)
            const buttonSelect = buttons.components.random()
            const color = control[buttonSelect.style]
            const winnersArray = control[buttonSelect.custom_id] || []
            const embed = msg.embeds[0]

            if (!embed) return

            embed.fields[0].value = formatPrizes()

            for (let i = 0; i <= 3; i++) {
                buttons.components[i].disabled = true
                if (buttons.components[i].custom_id === buttonSelect.custom_id)
                    buttons.components[i].emoji = '👑'
            }

            if (winnersArray.length === 0) return nobody()
            return winners()

            async function nobody() {
                embed.fields[1].value = `O botão **${color}** foi sortado. Porém, não havia ninguém nesta cor.\nO prêmio de **(${control.prize} ${moeda})** foi perdido.`
                embed.color = client.red
                embed.footer = { text: `${control.usersInColors.length} Apostadores | Aposta encerrada` }
                return await interaction.editReply({
                    embeds: [embed],
                    components: [buttons]
                }).catch(async () => {
                    return interaction.channel.send({
                        embeds: [embed],
                        components: [buttons]
                    })
                })
            }

            async function winners() {

                const text = winnersArray.length > 1
                    ? `Todos os **${winnersArray.length} apostadores** ganharam`
                    : `Apenas ${interaction.guild.members.cache.get(winnersArray[0])} está na cor ${color}. Seu prêmio foi`
                const prizeDivived = parseInt(control.prize / winnersArray.length)

                for (let id of winnersArray) {
                    Database.add(id, prizeDivived)
                    Database.PushTransaction(
                        id, `${e.gain} Ganhou ${prizeDivived} Safiras no *bet colors*`
                    )
                }

                embed.fields[1].value = `O botão **${color}** foi sortado.\n${text} um total de **${prizeDivived} ${moeda}**.`
                embed.color = client.red
                embed.footer = { text: `${control.usersInColors.length} Apostadores | Aposta encerrada` }

                return await interaction.editReply({
                    embeds: [embed],
                    components: [buttons]
                }).catch(async () => {
                    return interaction.channel.send({
                        embeds: [embed],
                        components: [buttons]
                    })
                })
            }

        })

    async function refreshEmbed() {
        const embed = msg.embeds[0]
        if (!embed) return

        const buttons = getButtons(control)
        embed.fields[0].value = formatPrizes()
        embed.fields[1].value = `O valor do prêmio é o total de **(${control.prize} ${moeda})** dividido para todos os membros de sua cor.`
        embed.footer = { text: `${control.usersInColors.length} Apostadores` }

        return await interaction.editReply({
            embeds: [embed],
            components: [buttons]
        })
    }
}

function getButtons(control) {

    return {
        type: 1,
        components: [
            {
                type: 2,
                label: `AZUL (${control.blueUsers.length})`,
                custom_id: 'blueUsers',
                style: 'PRIMARY'
            },
            {
                type: 2,
                label: `CINZA (${control.grayUsers.length})`,
                custom_id: 'grayUsers',
                style: 'SECONDARY'
            },
            {
                type: 2,
                label: `VERDE (${control.greenUsers.length})`,
                custom_id: 'greenUsers',
                style: 'SUCCESS'
            },
            {
                type: 2,
                label: `VERMELHO (${control.redUsers.length})`,
                custom_id: 'redUsers',
                style: 'DANGER'
            }
        ]
    }

}

module.exports = betColor