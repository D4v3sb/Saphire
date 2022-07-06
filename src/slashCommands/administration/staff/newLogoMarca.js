const Database = require('../../../../modules/classes/Database')
const client = require('../../../../index')
const { e } = require('../../../../JSON/emojis.json')

async function newLogoMarca(interaction) {

    const { options } = interaction
    const name = options.getString('marca')
    const imageURLNoCensor = options.getString('image_url_sem_censura')
    const imageURLWithCensor = options.getString('image_url_com_censura') || null
    const synonym = options.getString('sinonimo')
    const synonym2 = options.getString('outro_sinonimo')
    const logoData = Database.Logomarca.get('LogoMarca') || []

    if (imageURLNoCensor === imageURLWithCensor)
        return await interaction.reply({
            content: `${e.Deny} | Os links são iguais.`,
            ephemeral: true
        })

    if ([synonym?.toLowerCase(), synonym2?.toLowerCase()].includes(name?.toLowerCase()))
        return await interaction.reply({
            content: `${e.Deny} | O nome é igual a um dos sinônimos.`,
            ephemeral: true
        })

    for (let logo of logoData) {
        if (logo?.name?.find(logoName => [name.toLowerCase(), synonym?.toLowerCase(), synonym2?.toLowerCase()].includes(logoName?.toLowerCase())))
            return await interaction.reply({
                content: `${e.Deny} | Este nome ou sinônimo de logo/marca já existe no banco de dados.`,
                ephemeral: true
            })

        if (logo?.images.censored && [imageURLNoCensor, imageURLWithCensor].includes(logo?.images.censored) || logo?.images.uncensored && [imageURLNoCensor, imageURLWithCensor].includes(logo.images.uncensored))
            return await interaction.reply({
                content: `${e.Deny} | Esta imagem já foi registada.`,
                ephemeral: true
            })

        if (!imageURLNoCensor.isURL() || !imageURLNoCensor.includes('https://media.discordapp.net/attachments/'))
            return await interaction.reply({
                content: `${e.Deny} | Este não é um link válido.`,
                ephemeral: true
            })
    }

    const saveData = {
        name: [name.toLowerCase()],
        images: {
            censored: imageURLWithCensor,
            uncensored: imageURLNoCensor
        }
    }

    if (synonym) saveData.name.push(synonym?.toLowerCase())
    if (synonym2) saveData.name.push(synonym2?.toLowerCase())

    Database.Logomarca.push('LogoMarca', saveData)
    return await interaction.reply({
        embeds: [
            {
                color: client.green,
                title: `${e.Check} | Nova logo/marca registrada`,
                description: `A logo/marca **${name}** foi registrada com sucesso!`,
                image: { url: imageURLNoCensor },
                fields: [
                    {
                        name: 'Sinônimos',
                        value: [synonym, synonym2].filter(x => x).map(x => `\`${x}\``).join(', ') || 'Nenhum sinônimo foi dado'
                    },
                    {
                        name: 'Imagem Censurada',
                        value: imageURLWithCensor ? 'Sim' : 'Não'
                    }
                ]
            }
        ],
        ephemeral: true
    })
}

module.exports = newLogoMarca