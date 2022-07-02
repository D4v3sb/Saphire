const translate = require('@iamtraction/google-translate')
const util = require('../../structures/util')

module.exports = {
    name: 'translate',
    description: '[util] Traduza textos através deste comando',
    dm_permission: false,
    type: 1,
    options: [
        {
            name: 'de',
            description: 'De qual lingua é o texto?',
            type: 3,
            required: true,
            autocomplete: true
        },
        {
            name: 'para',
            description: 'Para qual lingua devo traduzir?',
            type: 3,
            required: true,
            autocomplete: true
        },
        {
            name: 'texto',
            description: 'Texto a ser traduzido',
            type: 3,
            required: true
        }
    ],
    async execute({ interaction: interaction, client: client }) {

        await interaction.deferReply({})

        const { options } = interaction

        let langData = Object.entries(util.Languages).map(([a, b]) => ({ lang: a, name: b }))
        let toSearch = langData.find(data => data.name === options.getString('para'))
        let fromSearch = langData.find(data => data.name === options.getString('de'))
        let text = options.getString('texto')
        let to = toSearch.lang
        let from = fromSearch.lang

        if (text.length < 2 || text.length > 1000)
            return await interaction.editReply({
                content: `${e.Deny} | O texto deve conter entre 2 e 1000 caracteres.`
            })

        const Embed = {
            color: '#4295fb',
            author: { name: 'Google Tradutor', iconURL: 'https://imgur.com/9kWn6Qp.png' },
            fields: [
                {
                    name: 'Texto',
                    value: `\`\`\`txt\n${text}\n\`\`\``
                }
            ],
            footer: { text: `Traduzido de ${fromSearch.name} para ${toSearch.name}` }
        }

        translate(text, { to: to, from: from })
            .then(async res => {
                Embed.fields[1] = {
                    name: 'Tradução',
                    value: `\`\`\`txt\n${res.text}\n\`\`\``
                }

                return await interaction.editReply({ embeds: [Embed] })

            }).catch(async err => {

                Embed.color = client.red
                Embed.fields[1] = {
                    name: 'Erro',
                    value: `\`\`\`txt\n${err}\n\`\`\``
                }

                return await interaction.editReply({ embeds: [Embed] })
            })

    }
}