const Database = require('../../../../modules/classes/Database')
const client = require('../../../../index')
const { e } = require('../../../../JSON/emojis.json')
const { formatString } = require('../../../../src/commands/games/plugins/gamePlugins')

async function logoMarcaList(interaction) {

    const { options, user } = interaction
    const letters = options.getString('filter') || null
    const logoData = Database.Logomarca.get('LogoMarca') || []
    const fill = logoData.sort(function (x, y) {
        let a = x.name[0].toUpperCase()
        let b = y.name[0].toUpperCase()
        return a == b ? 0 : a > b ? 1 : -1
    }).filter(logo => logo.name[0].startsWith(letters ?? logo.name[0]))

    if (fill.length === 0)
        return await interaction.reply({
            content: `${e.Deny} | Nenhuma logo/marca foi encontrada.`,
            ephemeral: true
        })

    const embeds = EmbedGenerator(fill)
    console.log(embeds.length)

    if (embeds.length <= 1)
        return await interaction.reply({ embeds: [embeds[0]] })

    let index = 0
    const buttons = [{
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
    }]

    const msg = await interaction.reply({
        embeds: [embeds[0]],
        fetchReply: true,
        components: buttons
    })

    return msg.createMessageComponentCollector({
        filter: int => int.user.id === user.id,
        idle: 30000,
        errors: ['idle']
    })
        .on('collect', async int => {

            const { customId } = int
            if (customId === 'left') {
                index--
                if (index < 0) index = embeds.length - 1
            }

            if (customId === 'right') {
                index++
                if (index > embeds.length - 1) index = 0
            }

            await int.deferUpdate().catch(() => { })
            return await interaction.editReply({ embeds: [embeds[index]] }).catch(() => { })

        })
        .on('end', async () => {

            let embed = msg.embeds[0]

            if (!embed)
                return await interaction.editReply({ embeds: [], components: [] })

            embed.color = client.red

            return await interaction.editReply({ embeds: [embed], components: [] })

        })

    function EmbedGenerator(array) {

        let amount = 7
        let page = 1
        const embeds = []
        const length = array.length / 7 <= 1 ? 1 : parseInt((array.length / 7))

        for (let i = 0; i < array.length; i += 7) {

            const current = array.slice(i, amount)
            const fields = []

            current.map((data, i) => fields.push({
                name: `${formatString(data.name[0])}`,
                value: data.name.slice(1).map(x => `> \`${formatString(x)}\``).join('\n') || '> `Nenhum Sinônimo`'
            }))

            const pageCount = length > 1 ? ` ${page}/${length}` : ''

            embeds.push({
                color: client.blue,
                title: `🖼 Logo List View${pageCount}`,
                fields: fields
            })

            page++
            amount += 7

        }

        return embeds
    }

}

module.exports = logoMarcaList