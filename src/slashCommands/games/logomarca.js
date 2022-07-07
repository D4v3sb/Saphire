module.exports = {
    name: 'logomarca',
    description: '[games] Comando sob construção',
    dm_permission: false,
    type: 1,
    options: [
        {
            name: 'view',
            description: '[games] Veja as marcas disponíveis do comando',
            type: 1,
            options: [
                {
                    name: 'select_logo_marca',
                    description: 'Veja as marcas disponíveis do comando',
                    type: 3,
                    required: true,
                    autocomplete: true
                }
            ]
        },
        {
            name: 'list',
            description: '[games] Ver a lista de logo/marcas',
            type: 1,
            options: [
                {
                    name: 'filter',
                    description: 'Filtre as marcas pelas primeiras letras (ou não)',
                    type: 3
                }
            ]
        },
        {
            name: 'new_game',
            description: '[games] Começar o quiz de logo/marcas',
            type: 1,
            options: []
        }
    ],
    async execute({ interaction: interaction, emojis: e }) {

        const { options } = interaction
        const subCommand = options.getSubcommand()

        switch (subCommand) {
            case 'list': require('./src/list.LogoMarca')(interaction); break;
            case 'view': require('./src/view.LogoMarca')(interaction); break;
            case 'new_game': require('./src/newGame.LogoMarca')(interaction); break;
            default:
                await interaction.reply({
                    content: `${e.Loading} | Este comando está sob construção.`
                });
                break;
        }
        return
    }
}