module.exports = {
    name: 'genius',
    description: '[game] Genius! Você é bom em memorizar sequências?',
    dm_permission: false,
    type: 1,
    options: [
        {
            name: 'start',
            description: 'Começe um novo jogo',
            type: 1
        }
    ],
    async execute({ interaction: interaction, emojis: e }) {

        const { options } = interaction
        return await interaction.reply({
            content: `${e.Loading} | Este comando está sob construção.`,
            ephemeral: true
        })

    }
}