module.exports = {
    name: 'pull',
    description: '[util] Inicie uma nova votação',
    dm_permission: false,
    type: 1,
    options: [
        {
            name: 'text',
            description: 'Texto da votação',
            type: 3,
            required: true
        }
    ],
    async execute({ interaction: interaction, emojis: e, client: client }) {

        const { options, user } = interaction

        const content = options.getString('text')

        if (!content) return await interaction.reply({
            content: `${e.Deny} | Você precisa me dizer o que vai ser votado.`,
            ephemeral: true
        })

        if (content.length > 3000 || content.length < 6)
            return await interaction.reply({
                content: `${e.Deny} | Você precisa fornecer uma mensagem que contenha pelo menos **6~1000 caracteres.**`,
                ephemeral: true
            })

        const avatar = user.displayAvatarURL({ dynamic: true, format: "png", size: 1024 }) || null

        const msg = await interaction.reply({
            embeds: [{
                color: client.blue,
                description: content,
                author: { name: `${user.username} abriu uma votação`, iconURL: avatar }
            }],
            fetchReply: true
        })

        for (let i of [e.Upvote, e.DownVote]) msg.react(i).catch(() => { })
        return
    }
}