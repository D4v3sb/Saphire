const translate = require('@iamtraction/google-translate')
const { Languages } = require('../../structures/util')

module.exports = {
    name: 'Translate Message',
    type: 3,
    async execute({ interaction: interaction, emojis: e, client: client }) {

        await interaction.deferReply({})
        const { targetMessage, locale } = interaction
        const text = targetMessage.content

        const Embed = {
            color: '#4295fb',
            author: { name: 'Google Tradutor', iconURL: 'https://imgur.com/9kWn6Qp.png' },
            fields: [
                {
                    name: 'Texto',
                    value: `\`\`\`txt\n${text}\n\`\`\``
                }
            ],
            footer: { text: `Traduzido para ${Languages[locale]}` }
        }

        if (!text)
            return await interaction.editReply({
                content: `${e.Deny} | Não há nenhum texto para traduzir.`,
                ephemeral: true
            })

        return translate(text, { to: locale.split('-')[0] })
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