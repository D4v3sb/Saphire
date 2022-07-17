const { e } = require('../../../JSON/emojis.json')

module.exports = (interaction) => {

    const { options } = interaction

    const subCommandGroup = options.getSubcommandGroup()
    const subCommand = options.getSubcommand()

    if (subCommandGroup === 'logomarca') return logoMarca()
    if (subCommandGroup === 'quiz') return quiz()

    async function logoMarca() {

        switch (subCommand) {
            case 'new': require('./logomarca/new.LogoMarca')(interaction); break;
            case 'view': require('./logomarca/view.LogoMarca')(interaction); break;
            case 'edit': require('./logomarca/edit.LogoMarca')(interaction); break;
            case 'delete': require('./logomarca/delete.LogoMarca')(interaction); break;
            default: await interaction.reply({
                content: `${e.Deny} | Nenhuma função foi encontrada`,
                ephemeral: true
            });
                break;
        }

        return
    }

    async function quiz() {

        switch (subCommand) {
            case 'new': require('./quiz/add.Quiz')(interaction); break;
            case 'delete': require('./quiz/delete.Quiz')(interaction); break;
            default: await interaction.reply({
                content: `${e.Deny} | Nenhuma função foi encontrada`,
                ephemeral: true
            });
                break;
        }

        return
    }
}