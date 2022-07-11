const Topgg = require('@top-gg/sdk')
const api = new Topgg.Api(process.env.TOP_GG_TOKEN)

module.exports = {
    name: 'vote',
    description: '[bot] Resgate sua recompensa de voto',
    dm_permission: false,
    type: 1,
    options: [],
    async execute({ interaction: interaction, emojis: e, client: client, database: Database, guildData: guildData }) {

        const { user } = interaction
        const { Config } = Database
        const hasVoted = await api.hasVoted(user.id)
        const userData = await Database.User.findOne({ id: user.id }, 'Timeouts.TopGGVote')
        const timeout = client.Timeout(43200000, userData?.Timeouts.TopGGVote)
        const moeda = guildData?.Moeda || `${e.Coin} Safiras`

        if (!hasVoted)
            return await interaction.reply({
                content: `${e.Info} | Você já pode votar e ganhar um recompensa!\n🔗 | ${Config.TopGGLink}`,
            })

        if (hasVoted && timeout)
            return await interaction.reply({
                content: `${e.Info} | Você já votou nas últimas 12 horas. Espere esse tempo passar.`,
            })

        await Database.User.updateOne(
            { id: user.id },
            {
                $inc: {
                    Balance: 3000,
                    Xp: 1000
                },
                'Timeouts.TopGGVote': Date.now()
            },
            { upsert: true }
        )

        return await interaction.reply({ content: `${e.Check} | Você resgatou sua recompensa de voto e ganhou **5000 ${moeda}** + **1000 XP ${e.RedStar}**` })
    }
}