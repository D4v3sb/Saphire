const client = require('../../index'),
    ModalInteraction = require('../../modules/classes/ModalInteraction'),
    ButtonInteraction = require('../../modules/classes/ButtonInteraction'),
    SelectMenuInteraction = require('../../modules/classes/SelectMenuInteraction'),
    SlashCommand = require('../../modules/classes/SlashCommand'),
    Autocomplete = require('../../modules/classes/Autocomplete'),
    Database = require('../../modules/classes/Database')

client.on('interactionCreate', async interaction => {

    Database.registerUser(interaction.user.id)
    if (interaction.isModalSubmit()) return new ModalInteraction(interaction, client).submitModalFunctions()
    if (interaction.isButton()) return new ButtonInteraction(interaction, client).execute()
    if (interaction.isSelectMenu()) return new SelectMenuInteraction(interaction).filterAndChooseFunction()
    if (interaction.isCommand() || interaction.isContextMenu()) return new SlashCommand(interaction).CheckBeforeExecute()
    if (interaction.isAutocomplete()) return new Autocomplete(interaction, client).build()
    return
})