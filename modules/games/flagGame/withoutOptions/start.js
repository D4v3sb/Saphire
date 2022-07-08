const client = require('../../../../index')
const { e } = require('../../../../JSON/emojis.json')
const start = require('./game')

async function startGameWithoutButtons(interaction) {

    let embed = {}
    embed.color = client.blue
    embed.title = `🎌 ${client.user.username} Flag Game`
    embed.description = `${e.Loading} | Carregando bandeiras e coletores de mensagens... Prepare-se!`

    let Msg = await interaction.reply({ embeds: [embed], fetchReply: true })

    return setTimeout(() => start(Msg, interaction, embed), 4000)
}

module.exports = startGameWithoutButtons