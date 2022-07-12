module.exports = {
    name: 'serverinfo',
    description: '[info] Veja as informações de um servidor',
    dm_permission: false,
    type: 1,
    options: [
        {
            name: 'search_guild',
            description: 'Pesquise e selecione um servidor',
            type: 3,
            autocomplete: true
        }
    ],
    async execute({ interaction: interaction, client: client, emojis: e }) {

        const { options } = interaction
        const guild = client.guilds.cache.get(options.getString('search_guild')) || interaction.guild

        if (options.getString('search_guild') && !guild)
            return await interaction.reply({
                content: `${e.Deny} | Eu não achei nenhum servidor com as informações passadas.`,
                ephemeral: true
            })

        if (!guild)
            return await interaction.reply({
                content: `${e.Deny} | Nenhum servidor foi encontrado.`,
                ephemeral: true
            })

        const bans = await guild.bans.fetch()
        const bansCount = bans.toJSON().length || 0
        const DataFormatada = `<t:${parseInt(guild.createdAt.getTime() / 1000)}:F>`
        const criadoA = `<t:${parseInt(guild.createdAt.getTime() / 1000)}:R>`
        const Notifications = guild.defaultMessageNotifications === 'ONLY_MENTIONS' ? 'Apenas @menções' : 'Todas as mensagens'

        const ConteudoExplicito = {
            DISABLED: 'Desativado',
            ALL_MEMBERS: 'Ativo para todos os membros',
            MEMBERS_WITHOUT_ROLES: 'Ativo para membros sem cargos'
        }[guild.explicitContentFilter]

        const LevelVerification = {
            NOME: 'Nenhum',
            LOW: 'Baixo',
            MEDIUM: 'Médio',
            HIGH: 'Alta',
            VERY_HIGH: 'Mais Alta'
        }[guild.verificationLevel]

        const LevelNSFW = {
            DEFAULT: 'Padrão',
            EXPLICIT: 'Explícito',
            SAFE: 'Seguro',
            AGE_RESTRICTED: 'Restrição de Idade',
        }[guild.nsfwLevel]

        const Tier = {
            NONE: 'Nenhum',
            TIER_1: 'Tier 1',
            TIER_2: 'Tier 2',
            TIER_3: 'Tier 3'
        }[guild.premiumTier]

        return await interaction.reply({
            embeds: [{
                color: client.blue,
                title: `${e.Info} Server Info Command`,
                thumbnail: { url: guild.iconURL({ dynamic: true }) },
                fields: [
                    {
                        name: `${e.OwnerCrow} Nomes`,
                        value: `<@${guild.ownerId}> - *${client.users.cache.get(guild.ownerId)?.tag}* - *\`${guild.ownerId}\`*\n${guild.name} - \`${guild.id}\``
                    },
                    {
                        name: `💬 Canais`,
                        value: `${guild.publicUpdatesChannelId ? `Updates Publícos: <#${guild.publicUpdatesChannelId}>` : ''}${guild.rulesChannelId ? `\nCanal de regras: <#${guild.rulesChannelId}>` : ''}${guild.systemChannelId ? `\nCanal do Sistema: <#${guild.systemChannelId}>` : ''}${guild.afkChannelId ? `\nCanal AFK: <#${guild.afkChannelId}>` : ''}\nTempo para AFK: ${parseInt(guild.afkTimeout / 60) || 0} Minutos`
                    },
                    {
                        name: `${e.Info} Informações`,
                        value: `Criado em: ${DataFormatada}\nExiste á: ${criadoA}\nNotificações: ${Notifications}\nFiltro de Conteúdo Explícito: ${ConteudoExplicito}${guild.premiumSubscriptionCount > 0 ? `\nBoosts: ${guild.premiumSubscriptionCount}` : ''}${Tier ? `\nTier: ${Tier}` : ''}${LevelVerification ? `\nNivel de Verificação: ${LevelVerification}` : ''}${guild.verified ? '\nVerificado: Sim' : ''}${LevelNSFW ? `\nFiltro NSFW: ${LevelNSFW}` : ''}${guild.partnered ? `\nParceiro: ${guild.partnered}` : ''}`
                    },
                    {
                        name: `📊 Contagem`,
                        value: `${guild.channels.cache.size} Canais\n${guild.memberCount} Membros\n${guild.roles.cache.size} Cargos\n${bansCount} Banidos\nSuporta até ${guild.maximumMembers} Membros`
                    },
                    {
                        name: `📝 Descrição do Servidor`,
                        value: guild.description || 'Não há descrição'
                    },
                    {
                        name: `😀 ${guild.emojis.cache.size} Emojis`,
                        value: guild.emojis.cache.map(emoji => emoji).slice(0, 30).join(', ').slice(0, 1024) || 'Não há nada a ser mostrado aqui...'
                    }
                ]
            }]
        })
    }
}