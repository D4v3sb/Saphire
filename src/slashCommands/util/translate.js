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
    async execute({ interaction: interaction, client: client, emojis: e }) {

        const { options } = interaction

        let langData = Object.entries(util.Languages).map(([a, b]) => ({ lang: a, name: b }))
        let toSearch = langData.find(data => [data.lang, data.name].includes(options.getString('para')))
        let fromSearch = langData.find(data => [data.lang, data.name].includes(options.getString('de')))
        let text = options.getString('texto')
        let to = toSearch?.lang
        let from = fromSearch?.lang

        if (!to || !from)
            return await interaction.reply({
                content: `${e.Deny} | Por favor, selecione uma lingua válida para que eu possa efetuar a tradução`,
                ephemeral: true
            })

        if (fromSearch.name === toSearch.name)
            return await interaction.reply({
                content: `${e.Deny} | As linguas devem ser diferentes uma da outra`,
                ephemeral: true
            })

        if (text.length < 2 || text.length > 1000)
            return await interaction.reply({
                content: `${e.Deny} | O texto deve conter entre 2 e 1000 caracteres.`,
                ephemeral: true
            })

        await interaction.deferReply({})

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