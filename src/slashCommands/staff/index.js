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
            case 'add_answers': require('./quiz/newAnswers.Quiz')(interaction); break;
            case 'del_answers': require('./quiz/delAnswers.Quiz')(interaction); break;
            case 'edit': require('./quiz/edit.Quiz')(interaction); break;
            case 'list': require('./quiz/list.Quiz')(interaction); break;
            case 'view': require('./quiz/view.Quiz')(interaction); break;
            default: await interaction.reply({
                content: `${e.Deny} | Nenhuma função foi encontrada`,
                ephemeral: true
            });
                break;
        }

        return
    }
}