module.exports = {
    name: 'vote',
    description: '[bot] Resgate sua recompensa de voto',
    dm_permission: false,
    type: 1,
    options: [],
    async execute({ interaction: interaction, emojis: e, client: client, database: Database }) {

        const { Config } = Database

        const buttons = {
            type: 1,
            components: [
                {
                    type: 2,
                    label: 'RESGATAR',
                    emoji: e.topgg,
                    custom_id: 'getVotePrize',
                    style: 'SUCCESS'
                },
                {
                    type: 2,
                    label: 'VOTAR',
                    emoji: e.Upvote,
                    url: Config.TopGGLink,
                    style: 'LINK'
                }
            ]
        }

        return await interaction.reply({
            embeds: [{
                color: client.blue,
                title: `${e.topgg} | Top.gg Bot List`,
                description: `Me dê um voto e ganhe recompensas.`
            }],
            components: [buttons]
        })
    }
}