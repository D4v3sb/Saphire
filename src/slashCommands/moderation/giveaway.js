const client = require('../../../index')

module.exports = {
    name: 'giveaway',
    description: '[moderation] Crie sorteios no servidor',
    type: 1,
    default_member_permissions: client.perms.MANAGE_CHANNELS,
    dm_permission: false,
    options: [
        {
            name: 'create',
            description: '[moderation] Crie um novo sorteio',
            type: 1,
            options: [
                {
                    name: 'prize',
                    description: 'Prêmio do sorteio',
                    type: 3,
                    required: true
                },
                {
                    name: 'time',
                    description: 'Para quando é o sorteio?',
                    type: 3,
                    required: true
                },
                {
                    name: 'channel',
                    description: 'Canal do sorteio',
                    type: 7,
                    required: true
                },
                {
                    name: 'winners',
                    description: 'Quantidade de vencedores',
                    type: 4,
                    max_value: 20,
                },
                {
                    name: 'requires',
                    description: 'Quais os requisitos para este sorteio',
                    type: 3
                },
                {
                    name: 'imageurl',
                    description: 'Quer alguma imagem no sorteio?',
                    type: 3
                }
            ]
        },
        {
            name: 'list',
            description: '[moderation] Lista de todos os sorteios',
            type: 1
        },
        {
            name: 'reroll',
            description: '[moderation] Resorteie um sorteio',
            type: 1,
            options: [
                {
                    name: 'id',
                    description: 'ID do sorteio (Id da mensagem do sorteio)',
                    type: 3,
                    required: true
                },
                {
                    name: 'winners',
                    description: 'Quantidade de vendores',
                    type: 4,
                    min_value: 1,
                    max_value: 20,
                    required: true
                }
            ]
        },
        {
            name: 'options',
            description: '[moderation] Opções e funções adicionais',
            type: 1,
            options: [
                {
                    name: 'method',
                    description: 'Escolha o método a ser utilizado',
                    type: 3,
                    required: true,
                    choices: [
                        {
                            name: 'delete',
                            value: 'delete'
                        },
                        {
                            name: 'reset',
                            value: 'reset'
                        },
                        {
                            name: 'finish',
                            value: 'finish'
                        },
                        {
                            name: 'info',
                            value: 'info'
                        }
                    ],
                },
                {
                    name: 'id',
                    description: 'ID do sorteio selecionado',
                    type: 3,
                    required: true
                }
            ]
        }
    ],
    async execute({ interaction: interaction, database: Database, emojis: e, guildData: guildData }) {

        const moment = require('moment'),
            Data = require('../../../modules/functions/plugins/data'),
            { day } = require('../../events/plugins/eventPlugins')

        const { options, guild, user, channel: intChannel } = interaction

        for (let perm of [{ discord: 'MANAGE_CHANNELS', user: 'GERENCIAR CANAIS' }, { discord: 'MANAGE_MESSAGES', user: 'GERENCIAR MENSAGENS' }])
            if (!guild.me.permissions.toArray().includes(perm.discord))
                return await interaction.reply({
                    content: `❌ | Eu preciso da permissão **\`${perm.user}\`**. Por favor, me dê esta permissão que eu vou conseguir fazer o sorteio.`,
                    ephemeral: true
                })

        let Prize = options.getString('prize')
        let Time = options.getString('time')
        let Requisitos = options.getString('requires') || null
        let imageURL = options.getString('imageurl') || null
        let Channel = options.getChannel('channel')
        let subCommand = options.getSubcommand()
        let giveawayId = options.getString('id')
        let method = options.getString('method')
        let WinnersAmount = options.getInteger('winners') || 1
        let TimeMs = 0

        switch (subCommand) {
            case 'create': createGiveaway(); break;
            case 'reroll': rerollGiveaway(); break;
            case 'options': methodsGiveaway(); break;
            case 'list': listGiveaway(); break;
        }

        return

        async function createGiveaway() {

            if (Channel.type !== 'GUILD_TEXT')
                return await interaction.reply({
                    content: '❌ | O canal selecionado não é um canal de texto.',
                    ephemeral: true
                })

            if (WinnersAmount > 20 || WinnersAmount < 1)
                return await interaction.reply({
                    content: '❌ | A quantidade de vencedores deve estar dentro de 1 a 20 usuários.',
                    ephemeral: true
                })

            if (Requisitos?.length > 1024)
                return await interaction.reply({
                    content: '❌ | O limite máximo do requisito é de 1024 caracteres.',
                    ephemeral: true
                })

            let Args = Time.trim().split(/ +/g)

            if (Args[0].includes('/') || Args[0].includes(':') || ['hoje', 'today', 'tomorrow', 'amanhã'].includes(Args[0]?.toLowerCase())) {

                let data = Args[0],
                    hour = Args[1]

                if (['tomorrow', 'amanhã'].includes(data.toLowerCase()))
                    data = day(true)

                if (['hoje', 'today'].includes(data.toLowerCase()))
                    data = day()

                if (!hour && data.includes(':') && data.length <= 5) {
                    data = day()
                    hour = Args[0]
                }

                if (data.includes('/') && data.length === 10 && !hour)
                    hour = '12:00'

                if (!data || !hour)
                    return await interaction.reply({
                        content: '❌ | A data informada para o sorteio não é correta. Veja alguma formas de dizer a data:\n> Formato 1: \`h, m, s\` - Exemplo: 1h 10m 40s *(1 hora, 10 minutos, 40 segundos)* ou \`1m 10s\`, \`2h 10m\`\n> Formato 2: \`30/01/2022 14:35:25\` - *(Os segundos são opcionais)*\n> Formato 3: \`hoje 14:35 | amanhã 14:35\`\n> Formato 4: \`14:35\` ou \`30/01/2022\`',
                        ephemeral: true
                    })

                let dataArray = data.split('/'),
                    hourArray = hour.split(':'),
                    dia = parseInt(dataArray[0]),
                    mes = parseInt(dataArray[1]) - 1,
                    ano = parseInt(dataArray[2]),
                    hora = parseInt(hourArray[0]),
                    minutos = parseInt(hourArray[1]),
                    segundos = parseInt(hourArray[2]) || 0

                let date = moment.tz({ day: dia, month: mes, year: ano, hour: hora, minutes: minutos, seconds: segundos }, "America/Sao_Paulo")

                if (!date.isValid())
                    return await interaction.reply({
                        content: '❌ | O tempo informado não é válido. Verifique se você escreveu o tempo de forma correta.',
                        ephemeral: true
                    })

                date = date.valueOf()

                if (date < Date.now()) return await interaction.reply({
                    content: '❌ | O tempo do lembrete deve ser maior que o tempo de "agora", não acha?',
                    ephemeral: true
                })

                TimeMs += date - Date.now()

            } else {

                for (let arg of Args) {

                    if (arg.slice(-1).includes('d')) {
                        let time = arg.replace(/d/g, '000') * 60 * 60 * 24
                        if (isNaN(time)) return cancelReminder()
                        TimeMs += parseInt(time)
                        continue
                    }

                    if (arg.slice(-1).includes('h')) {
                        let time = arg.replace(/h/g, '000') * 60 * 60
                        if (isNaN(time)) return cancelReminder()
                        TimeMs += parseInt(time)
                        continue
                    }

                    if (arg.slice(-1).includes('m')) {
                        let time = arg.replace(/m/g, '000') * 60
                        if (isNaN(time)) return cancelReminder()
                        TimeMs += parseInt(time)
                        continue
                    }

                    if (arg.slice(-1).includes('s')) {
                        let time = arg.replace(/s/g, '000')
                        if (isNaN(time)) return cancelReminder()
                        TimeMs += parseInt(time)
                        continue
                    }

                    return cancelReminder()
                    async function cancelReminder() {
                        return await interaction.reply({
                            content: '❌ | Data inválida! Verifique se a data esta realmente correta: \`dd/mm/aaaa hh:mm\` *(dia, mês, ano, horas, minutos)*\nℹ | Exemplo: \`30/01/2022 14:35:25\` *(Os segundos são opcionais)*\nℹ | \`hoje 14:35\`\nℹ | \`Amanhã 14:35\`',
                            ephemeral: true
                        })
                    }
                }
            }

            if (TimeMs > 2592000000)
                return await interaction.reply({
                    content: '❌ | O tempo limite é de 30 dias.',
                    ephemeral: true
                })

            const msg = await Channel.send({ embeds: [{ color: client.blue, title: `${e.Loading} | Construindo sorteio...` }] }).catch(() => { })
            if (!msg?.id)
                return await interaction.reply({
                    content: '❌ | Falha ao obter o ID da mensagem do sorteio. Verifique se eu realmente tenho permissão para enviar mensagem no canal de sorteios.',
                    ephemeral: true
                })

            await interaction.deferReply()
            let Message = await intChannel.send({ content: `${e.Loading} | Tudo certo! Última parte agora. Escolha um emoji **\`do Discord ou deste servidor\`** que você quer para o sorteio e **\`reaja nesta mensagem\`**. Caso queira o padrão, basta reagir em 🎉` })
            Message.react('🎉').catch(() => { })
            let collected = false

            let collector = Message.createReactionCollector({
                filter: (r, u) => u.id === user.id,
                idle: 20000
            })
                .on('collect', (reaction) => {

                    let emoji = reaction.emoji

                    if (emoji.id && !guild.emojis.cache.get(emoji.id))
                        return Message.edit(`${Message.content}\n \n❌ | Este emoji não pertence a este servidor. Por favor, escolha um emoji deste servidor ou do Discord.`)

                    let emojiData = emoji.id || emoji.name

                    msg.react(emoji).catch(err => {
                        Database.deleteGiveaway(msg.id)
                        collected = true
                        collector.stop()
                        return intChannel.send(`${e.Warn} | Erro ao reagir no sorteio. | \`${err}\``)
                    })

                    collected = true
                    collector.stop()
                    return registerGiveaway(msg, emoji, emojiData, Message)
                })
                .on('end', () => {
                    if (collected) return

                    msg.react('🎉').catch(err => {
                        Database.deleteGiveaway(msg.id)
                        return intChannel.send(`${e.Warn} | Erro ao reagir no sorteio. | \`${err}\``)
                    })

                    return registerGiveaway(msg, '🎉', '🎉', Message)
                })

            return
            async function registerGiveaway(msg, emoji = '🎉', emojiData = '🎉', Message) {

                new Database.Giveaway({ // new Class Model
                    MessageID: msg.id, // Id da Mensagem
                    GuildId: guild.id, // Id do Servidor
                    Prize: Prize, // Prêmio do sorteio
                    Winners: WinnersAmount, // Quantos vencedores
                    Emoji: emojiData, // Quantos vencedores
                    TimeMs: TimeMs, // Tempo do Sorteio
                    DateNow: Date.now(), // Agora
                    ChannelId: Channel.id, // Id do Canal
                    Actived: true, // Ativado
                    MessageLink: msg.url, // Link da mensagem
                    Sponsor: user.id, // Quem fez o sorteio
                    TimeEnding: Data(TimeMs) // Hora que termina o sorteio
                }).save()

                const embed = {
                    color: 0x0099ff,
                    title: `${e.Tada} Sorteios ${guild.name}`,
                    description: `Para entrar no sorteio, basta reagir no emoji ${emoji}`,
                    fields: [
                        {
                            name: `${e.Star} Prêmio`,
                            value: `> ${Prize}`
                        },
                        {
                            name: `${e.ModShield} Patrocinado por`,
                            value: `> ${user}`,
                            inline: true
                        },
                        {
                            name: `${e.CoroaDourada} Vencedores`,
                            value: `> ${parseInt(WinnersAmount)}`,
                            inline: true
                        }
                    ],
                    image: {
                        url: imageURL || null,
                    },
                    timestamp: new Date(Date.now() + TimeMs),
                    footer: {
                        text: `Giveaway ID: ${msg?.id} | Resultado`
                    }
                }

                if (Requisitos)
                    embed.fields.push({
                        name: `${e.Commands} Requisitos`,
                        value: `${Requisitos}`
                    })

                let isError = false

                msg.edit({ embeds: [embed] })
                    .catch(async err => {
                        isError = true
                        Database.deleteGiveaway(msg.id)
                        msg.delete().catch(() => { })

                        if (err.code === 50035)
                            return await interaction.followUp({
                                content: `⚠️ | Erro ao criar o sorteio.\nℹ | O link de imagem fornecido não é compátivel com as embeds do Discord.`,
                                ephemeral: true
                            })

                        return await interaction.followUp({
                            content: `⚠️ | Erro ao criar o sorteio. | \`${err}\``,
                            ephemeral: true
                        })
                    })

                if (isError) return
                Message.delete().catch(() => { })
                return await interaction.editReply({
                    content: `${e.Check} | Sorteio criado com sucesso! Você pode vê-lo no canal ${msg.channel}`,
                    ephemeral: true
                }).catch(() => { })
            }

        }

        async function methodsGiveaway() {

            switch (method) {
                case 'delete': deleteGiveaway(); break;
                case 'reset': resetGiveaway(); break;
                case 'finish': finishGiveaway(); break;
                case 'info': infoGiveaway(); break;
            }
            return

            async function deleteGiveaway() {

                let sorteio = await Database.Giveaway.findOne({ MessageID: giveawayId })

                if (!sorteio)
                    return await interaction.reply({
                        content: `${e.Deny} | Sorteio não encontrado. Verifique se o ID está correto.`,
                        ephemeral: true
                    })

                let Emojis = ['✅', '❌'],
                    msg = await await interaction.reply({
                        content: `${e.QuestionMark} | Deseja deletar o sorteio \`${giveawayId}\`?`,
                        fetchReply: true
                    })

                for (const emoji of Emojis) msg.react(emoji).catch(() => { })

                const collector = msg.createReactionCollector({
                    filter: (r, u) => Emojis.includes(r.emoji.name) && u.id === user.id,
                    time: 30000,
                    max: 1
                })
                    .on('collect', async (reaction) => {

                        if (reaction.emoji.name === Emojis[1]) // X
                            return collector.stop()

                        Database.deleteGiveaway(giveawayId)
                        msg.reactions.removeAll().catch(() => { })
                        return msg.edit(`${e.Check} | Sorteio deletado com sucesso!`).catch(() => { })

                    })

                    .on('end', collected => {
                        if (collected.size > 0) return
                        return msg.edit({ content: `${e.Deny} | Comando cancelado.` }).catch(() => { })
                    })

            }

            async function resetGiveaway() {

                let sorteio = await Database.Giveaway.findOne({ MessageID: giveawayId })

                if (!sorteio)
                    return await interaction.reply({
                        content: `${e.Deny} | Sorteio não encontrado. Verifique se o ID está correto.`,
                        ephemeral: true
                    })


                let Emojis = ['✅', '❌'],
                    msg = await await interaction.reply({
                        content: `${e.QuestionMark} | Deseja resetar o tempo do sorteio \`${giveawayId}\`?`,
                        fetchReply: true
                    })

                for (const emoji of Emojis)
                    msg.react(emoji).catch(() => { })

                const collector = msg.createReactionCollector({
                    filter: (r, u) => Emojis.includes(r.emoji.name) && u.id === user.id,
                    time: 30000
                })

                    .on('collect', async (reaction) => {

                        if (reaction.emoji.name === Emojis[1]) // X
                            return collector.stop()

                        const Time = sorteio.TimeMs

                        await Database.Giveaway.updateOne(
                            { MessageID: giveawayId },
                            {
                                DateNow: Date.now(),
                                TimeEnding: Data(Time),
                                Actived: true
                            }
                        )

                        msg.reactions.removeAll().catch(() => { })

                        let channel = await guild.channels.cache.get(sorteio.ChannelId)
                        let message = await channel.messages.fetch(giveawayId)
                        let embed = message.embeds[0]

                        if (!embed) return await interaction.reply({
                            content: `${e.Deny} | Embed do sorteio não encontrada.`,
                            ephemeral: true
                        })

                        embed.color = 0x0099ff
                        embed.title = `${e.Tada} Sorteios ${guild.name}`
                        embed.description = `Para entrar no sorteio, basta reagir no emoji ${sorteio.Emoji}`
                        embed.timestamp = new Date(Date.now() + TimeMs)
                        embed.footer = { text: `Giveaway ID: ${sorteio?.MessageID} | Resultado` }
                        message.edit({ embeds: [embed] }).catch(() => { })

                        return msg.edit(`${e.Check} | Sorteio resetado com sucesso. *Não é necessário os membros entrarem novamente*`).catch(() => { })

                    })

                    .on('end', collected => {
                        if (collected.size > 0) return
                        return msg.edit(`${e.Deny} | Comando cancelado.`)
                    })

            }

            async function finishGiveaway() {

                let sorteio = await Database.Giveaway.findOne({ MessageID: giveawayId }, 'Actived')

                if (!sorteio)
                    return await interaction.reply({
                        content: `${e.Deny} | Sorteio não encontrado. Verifique se o ID está correto.`,
                        ephemeral: true
                    })

                if (!sorteio?.Actived)
                    return await interaction.reply({
                        content: `${e.Deny} | Este sorteio já foi está finalizado.`,
                        ephemeral: true
                    })

                await Database.Giveaway.updateOne(
                    { MessageID: giveawayId },
                    { DateNow: 0 }
                )

                return await interaction.reply({
                    content: `${e.Check} | Sorteio \`${giveawayId}\` finalizado com sucesso!`,
                    ephemeral: true
                })

            }

            async function infoGiveaway() {

                let sorteio = await Database.Giveaway.findOne({ MessageID: giveawayId })

                if (!sorteio)
                    return await interaction.reply({
                        content: `${e.Deny} | Sorteio não encontrado. Verifique se o ID está correto.`,
                        ephemeral: true
                    })

                let WinnersAmount = sorteio?.Winners,
                    Participantes = sorteio?.Participants || [],
                    Sponsor = sorteio?.Sponsor,
                    Prize = sorteio?.Prize,
                    MessageLink = sorteio?.MessageLink,
                    Actived = sorteio?.Actived,
                    Emoji = formatEmoji(sorteio?.Emoji || null),
                    Vencedores = sorteio?.WinnersGiveaway || [],
                    VencedoresMapped = Vencedores?.map(winner => {

                        let member = guild.members.cache.get(winner)

                        return member
                            ? `> ${member.user.tag.replace(/`/g, '')} - \`${member.id}\``
                            : '> Membro não encontrado'

                    }).join('\n') || '> Ninguém',
                    description = `> :id: \`${giveawayId}\`\n> 👐 Patrocinador*(a)*: ${guild.members.cache.get(Sponsor)?.user.tag || 'Não encontrado'}\n> ${e.Star} Prêmio: ${Prize}\n> 👥 Participantes: ${Participantes?.length || 0}\n> ${e.CoroaDourada} Vencedores: ${WinnersAmount}\n> ${e.Info} Emoji: ${Emoji}\n> ⏱️ Término: \`${sorteio?.TimeEnding || 'Indefinido'}\`\n> ${Actived ? `${e.Check} Ativado` : `${e.Deny} Desativado`}\n> 🔗 [Sorteio Link](${MessageLink})`,
                    Emojis = ['⬅️', '➡️', '❌'],
                    Control = 0,
                    Embeds = EmbedGenerator() || [{
                        color: client.blue,
                        title: `${e.Tada} Informações do sorteio`,
                        description: `${description}`,
                        fields: [
                            {
                                name: '👥 Participantes',
                                value: '> Contagem válida após sorteio'
                            },
                            {
                                name: `${e.OwnerCrow} Vencedores do Sorteios`,
                                value: '> Contagem válida após sorteio'
                            }
                        ],
                        footer: {
                            text: `${Participantes.length} participantes contabilizados`
                        },
                    }],
                    msg = await await interaction.reply({ embeds: [Embeds[0]] })

                if (Embeds.length === 1)
                    return

                for (const emoji of Emojis)
                    msg.react(emoji).catch(() => { })

                const collector = msg.createReactionCollector({
                    filter: (r, u) => Emojis.includes(r.emoji.name) && u.id === user.id,
                    idle: 30000
                })

                    .on('collect', (reaction) => {

                        if (reaction.emoji.name === Emojis[2])
                            return collector.stop()

                        return reaction.emoji.name === Emojis[0]
                            ? (() => {

                                Control--
                                return Embeds[Control] ? msg.edit({ embeds: [Embeds[Control]] }).catch(() => { }) : Control++

                            })()
                            : (() => {

                                Control++
                                return Embeds[Control] ? msg.edit({ embeds: [Embeds[Control]] }).catch(() => { }) : Control--

                            })()

                    })

                    .on('end', collected => {
                        if (collected.size > 0) return
                        return msg.edit({ content: `${e.Deny} | Comando desativado` }).catch(() => { })

                    })

                function EmbedGenerator() {

                    let amount = 10,
                        Page = 1,
                        embeds = [],
                        length = Participantes.length / 10 <= 1 ? 1 : parseInt((Participantes.length / 10) + 1)

                    for (let i = 0; i < Participantes.length; i += 10) {

                        let current = Participantes.slice(i, amount),
                            GiveawayMembersMapped = current.map(Participante => {

                                let Member = guild.members.cache.get(Participante)

                                return Member ? `> ${Member.user.tag.replace(/`/g, '')} - \`${Member.id}\`` : (async () => {

                                    await Database.Giveaway.updateOne(
                                        { MessageID: giveawayId },
                                        { $pull: { Participants: Participante } }
                                    )

                                    return `> ${e.Deny} Usuário deletado`
                                })()

                            }).join("\n")

                        if (current.length > 0) {

                            embeds.push({
                                color: client.blue,
                                title: `${e.Tada} Informações do sorteio`,
                                description: `${description}`,
                                fields: [
                                    {
                                        name: `👥 Participantes ${length > 0 ? `- ${Page}/${length}` : ''}`,
                                        value: `${GiveawayMembersMapped || '> Nenhum membro entrou neste sorteio'}`
                                    },
                                    {
                                        name: `${e.OwnerCrow} Vencedores do Sorteios${Vencedores.length > 0 ? `: ${Vencedores.length}/${WinnersAmount}` : ''}`,
                                        value: `${VencedoresMapped}`
                                    }
                                ],
                                footer: {
                                    text: `${Participantes.length} participantes contabilizados`
                                },
                            })

                            Page++
                            amount += 10

                        }

                    }

                    return embeds.length === 0 ? null : embeds
                }


            }

            function formatEmoji(data) {

                if (!data) return '🎉'
                let isId = parseInt(data)
                return isId
                    ? guild.emojis.cache.get(data) || '🎉'
                    : data
            }

        }

        async function rerollGiveaway() {

            let sorteio = await Database.Giveaway.findOne({ MessageID: giveawayId })

            if (!sorteio)
                return await interaction.reply({
                    content: `${e.Deny} | Sorteio não encontrado. Verifique se o ID fornecido está correto.`,
                    ephemeral: true
                })

            if (sorteio?.Actived)
                return await interaction.reply({
                    content: `${e.Deny} | Este sorteio ainda está ativado e não é possível o reroll antes do término. Caso você queira finalizar este sorteio antes da hora, use o comando \`/giveaway options[finish] ${giveawayId}\``,
                    ephemeral: true
                })

            return NewReroll(sorteio, giveawayId, WinnersAmount)
        }

        async function NewReroll(sorteio, MessageId, WinnersAmount) {

            let Participantes = sorteio?.Participants || [],
                Channel = guild.channels.cache.get(sorteio?.ChannelId),
                Sponsor = sorteio?.Sponsor,
                Prize = sorteio?.Prize || 'Indefinido',
                MessageLink = sorteio?.MessageLink

            if (!Channel)
                return await interaction.reply({
                    content: `${e.Deny} | Canal não encontrado.`,
                    ephemeral: true
                })

            if (!Participantes || Participantes.length === 0) {
                Database.deleteGiveaway(MessageId)
                return await interaction.reply({
                    content: `${e.Deny} | Reroll cancelado por falta de participantes.\n🔗 | Sorteio link: ${sorteio?.MessageLink}`,
                    ephemeral: true
                })
            }

            let vencedores = GetWinners(Participantes, WinnersAmount)

            if (vencedores.length === 0) {
                Database.deleteGiveaway(MessageId)
                return await interaction.reply({
                    content: `${e.Deny} | Reroll cancelado por falta de participantes.\n🔗 | Sorteio link: ${sorteio?.MessageLink}`,
                    ephemeral: true
                })
            }

            let vencedoresMapped = vencedores.map(memberId => `${GetMember(memberId)}`).join('\n')

            Channel.send({
                embeds: [
                    {
                        color: client.green,
                        title: `${e.Tada} Sorteio Finalizado [Reroll]`,
                        url: MessageLink,
                        fields: [
                            {
                                name: `${e.CoroaDourada} Vencedores`,
                                value: `${vencedoresMapped || 'Ninguém'}`,
                                inline: true
                            },
                            {
                                name: `${e.ModShield} Patrocinador`,
                                value: `${guild.members.cache.get(Sponsor) || `${e.Deny} Patrocinador não encontrado`}`,
                                inline: true
                            },
                            {
                                name: `${e.Star} Prêmio`,
                                value: `${Prize}`,
                                inline: true
                            },
                            {
                                name: `🔗 Giveaway Reference`,
                                value: `[Link do Sorteio](${MessageLink})`
                            }
                        ]
                    }
                ]

            }).catch(() => Database.deleteGiveaway(MessageId))

            await Database.Giveaway.updateOne(
                { MessageID: MessageId },
                { TimeToDelete: Date.now() }
            )

            return await interaction.reply({
                content: `${e.Check} | Rerrol realizado com sucesso!`,
                ephemeral: true
            })
            function GetWinners(WinnersArray, Amount) {

                let Winners = []

                if (WinnersArray.length === 0)
                    return []

                WinnersArray.length >= Amount
                    ? (() => {

                        for (let i = 0; i < Amount; i++)
                            Winners.push(GetUserWinner())

                    })()
                    : (() => Winners.push(...WinnersArray))()

                function GetUserWinner() {

                    const Winner = WinnersArray[Math.floor(Math.random() * WinnersArray.length)]
                    return Winners.includes(Winner) ? GetUserWinner() : Winner

                }

                return Winners
            }

            function GetMember(memberId) {
                const member = guild.members.cache.get(memberId)

                return member
                    ? `${member} *\`${member?.id || '0'}\`*`
                    : (async () => {

                        await Database.Giveaway.updateOne(
                            { MessageID: MessageId },
                            { $pull: { Participants: memberId } }
                        )

                        return `${e.Deny} Usuário não encontrado.`
                    })()
            }
        }

        async function listGiveaway() {

            let Sorteios = await Database.Giveaway.find({ GuildId: guild.id })

            if (!Sorteios || Sorteios.length === 0)
                return await interaction.reply({
                    content: `${e.Deny} | Este servidor não tem nenhum sorteio na lista.`,
                    ephemeral: true
                })

            let Embeds = EmbedGenerator(),
                Control = 0,
                Emojis = ['◀️', '▶️', '❌'],
                msg = await interaction.reply({ embeds: [Embeds[0]], fetchReply: true }),
                react = false

            if (Embeds.length > 1)
                for (const emoji of Emojis)
                    msg.react(emoji).catch(() => { })

            const collector = msg.createReactionCollector({
                filter: (r, u) => Emojis.includes(r.emoji.name) && u.id === user.id,
                idle: 30000
            })
                .on('collect', (reaction) => {

                    if (reaction.emoji.name === Emojis[2]) // X
                        return collector.stop()
                    react = true
                    return reaction.emoji.name === Emojis[0] // Left
                        ? (() => {
                            Control--
                            return Embeds[Control] ? msg.edit({ embeds: [Embeds[Control]] }).catch(() => { }) : Control++
                        })()
                        : (() => { // Right
                            Control++
                            return Embeds[Control] ? msg.edit({ embeds: [Embeds[Control]] }).catch(() => { }) : Control--
                        })()
                })
                .on('end', () => {
                    if (react) return
                    let embed = msg.embeds[0]
                    if (!embed) return msg.edit({ content: `${e.Deny} | Comando cancelado.` }).catch(() => { })

                    embed.color = client.red
                    return msg.edit({ content: `${e.Deny} | Comando cancelado.`, embeds: [embed] }).catch(() => { })
                })

            function EmbedGenerator() {

                let amount = 5,
                    Page = 1,
                    embeds = [],
                    length = Sorteios.length / 5 <= 1 ? 1 : parseInt((Sorteios.length / 5) + 1)

                for (let i = 0; i < Sorteios.length; i += 5) {

                    let current = Sorteios.slice(i, amount),
                        description = current.map(Gw => `> 🆔 \`${Gw.MessageID}\`\n> ⏱️ Término: \`${Gw.TimeEnding}\`\n> ${Gw?.Actived ? `${e.Check} Ativado` : `${e.Deny} Desativado`}\n> ${e.Info} \`/giveaway options method:info id:${Gw.MessageID}\`\n--------------------`).join("\n") || false

                    if (current.length > 0) {

                        embeds.push({
                            color: client.blue,
                            title: `${e.Tada} Sorteios ${guild.name} ${length > 1 ? `- ${Page}/${length}` : ''}`,
                            description: `${description || 'Nenhum sorteio encontrado'}`,
                            footer: {
                                text: `${Sorteios.length} sorteios contabilizados`
                            },
                        })

                        Page++
                        amount += 5
                    }
                }
                return embeds;
            }
            return

        }

    }
}
