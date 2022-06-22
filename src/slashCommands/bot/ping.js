module.exports = {
    name: 'ping',
    description: '[bot] Veja o meu ping',
    dm_permission: false,
    type: 1,
    options: [],
    async execute({ interaction: interaction, client: client }) {
        await interaction.deferReply({ ephemeral: true })
        return interaction.editReply({ content: `🏓 | Meu ping atual está em: **${client.ws.ping}**ms` }).catch(() => { })
    }
}