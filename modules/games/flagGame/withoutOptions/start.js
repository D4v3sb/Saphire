const client = require('../../../../index')
const { e } = require('../../../../JSON/emojis.json')
const start = require('./game')

module.exports = async (interaction) => {

    const embed = {}
    embed.color = client.blue
    embed.title = `🎌 ${client.user.username} Flag Game`
    embed.description = `${e.Loading} | Carregando bandeiras e coletores de mensagens... Prepare-se!`

    const Msg = await interaction.reply({ embeds: [embed], fetchReply: true })

    return setTimeout(() => start(Msg, interaction, embed), 4000)
}