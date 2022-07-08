const Database = require('../../../../modules/classes/Database')
const LogoMarcaGame = require('../../../../modules/classes/games/logoMarca')
const { e } = require('../../../../JSON/emojis.json')

async function newLogoMarcaGame(interaction) {

    const { channel } = interaction
    const logoData = Database.Logomarca.get('LogoMarca') || []
    const inChannelGame = Database.Cache.get('logomarca')?.includes(channel.id)

    if (inChannelGame)
        return await interaction.reply({
            content: `${e.Deny} | Já tem um LogoMarca Game rolando neste chat. Por favor, espere ele acabar para iniciar um novo.`,
            ephemeral: true
        })

    return new LogoMarcaGame(interaction, logoData).registerNewGameAndStart()

}

module.exports = newLogoMarcaGame