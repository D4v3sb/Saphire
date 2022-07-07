// const Database = require('../../../../modules/classes/Database')
// const client = require('../../../../index')
// const { formatString } = require('../../../commands/games/plugins/gamePlugins')
const { e } = require('../../../../JSON/emojis.json')

async function newLogoMarcaGame(interaction) {

    return await interaction.reply({
        content: `${e.Loading} | Game em construção.`,
        ephemeral: true
    })

}

module.exports = newLogoMarcaGame