const util = require('../../structures/util')

module.exports = {
    name: 'prefix',
    description: '[moderation] Altere o prefixo do servidor',
    dm_permission: false,
    default_member_permissions: util.slashCommandsPermissions.ADMINISTRATOR,
    type: 1,
    options: [
        {
            name: 'set_prefix',
            description: 'Escolha o novo prefixo do bot',
            type: 3,
            required: true,
            autocomplete: true
        }
    ],
    async execute({ interaction: interaction, emojis: e, database: Database, guildData: guildData, client: client }) {

        const { options, guild } = interaction

        const newPrefix = options.getString('set_prefix')
        const atualPrefix = guildData?.Prefix

        if ([client.prefix, 'reset'].includes(newPrefix)) {

            if (!atualPrefix)
                return await interaction.reply({
                    content: `${e.Info} | O prefixo atual já é o padrão. O reset não é necessário`,
                    ephemeral: true
                })

            Database.guildDelete(guild.id, 'Prefix')

            return await interaction.reply({
                content: `${e.Check} | Prefixo resetado com sucesso para \`-\`.`
            })
        }

        if (newPrefix?.length > 2)
            return await interaction.reply({
                content: `${e.Deny} | O prefixo não pode conter mais que 2 caracteres.`,
                ephemeral: true
            })

        if (newPrefix === atualPrefix)
            return await interaction.reply({
                content: `${e.Deny} | Este já é o meu prefixo padrão.`,
                ephemeral: true
            })

        if (newPrefix === "<")
            return await interaction.reply({
                content: `${e.Deny} | Prefixo não permitido.`,
                ephemeral: true
            })

        Database.setPrefix(newPrefix, guild.id)

        return await interaction.reply({
            content: `${e.Check} | O prefixo foi alterado com sucesso para \`${newPrefix}\`.`
        })

    }
}