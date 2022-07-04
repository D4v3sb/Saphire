const client = require('../../../../index')
const { e } = require('../../../../JSON/emojis.json')
const executeNewGame = require('./game')

async function startGameWithButtons(interaction) {

    let embed = {}
    embed.color = client.blue
    embed.title = `🎌 ${client.user.username} Flag Game Options Mode`
    embed.description = `${e.Loading} | Carregando bandeiras e opções... Prepare-se!`

    let Msg = await interaction.reply({ embeds: [embed], fetchReply: true })

    setTimeout(() => executeNewGame(Msg, interaction, embed), 3000)
}

module.exports = startGameWithButtons