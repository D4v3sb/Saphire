const Database = require('../../../classes/Database')
const startGameWithButtons = require('../withOptionsMode/start')
const startGameWithoutButtons = require('../withoutOptions/start')
const { Emojis: e, Cache } = Database

async function init(mode, interaction) {

    const { channel } = interaction
    const channels = Cache.get('Flag') || []

    if (channels.includes(channel.id))
        return await interaction.reply({
            content: `${e.Deny} | Já tem um flag game rolando nesse canal. Espere ele terminar para poder iniciar outro, ok?`,
            ephemeral: true
        })

    Cache.push('Flag', channel.id)

    return mode === 'withOptions'
        ? startGameWithButtons(interaction)
        : startGameWithoutButtons(interaction)
}

module.exports = init