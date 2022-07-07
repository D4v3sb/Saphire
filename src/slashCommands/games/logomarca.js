module.exports = {
    name: 'logomarca',
    description: '[games] Comando sob construção',
    dm_permission: false,
    type: 1,
    options: [
        {
            name: 'select_logo_marca',
            description: 'Veja as marcas disponíveis do comando',
            type: 3,
            autocomplete: true
        },
        // {
        //     name: 'list',
        //     description: 'Ver a lista de logo/marcas',
        //     type: 3
        // }
    ],
    async execute({ interaction: interaction, emojis: e }) {

        const { options } = interaction
        const selectLogo = options.getString('select_logo_marca')

        if (selectLogo) return require('./src/view.LogoMarca')(interaction)

        return await interaction.reply({
            content: `${e.Loading} | Este comando está sob construção.`
        })
    }
}