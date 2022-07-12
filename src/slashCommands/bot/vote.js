module.exports = {
    name: 'vote',
    description: '[bot] Resgate sua recompensa de voto',
    dm_permission: false,
    type: 1,
    options: [
        {
            name: 'list',
            description: '[bot] Lista de pessoas que votaram no Top.GG',
            type: 1
        },
        {
            name: 'resgate',
            description: '[bot] Resgate sua recompensa de voto',
            type: 1
        }
    ],
    async execute({ interaction: interaction, emojis: e, client: client, database: Database }) {

        const { Config } = Database
        const subCommand = interaction.options.getSubcommand()

        if (subCommand === 'list') return voteList()

        const buttons = {
            type: 1,
            components: [
                {
                    type: 2,
                    label: 'RESGATAR',
                    emoji: e.topgg,
                    custom_id: 'getVotePrize',
                    style: 'SUCCESS'
                },
                {
                    type: 2,
                    label: 'VOTAR',
                    emoji: e.Upvote,
                    url: Config.TopGGLink,
                    style: 'LINK'
                }
            ]
        }

        return await interaction.reply({
            embeds: [{
                color: client.blue,
                title: `${e.topgg} | Top.gg Bot List`,
                description: `Me dê um voto e ganhe recompensas.`
            }],
            components: [buttons]
        })

        async function voteList() {

            const { Api } = require('@top-gg/sdk')
            const TopGG = new Api(process.env.TOP_GG_TOKEN)
            const allVotesData = await TopGG.getVotes() || []

            const mappingOnlyIds = [...new Set(allVotesData.map(vote => vote.id))]
            const uniqueArray = mappingOnlyIds
                .map(id => ({ name: client.users.cache.get(id)?.tag || null, id: id }))
                .filter(x => x.name)
                .sort((a, b) => a.name.localeCompare(b.name, 'br', { ignorePunctuation: true }))

            if (uniqueArray.length === 0)
                return await interaction.reply({
                    content: `${e.Deny} | Não há nenhum voto contabilizado.`,
                    ephemeral: true
                })

            const embeds = EmbedGenerator(uniqueArray)

            const buttons = [
                {
                    type: 1,
                    components: [
                        {
                            type: 2,
                            emoji: '⬅️',
                            custom_id: 'left',
                            style: 'PRIMARY'
                        },
                        {
                            type: 2,
                            emoji: '➡️',
                            custom_id: 'right',
                            style: 'PRIMARY'
                        }
                    ]
                }
            ]

            const msg = await interaction.reply({
                embeds: [embeds[0]],
                components: embeds.length > 1 ? buttons : null,
                fetchReply: embeds.length > 1
            })

            let embedIndex = 0
            if (embeds.length <= 1) return

            return msg.createMessageComponentCollector({
                filter: int => int.user.id === interaction.user.id,
                idle: 30000
            })
                .on('collect', async int => {

                    const { customId } = int
                    int.deferUpdate().catch(() => { })

                    if (customId === 'right') {
                        embedIndex++
                        if (!embeds[embedIndex]) embedIndex = 0
                    }

                    if (customId === 'left') {
                        embedIndex--
                        if (!embeds[embedIndex]) embedIndex = embeds.length - 1
                    }

                    return await interaction.editReply({ embeds: [embeds[embedIndex]] })
                })
                .on('end', async () => {
                    const embed = msg.embeds[0]
                    if (!embed) return await interaction.editReply({ components: [] })

                    embed.color = client.red
                    return await interaction.editReply({ components: [], embeds: [embed] })
                })

            function EmbedGenerator(array) {

                let amount = 10
                let page = 1
                let embeds = []
                let length = array.length / 10 <= 1 ? 1 : parseInt((array.length / 10) + 1)

                for (let i = 0; i < array.length; i += 10) {

                    let current = array.slice(i, amount)
                    allVotesData
                    let description = current
                        .map(data => {
                            const counter = allVotesData.filter(votes => data.id === votes.id)?.length || 0
                            return `> (${counter}) ${data.name} - \`${data.id}\``
                        })
                        .filter(x => x).join('\n')

                    let pageCount = length > 1 ? ` ${page}/${length}` : ''

                    embeds.push({
                        color: client.blue,
                        title: `${e.topgg} ${client.user.username} Votos Recebidos${pageCount}`,
                        url: Config.TopGGLink,
                        description: description,
                        timestamp: new Date(),
                        footer: { text: `${array.length} Membros contabilizados | ${allVotesData.length} Votos contabilizados` }
                    })

                    page++
                    amount += 10

                }

                return embeds
            }
        }
    }
}