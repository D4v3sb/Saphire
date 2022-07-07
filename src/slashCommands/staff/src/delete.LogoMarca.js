const Database = require('../../../../modules/classes/Database')
const { formatString } = require('../../../../src/commands/games/plugins/gamePlugins')
const { e } = require('../../../../JSON/emojis.json')
const client = require('../../../../index')

async function deleteLogoMarca(interaction) {

    const { options, user } = interaction
    const logoData = Database.Logomarca.get('LogoMarca') || []
    const logoChoice = options.getString('select_logo_marca')
    const logoIndex = logoData.findIndex(data => data.name[0].toLowerCase() === logoChoice.toLowerCase())
    const logo = logoData[logoIndex]

    if (!logo)
        return await interaction.reply({
            content: `${e.Deny} | Nenhuma logo/marca foi encontrada`,
            ephemeral: true
        })

    const buttons = {
        type: 1,
        components: [
            {
                type: 2,
                label: 'EXCLUIR LOGO/MARCA',
                custom_id: 'delete',
                style: 'SUCCESS'
            },
            {
                type: 2,
                label: 'CANCELAR EXCLUSÃO',
                custom_id: 'cancel',
                style: 'DANGER'
            }
        ]
    }

    const embeds = [{
        color: client.blue,
        title: `${e.Database} Remove Logo/Marca`,
        description: `Nomes: ${logo.name.map(x => `\`${formatString(x)}\``).join(', ')}`,
        image: { url: logo.images.uncensored || null }
    }]

    if (logo.images.censored)
        embeds.push({
            color: client.blue,
            title: 'Imagem censurada',
            image: { url: logo.images.censored || null }
        })

    const msg = await interaction.reply({
        embeds: embeds,
        components: [buttons],
        ephemeral: true,
        fetchReply: true
    })

    return msg.createMessageComponentCollector({
        filter: int => int.user.id === user.id,
        time: 1000,
        max: 1,
        errors: ['max']
    })
        .on('collect', async int => {

            const { customId } = int

            if (customId === 'cancel') return

            logoData.splice(logoIndex, 1)
            Database.Logomarca.set('LogoMarca', logoData)
            return await interaction.editReply({
                content: `${e.Check} | A marca ${formatString(logo.name[0])} foi removida com sucesso.`,
                embeds: [],
                components: []
            })

        })
        .on('end', async (i, r) => {
            if (r !== 'time') return
            return await interaction.editReply({
                content: `${e.Deny} | Comando cancelado.`,
                embeds: [],
                components: []
            })
        })

}

module.exports = deleteLogoMarca