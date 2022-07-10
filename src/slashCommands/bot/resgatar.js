// const Topgg = require('@top-gg/sdk')
// const api = new Topgg.Api(process.env.TOPPGG_TOKEN)

// module.exports = {
//     name: 'resgatar',
//     description: '[bot] Resgate sua recompensa de voto',
//     dm_permission: false,
//     type: 1,
//     options: [],
//     async execute({ interaction: interaction, emojis: e }) {

//         const { user } = interaction
//         const hasVoted = await api.hasVoted(user.id)

//         // TODO: Timeout (12h)

//         if (!hasVoted)
//             return await interaction.reply({
//                 content: `${e.Info} | Você precisa votar primeiro antes de resgatar sua recompensa.`,
//                 ephemeral: true
//             })

//         return await interaction.reply({ content: 'ok' })
//     }
// }