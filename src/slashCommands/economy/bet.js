const Colors = require('../../../modules/functions/plugins/colors')

module.exports = {
    name: 'bet',
    description: '[economy] Aposte e conquiste todo o dinheiro',
    dm_permission: false,
    type: 1,
    options: [
        {
            name: 'party',
            description: '[economy] Comece uma festa com bet',
            type: 1,
            options: [
                {
                    name: 'opções',
                    description: 'Quantas áreas de apostas para essa party?',
                    type: 4,
                    required: true,
                    choices: [
                        {
                            name: '2 Áreas',
                            value: 2
                        },
                        {
                            name: '3 Áreas',
                            value: 3
                        },
                        {
                            name: '4 Áreas',
                            value: 4
                        }
                    ]
                },
                {
                    name: 'value',
                    description: 'Quantia a ser apostada',
                    type: 4,
                    min_value: 1,
                    required: true
                },
                {
                    name: 'players',
                    description: 'Quantia de players nessa aposta',
                    type: 4,
                    min_value: 1,
                    max_value: 30
                },
            ]
        },
        {
            name: 'simples',
            description: '[economy] Inicie uma aposta simples',
            type: 1,
            options: [
                {
                    name: 'value',
                    description: 'Quantia a ser apostada',
                    type: 4,
                    min_value: 1,
                    required: true
                },
                {
                    name: 'players',
                    description: 'Limite de jogadores (max: 30)',
                    type: 4,
                    min_value: 1,
                    max_value: 30
                }
            ]
        },
        {
            name: 'user',
            description: '[economy] Aposte com alguém',
            type: 1,
            options: [
                {
                    name: 'value',
                    description: 'Quantia a ser apostada',
                    type: 4,
                    min_value: 1,
                    required: true
                },
                {
                    name: 'user',
                    description: 'Contra quem é a aposta?',
                    type: 6,
                    required: true
                }
            ]
        },
        {
            name: 'colors',
            description: '[economy] Aposte na sua cor e boa sorte',
            type: 1,
            options: [
                {
                    name: 'value',
                    description: 'Quantia a ser apostada',
                    type: 4,
                    min_value: 1,
                    required: true
                }
            ]
        },
        {
            name: 'global',
            description: '[economy] Aposte globalmente com qualquer pessoa',
            type: 1,
            options: [
                {
                    name: 'betchoice',
                    description: 'Valor da aposta',
                    type: 3,
                    required: true,
                    autocomplete: true
                },
                {
                    name: 'bet',
                    description: 'Entrar ou apostar com alguém na fila?',
                    type: 3,
                    required: true,
                    choices: [
                        {
                            name: 'Entrar na fila',
                            value: 'join'
                        },
                        {
                            name: 'Apostar com alguém na fila',
                            value: 'bet'
                        }
                    ]
                }
            ]
        }
    ],
    async execute({ interaction: interaction, client: client, database: Database, emojis: e, guildData: guildData, clientData: clientData }) {

        const { options, user: author, channel } = interaction

        let user = options.getUser('user')
        let subCommand = options.getSubcommand()
        let value = options.getInteger('value')
        let moeda = guildData?.Moeda || `${e.Coin} Safiras`
        let authorData = await Database.User.findOne({ id: author.id }, 'Balance Timeouts')
        let money = authorData?.Balance || 0

        switch (subCommand) {
            case 'simples': case 'party': betSimples(); break;
            case 'user': betUser(); break;
            case 'global': globalBet(); break;
            case 'colors': require('./bet source/colors.Bet')(interaction, value, money, moeda); break;
        }
        return

        async function betSimples() {

            const color = await Colors(author.id)
            if (subCommand === 'party') return betParty()

            let BetUsers = [],
                LimitUsers = options.getInteger('players') || 30,
                atualPrize = 0

            if (!money || value > money || money < 1)
                return await interaction.reply({
                    content: `${e.Deny} | Você não tem todo esse dinheiro na carteira.`,
                    ephemeral: true
                })

            function BetUsersEmbed() {
                return BetUsers?.length >= 1
                    ? BetUsers.map(id => `<@${id}>`).join('\n')
                    : 'Ninguém'
            }

            const BetEmbed = {
                color: color,
                thumbnail: { url: 'https://imgur.com/k5NKfe8.gif' },
                title: `${author.username} iniciou uma nova aposta`,
                footer: { text: `Limite máximo: ${LimitUsers} participantes` }
            }

            return money >= value
                ? (() => {
                    Database.subtract(author.id, value)
                    atualPrize += value
                    Database.PushTransaction(author.id, `${e.loss} Apostou ${value || 0} Safiras no comando bet`)
                    BetUsers.push(author.id)
                    return BetInit()
                })()
                : await interaction.reply({
                    content: `${e.Deny} | Você está usando o comando errado... Tenta \`${prefix}bet\``,
                    ephemeral: true
                })

            async function BetInit() {

                BetEmbed.fields = [
                    {
                        name: '⠀',
                        value: 'Dinheiro perdido no comando de aposta não será extornado. Cuidado com promessas de jogadores e sua ganância. Uma vez que o dinheiro foi perdido, você não o terá de volta por meios de reclamações.'
                    }
                ]
                BetEmbed.description = `Valor da aposta: ${atualPrize} ${moeda}\n**Participantes**\n${BetUsersEmbed()}\n \n💰 Prêmio acumulado: ${(BetUsers?.length || 0) * value}`

                let buttons = {
                    type: 1,
                    components: [
                        {
                            type: 2,
                            label: 'Finalizar Aposta',
                            custom_id: 'finish',
                            style: 'PRIMARY'
                        },
                        {
                            type: 2,
                            label: 'Participar',
                            custom_id: 'join',
                            style: 'SUCCESS'
                        },
                        {
                            type: 2,
                            label: 'Sair',
                            custom_id: 'leave',
                            style: 'DANGER'
                        }
                    ]
                }

                let msg = await interaction.reply({
                    embeds: [BetEmbed],
                    components: [buttons],
                    fetchReply: true
                })

                let collector = msg.createMessageComponentCollector({
                    filter: () => true,
                    time: 120000,
                    errors: ['time']
                })

                    .on('collect', async (int) => {

                        let { customId, user: intUser } = int

                        if (customId === 'finish' && intUser.id === author.id)
                            return collector.stop()

                        if (customId === 'join') {

                            if (BetUsers.includes(intUser.id))
                                return await int.reply({
                                    content: `${e.Deny} | Você já entrou nesta aposta.`,
                                    ephemeral: true
                                })

                            let userData = await Database.User.findOne({ id: intUser.id }, 'Balance')

                            if (userData?.Balance < value)
                                return await int.reply({
                                    content: `${e.Deny} | ${intUser}, você deve ter pelo menos **${value} ${moeda}** na carteira para entrar nesta aposta.`,
                                    ephemeral: true
                                })

                            Database.subtract(intUser.id, value)
                            atualPrize += value
                            BetUsers.push(intUser.id)
                            Database.PushTransaction(intUser.id, `${e.loss} Apostou ${value || 0} Safiras no comando bet`)

                            BetEmbed.description = `Valor da aposta: ${value} ${moeda}\n**Participantes**\n${BetUsersEmbed()}\n \n💰 Prêmio acumulado: ${atualPrize}`

                            msg.edit({ embeds: [BetEmbed] })
                                .catch(err => {
                                    channel.send(`${e.Deny} | Houve um erro ao editar a mensagem da aposta.\n\`${err}\``)
                                    return collector.stop()
                                })

                            if (BetUsers.length >= LimitUsers)
                                return collector.stop()

                            return
                        }

                        if (customId === 'leave') {
                            int.deferUpdate().catch(() => { })
                            return RemoveUser(intUser)
                        }
                    })

                    .on('end', () => Win())

                async function Win() {

                    if (BetUsers.length === 0 || BetUsers.length === 1 && BetUsers.includes(author.id)) {

                        msg.edit({
                            embeds: [
                                {
                                    color: client.red,
                                    title: `${author.username} fez uma aposta`,
                                    thumbnail: { url: 'https://imgur.com/k5NKfe8.gif' },
                                    description: `${BetEmbed.description}\n \n${e.Deny} Essa aposta foi cancelada por não haver participantes suficientes`
                                }
                            ],
                            components: []
                        }).catch(() => { })

                        if (atualPrize > 0) {
                            Database.add(author.id, atualPrize)
                            Database.PushTransaction(
                                author.id,
                                `${e.gain} Recebeu de volta ${parseInt(atualPrize) || 0} Safiras no comando bet`
                            )
                        }

                        return await interaction.followUp({
                            content: `${e.Deny} | ${author}, aposta cancelada.`
                        }).catch(() => { })
                    }

                    let winnerId = BetUsers.random(),
                        taxa = parseInt(atualPrize * 0.05).toFixed(0)

                    if (taxa > 0) atualPrize -= taxa
                    if (atualPrize > 0) Database.add(winnerId, atualPrize)

                    Database.PushTransaction(winnerId, `${e.gain} Recebeu ${parseInt(atualPrize) || 0} Safiras no comando bet`)

                    await interaction.followUp({
                        content: `${e.MoneyWings} | <@${winnerId}> ganhou a aposta no valor de **${atualPrize} ${moeda}** iniciada por ${author}.\n${taxa > 0 ? `${e.Taxa} | Taxa cobrada (5%): ${taxa} ${moeda}` : ''}`
                    }).catch(() => { })

                    return msg.edit({
                        embeds: [{
                            color: client.red,
                            title: `${author.username} fez uma aposta`,
                            thumbnail: { url: 'https://imgur.com/k5NKfe8.gif' },
                            description: `${BetEmbed.description}\n \n🏆 <@${winnerId}> ganhou a aposta`
                        }],
                        components: []
                    }).catch(() => { })
                }

                function RemoveUser(user) {
                    if (!BetUsers.includes(user.id)) return

                    BetUsers.splice(BetUsers.indexOf(user.id), 1)
                    BetEmbed.description = `Valor da aposta: ${value} ${moeda}\n**Participantes**\n${BetUsersEmbed()}\n \n💰 Prêmio acumulado: ${(BetUsers?.length || 0) * (value || 0)}`
                    msg.edit({ embeds: [BetEmbed] }).catch(() => { })

                    Database.add(user.id, value)
                    Database.PushTransaction(
                        user.id,
                        `${e.gain} Recebeu de volta ${value || 0} Safiras no comando bet`
                    )
                    atualPrize -= value
                    return
                }
            }

            async function betParty() {

                let optionsChoosen = options.getInteger('opções')

                if (money <= 0)
                    return await interaction.reply({
                        content: `${e.Deny} | Ishhh, você não tem nada...`,
                        ephemeral: true
                    })

                if (money < value)
                    return await interaction.reply({
                        content: `${e.Deny} | Você não tem todo esse dinheiro não...`,
                        ephemeral: true
                    })

                let buttons = {
                    type: 1,
                    components: [
                        {
                            type: 2,
                            label: 'Finalizar',
                            custom_id: 'cancel',
                            style: 'SUCCESS'
                        }
                    ],
                },
                    arrayControl = { usersInMatch: [], Areas: ['1'] }

                for (let i = 1; i <= optionsChoosen; i++) {
                    buttons.components.push({
                        type: 2,
                        label: `Area ${i}`,
                        custom_id: `${i}`,
                        style: 'PRIMARY'
                    })
                    arrayControl[i] = []
                    arrayControl.Areas.push(`${i}`)
                }

                Database.subtract(author.id, value)
                let prize = 0,
                    embed = {
                        color: color,
                        title: '🎉 Bet Party',
                        description: `${author} iniciou uma Bet Party!\n \n${e.MoneyWithWings} Valor de entrada: ${value} ${moeda}`
                    }

                const msg = await interaction.reply({
                    embeds: [embed],
                    components: [buttons],
                    fetchReply: true
                })

                let collector = msg.createMessageComponentCollector({
                    filter: () => true,
                    time: 60000,
                    errors: ['time']
                })

                    .on('collect', async int => {

                        let { customId, user: intUser } = int

                        if (customId === 'cancel' && intUser.id === author.id)
                            return collector.stop()

                        if (!arrayControl.Areas.includes(customId)) return int.deferUpdate().catch(() => { })
                        if (arrayControl.usersInMatch.includes(intUser.id)) return int.deferUpdate().catch(() => { })
                        let userBalance = await Database.balance(intUser.id)

                        if (userBalance <= 0)
                            return await int.reply({
                                content: `${e.Deny} | ${intUser}, você não tem nada na sua carteira :(`,
                                ephemeral: true
                            })

                        if (userBalance < value)
                            return await int.reply({
                                content: `${e.Deny} | ${intUser}, você precisa ter **${value} ${moeda}** para entrar na Bet Party`,
                                ephemeral: true
                            })

                        arrayControl.usersInMatch.push(intUser.id)
                        arrayControl[`${customId}`].push(intUser.id)
                        subtractAndAddPrize(intUser.id)

                        return await int.reply({
                            content: `**🎉 Bet Party** | ${intUser} entrou na **Area ${customId}**`
                        }).catch(() => { })
                    })
                    .on('end', () => finishBetParty())

                function subtractAndAddPrize(userId) {
                    Database.subtract(userId, value)
                    prize += value
                    attEmbed()
                    return
                }

                function attEmbed() {
                    embed.description = `${author} iniciou uma Bet Party!\n \n${e.MoneyWithWings} Valor de entrada: ${value} ${moeda}\n${e.gain} Total acumulado: ${prize} ${moeda}\n `

                    for (let i = 1; i <= arrayControl.Areas.length; i++)
                        if (arrayControl[`${i}`]?.length > 0)
                            embed.description = `${embed.description}\n**Area ${i}**: ${arrayControl[`${i}`].length} players`

                    return msg.edit({ embeds: [embed] }).catch(() => { })
                }

                async function finishBetParty() {

                    let areaChoosen = arrayControl.Areas.random(),
                        area = arrayControl[`${areaChoosen}`],
                        allPlayers = arrayControl.usersInMatch

                    if (!allPlayers || allPlayers.length === 0) return nobody()

                    if (!area || area.length === 0) return nobodyInBetParty()

                    let winner = area.random(),
                        userUsername = interaction.guild.members.cache.get(winner)?.user?.username || 'Indefinido'

                    Database.add(winner, prize)
                    Database.PushTransaction(winner, `${e.gain} Ganhou ${prize} Safiras em uma *bet party*`)
                    embed.color = client.red
                    embed.title = '🎉 Bet Party | Cancelada'
                    embed.footer = `Ganhador: ${userUsername} | Area ${areaChoosen}`
                    msg.edit({ embeds: [embed], components: [] }).catch(() => { })
                    return await interaction.followUp({
                        content: `**🎉 Bet Party** | A **Area ${areaChoosen}** foi sorteada e o ganhador foi ${interaction.guild.members.cache.get(winner)}. Prêmio: **${prize} ${moeda}**`
                    }).catch(() => { })

                    async function nobodyInBetParty() {
                        Database.add(author.id, prize)
                        embed.color = client.red
                        embed.title = '🎉 Bet Party | Cancelada'
                        embed.footer = { text: `A area sorteada (${areaChoosen}) não tinha ninguém.` }
                        msg.edit({
                            embeds: [embed], components: []
                        }).catch(() => { })
                        return await interaction.followUp({
                            content: `**🎉 Bet Party** | A **Area ${areaChoosen}** não tinha ninguém, então o prêmio de **${prize} ${moeda}** foi para ${author}.`
                        })
                    }

                    async function nobody() {
                        Database.add(author.id, prize)
                        embed.color = client.red
                        embed.title = '🎉 Bet Party | Cancelada'
                        embed.footer = { text: 'Ninguém participou da Bet Party' }
                        msg.edit({ embeds: [embed], components: [] }).catch(() => { })
                        return await interaction.followUp({
                            content: `**🎉 Bet Party** | Ninguém participou dessa rodada.`
                        })
                    }

                }

                return
            }
        }

        async function betUser() {

            if (user.id === client.user.id) {
                let result = ~~(value * 0.05)
                let msg = ''

                if (result < 20) {
                    msg = 'Sorte sua que o valor calculado foi 0, se não eu ia tirar de você pra deixar de ser esperto*(a)*'
                } else {
                    msg = `Eu tirei 5% (*${result} ${moeda}*) de você pra parar de ser esperto*(a)*.`
                    Database.subtract(author.id, value)
                }

                return await interaction.reply({
                    content: `${e.Deny} | Eu posso manipular as apostas e você tem coragem de apostar comigo? ${msg}`,
                    ephemeral: true
                })
            }

            if (user.id === author.id)
                return await interaction.reply({
                    content: `${e.Deny} | Opa! Nada de apostar contra você mesmo.`,
                    ephemeral: true
                })

            if (!money || money <= 0)
                return await interaction.reply({
                    content: `${e.Deny} | Você não tem dinheiro nenhum... Poxa...`,
                    ephemeral: true
                })

            if (value > money)
                return await interaction.reply({
                    content: `${e.Deny} | Você não possui todo esse dinheiro.`,
                    ephemeral: true
                })

            let memberData = await Database.User.findOne({ id: user.id }, 'Balance')

            let memberMoney = memberData?.Balance || 0

            if (!memberMoney || memberMoney <= 0)
                return await interaction.reply({
                    content: `${e.Deny} | ${user.username} não tem dinheiro pra brincar de apostar.`,
                    ephemeral: true
                })

            if (value > memberMoney)
                return await interaction.reply({
                    content: `${e.Deny} | ${user.username} não tem todo o dinheiro da aposta.`,
                    ephemeral: true
                })

            let buttons = [
                {
                    type: 1,
                    components: [
                        {
                            type: 2,
                            label: 'ACEITAR',
                            custom_id: 'accept',
                            style: 'SUCCESS'
                        },
                        {
                            type: 2,
                            label: 'RECUSAR',
                            custom_id: 'cancel',
                            style: 'DANGER'
                        }
                    ]
                }
            ]

            Database.subtract(author.id, value)

            let msg = await interaction.reply({
                content: `${e.QuestionMark} | ${user}, você está sendo desafiado por ${author} para um *bet* no valor de **${value} ${moeda}**.\n> *A aposta será realizada no momento em que ${user.displayName} clicar em "aceitar".*`,
                components: buttons,
                fetchReply: true
            }), collected = false

            let collector = msg.createMessageComponentCollector({
                filter: int => [user.id, author.id].includes(int.user.id),
                time: 60000,
            })
                .on('collect', int => {
                    int.deferUpdate().catch(() => { })

                    const { customId, user: u } = int

                    if (customId === 'cancel') return collector.stop()

                    if (customId === 'accept' && u.id !== user.id) return

                    Database.subtract(user.id, value)
                    collected = true
                    msg.delete().catch(() => { })
                    return executeBet()
                })
                .on('end', () => {
                    if (collected) return
                    Database.add(author.id, value)
                    return msg.edit({
                        content: `${e.Deny} | Aposta cancelada.`,
                        components: []
                    }).catch(() => { })
                })

            async function executeBet() {

                let winner = [author, user].random()
                let loser = winner.id === user.id ? author : user

                let taxa = parseInt((value * 0.05).toFixed(0)), taxaValidate = ''

                if (value >= 1000) {
                    value -= taxa
                    taxaValidate = `\n${e.Taxa} | *Apostas maiores que 1000 ${moeda} tem uma taxa de 5% (-${taxa})*`
                }

                channel.send(`👑 | ${winner} ganhou a aposta contra ${loser}! E com sua vitória, faturou **${value} ${moeda}**.${taxaValidate}`)

                return paymentAndRegister(winner, loser, value, taxa)
            }

            async function paymentAndRegister(winner, loser, value, taxa = 0) {

                let prize = parseInt((value + taxa) * 2)

                Database.add(winner.id, prize)

                Database.PushTransaction(
                    winner.id,
                    `${e.gain} Ganhou ${value} Safiras apostando contra ${loser.tag}`
                )

                Database.PushTransaction(
                    loser.id,
                    `${e.loss} Perdeu ${value} Safiras apostando contra ${winner.tag}`
                )
            }

            return

        }

        async function globalBet() {
            let value = parseInt(options.getString('betchoice'))
            let func = options.getString('bet')
            let globalBets = clientData?.GlobalBet || []
            let globalBetValids = [0, 100, 2000, 5000, 10000, 20000, 30000, 40000, 50000, 60000, 70000, 80000, 90000, 100000]
            let bets = globalBets[`${value}`] || []

            if (!globalBetValids.includes(value))
                return await interaction.reply({
                    content: `${e.Deny} | Esta opção não é válida no bet global.`,
                    ephemeral: true
                })

            if (money < value)
                return await interaction.reply({
                    content: `${e.Deny} | Você não tem ${value} ${e.Coin} Safiras para nesta fila.`,
                    ephemeral: true
                })

            if (func === 'join') return registerBet(value, bets)

            if (bets?.length > 0) return newBetGlobal(bets[0], value)

            return await interaction.reply({
                content: `${e.Info} | Não tem ninguém na fila ${value} Safiras. Entre na fila ou espere alguém entrar para iniciar uma aposta.`
            })
        }

        async function registerBet(value, bets) {

            if (bets?.includes(author.id))
                return await interaction.reply({
                    content: `${e.Deny} | Você já está nesta fila.`,
                    ephemeral: true
                })

            await Database.Client.updateOne(
                { id: client.user.id },
                { $push: { [`GlobalBet.${value}`]: author.id } }
            )

            if (value !== 0)
                Database.subtract(author.id, value)

            return await interaction.reply({
                content: `${e.Check} | Ok! Você entrou na fila de espera de ${value} Safiras. Basta esperar alguém apostar com você. Você verá o resultado no comando \`/transactions\``
            })
        }

        async function newBetGlobal(betUserId, value) {

            if (betUserId === author.id)
                return await interaction.reply({
                    content: `${e.Info} | Você esta em 1º lugar na fila de espera de ${value} Safiras. Espere alguém apostar com você para apostar novamente.`
                })

            let user = client.users.cache.get(betUserId)

            if (!user) {
                await Database.Client.updateOne(
                    { id: client.user.id },
                    { $pullAll: { [`GlobalBet.${value}`]: [betUserId] } }
                )

                if (value !== 0)
                    Database.add(author.id, value)
                return await interaction.reply({
                    content: `${e.Check} | O usuário da aposta não foi encontrado. Eu devolvi seu dinheiro.`,
                    ephemeral: true
                })
            }

            if (value !== 0)
                Database.subtract(author.id, value)

            let winner = [user, author].random()
            let loser = winner.id === author.id ? user : author

            if (value !== 0) {
                Database.add(winner.id, value * 2)

                Database.PushTransaction(
                    winner.id,
                    `${e.gain} Ganhou ${value} Safiras no Bet Global contra *${loser.tag}*`
                )

                Database.PushTransaction(
                    loser.id,
                    `${e.loss} Perdeu ${value} Safiras no Bet Global contra ${winner.tag}`
                )
            }

            await Database.Client.updateOne(
                { id: client.user.id },
                { $pull: { [`GlobalBet.${value}`]: betUserId } }
            )

            let winMessage = `${e.CoolDoge} | Você ganhou o *Bet Global* contra *${loser.tag} - \`${loser.id}\`*. Seu lucro foi de ${value} ${e.Coin} Safiras`
            let loseMessage = `${e.SaphireCry} | Você perdeu o *Bet Global* contra *${winner.tag} - \`${winner.id}\`*. Seu prejuizo foi de ${value} ${e.Coin} Safiras`

            return await interaction.reply({ content: winner.id === author.id ? winMessage : loseMessage })
        }
    }
}