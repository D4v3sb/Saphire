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

        const Embed = {
            color: '#4295fb',
            author: { name: 'Google Tradutor', iconURL: 'https://imgur.com/9kWn6Qp.png' }
        }

        let langData = Object.entries(util.Languages)
        let toSearch = langData.filter(([a, b]) => b === options.getString('para'))
        let fromSearch = langData.filter(([a, b]) => b === options.getString('de'))
        let text = options.getString('texto')
        let to = toSearch[0][0]
        let from = fromSearch[0][0]

        if (text.length < 2 || text.length > 1000)
            return await interaction.editReply({
                content: `${e.Deny} | O texto deve conter entre 2 e 1000 caracteres.`
            })

        translate(text, { to: to, from: from })
            .then(async res => {
                Embed.fields = [
                    {
                        name: 'Texto',
                        value: `\`\`\`txt\n${text}\n\`\`\``
                    },
                    {
                        name: 'Tradução',
                        value: `\`\`\`txt\n${res.text}\n\`\`\``
                    }
                ]

                return await interaction.editReply({ embeds: [Embed] })

            }).catch(async err => {

                Embed.color = client.red
                Embed.fields = [
                    {
                        name: 'Texto',
                        value: `\`\`\`txt\n${text}\n\`\`\``
                    },
                    {
                        name: 'Erro',
                        value: `\`\`\`txt\n${err}\n\`\`\``
                    }
                ]

                return await interaction.editReply({ embeds: [Embed] })
            })

    }
}