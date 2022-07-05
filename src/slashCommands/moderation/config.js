const util = require('../../structures/util')
const Notify = require('../../../modules/functions/plugins/notify')

module.exports = {
    name: 'config',
    description: '[moderation] Configurações gerais',
    default_member_permissions: util.slashCommandsPermissions.ADMINISTRATOR,
    dm_permission: false,
    type: 1,
    options: [
        {
            name: 'sugest_channel',
            description: 'Selecione o canal que deseja como Canal de Sugestões',
            type: 3,
            autocomplete: true
        },
        {
            name: 'report_channel',
            description: 'Selecione o canal que deseja como Central de Reportes',
            type: 3,
            autocomplete: true
        },
        {
            name: 'log_channel',
            description: 'Selecione o canal que deseja como Log Channel (GSN)',
            type: 3,
            autocomplete: true
        },
        // {
        //     name: 'confess_channel',
        //     description: 'Selecione o canal que deseja como Confessionário',
        //     type: 3,
        //     autocomplete: true
        // },
        {
            name: 'options',
            description: 'Verifique mais opções deste comando',
            type: 3,
            choices: [
                {
                    name: 'status',
                    value: 'status'
                }
            ]
        }
    ],
    async execute({ interaction: interaction, database: Database, emojis: e, guildData: guildData, client: client }) {

        const { options, guild, user } = interaction
        const optionsData = options.data
        const optionsString = options.getString('options')

        if (optionsString === 'status') return showStatus()

        switch (optionsData[0]?.name) {
            case 'sugest_channel': sugestChannel(); break;
            case 'report_channel': reportChannel(); break;
            case 'log_channel': logChannel(); break;
            // case 'confess_channel': confessChannel(); break;
            default: await interaction.reply({
                content: `${e.Deny} | Nenhuma função foi encontrada.`,
                ephemeral: true
            })
        }

        async function logChannel() {

            const logChannelAutocomplete = options.getString('log_channel')
            const channel = guild.channels.cache.get(logChannelAutocomplete)

            return logChannelAutocomplete === 'disableLogChannel'
                ? disableLogChannel()
                : enableLogChannel()

            async function disableLogChannel() {

                await Database.Guild.updateOne(
                    { id: guild.id },
                    { $unset: { LogChannel: 1 } }
                )

                return await interaction.reply({
                    content: `${e.Check} | Você desabilitou o sistema **GSN \`Global System Notification\`** e este servidor não possui mais este recurso ativado.`
                })
            }

            async function enableLogChannel() {

                if (!channel)
                    return await interaction.reply({
                        content: `${e.Deny} | Nenhum canal foi encontrado.`,
                        ephemeral: true
                    })

                if (guildData?.LogChannel === channel.id)
                    return await interaction.reply({
                        content: `${e.Deny} | Este já é o canal do sistema GSN atual.`,
                        ephemeral: true
                    })

                await Database.Guild.updateOne(
                    { id: guild.id },
                    { LogChannel: channel.id }
                )

                Notify(guild.id, 'Recurso Habilitado', `${user} - \`${user.id}\` ativou o sistema **GSN \`Global System Notification\`** no servidor. Agora, este canal receberá todas as notificações importantes.`)
                return await interaction.reply({
                    content: `${e.Check} | O canal ${channel} foi configurado com sucesso como **GSN \`Global System Notification Channel\`**`
                })
            }
        }

        async function reportChannel() {

            const reportChannelAutocomplete = options.getString('report_channel')
            const channel = guild.channels.cache.get(reportChannelAutocomplete)

            return reportChannelAutocomplete === 'disableReportChannel'
                ? disableReportChannel()
                : enableReportChannel()

            async function disableReportChannel() {

                await Database.Guild.updateOne(
                    { id: guild.id },
                    { $unset: { ReportChannel: 1 } }
                )

                Notify(guild.id, 'Recurso Desabilitado', `${user} - \`${user.id}\` desativou o **\`Canal de Reports\`** no servidor.`)
                return await interaction.reply({
                    content: `${e.Check} | Você desabilitou \`Canal de Reportes\` e este servidor não possui mais este recurso ativado.`
                })
            }

            async function enableReportChannel() {

                if (!channel)
                    return await interaction.reply({
                        content: `${e.Deny} | Nenhum canal foi encontrado.`,
                        ephemeral: true
                    })

                if (guildData?.ReportChannel === channel.id)
                    return await interaction.reply({
                        content: `${e.Deny} | Este já é o canal de reports atual.`,
                        ephemeral: true
                    })

                await Database.Guild.updateOne(
                    { id: guild.id },
                    { ReportChannel: channel.id }
                )

                Notify(guild.id, 'Recurso Habilitado', `${user} - \`${user.id}\` ativou o **\`Canal de Reports\`** no servidor.`)
                return await interaction.reply({
                    content: `${e.Check} | O canal ${channel} foi configurado com sucesso como \`Canal de Reports\``
                })
            }
        }

        // async function confessChannel() {

        //     const confessChannelAutocomplete = options.getString('confess_channel')
        //     const channel = guild.channels.cache.get(reportChannelAutocomplete)

        //     return confessChannelAutocomplete === 'disableConfessChannel'
        //         ? disableConfessChannel()
        //         : enableRConfesstChannel()

        //     async function disableConfessChannel() {

        //         await Database.Guild.updateOne(
        //             { id: guild.id },
        //             { $unset: { ReportChannel: 1 } }
        //         )

        //         Notify(guild.id, 'Recurso Desabilitado', `${user} - \`${user.id}\` desativou o **\`Canal de Reports\`** no servidor.`)
        //         return await interaction.reply({
        //             content: `${e.Check} | Você desabilitou \`Canal de Reportes\` e este servidor não possui mais este recurso ativado.`
        //         })
        //     }

        //     async function enableReportChannel() {

        //         if (!channel)
        //             return await interaction.reply({
        //                 content: `${e.Deny} | Nenhum canal foi encontrado.`,
        //                 ephemeral: true
        //             })

        //         if (guildData?.ReportChannel === channel.id)
        //             return await interaction.reply({
        //                 content: `${e.Deny} | Este já é o canal de reports atual.`,
        //                 ephemeral: true
        //             })

        //         await Database.Guild.updateOne(
        //             { id: guild.id },
        //             { ReportChannel: channel.id }
        //         )

        //         Notify(guild.id, 'Recurso Habilitado', `${user} - \`${user.id}\` ativou o **\`Canal de Reports\`** no servidor.`)
        //         return await interaction.reply({
        //             content: `${e.Check} | O canal ${channel} foi configurado com sucesso como \`Canal de Reports\``
        //         })
        //     }
        // }

        async function sugestChannel() {

            const sugestChannelAutocomplete = options.getString('sugest_channel')
            const channel = guild.channels.cache.get(sugestChannelAutocomplete)

            return sugestChannelAutocomplete === 'disableSugestChannel'
                ? disableSugestChannel()
                : enableSugestChannel()

            async function disableSugestChannel() {

                await Database.Guild.updateOne(
                    { id: guild.id },
                    { $unset: { IdeiaChannel: 1 } }
                )

                Notify(guild.id, 'Recurso Desabilitado', `${user} - \`${user.id}\` desativou o **\`Canal de Sugestões\`** no servidor.`)
                return await interaction.reply({
                    content: `${e.Check} | Você desabilitou \`Canal de Sugestões\` e este servidor não possui mais este recurso ativado.`
                })
            }

            async function enableSugestChannel() {

                if (!channel)
                    return await interaction.reply({
                        content: `${e.Deny} | Nenhum canal foi encontrado.`,
                        ephemeral: true

                    })

                if (guildData?.IdeiaChannel === channel.id)
                    return await interaction.reply({
                        content: `${e.Deny} | Este já é o canal atual.`,
                        ephemeral: true
                    })

                await Database.Guild.updateOne(
                    { id: guild.id },
                    { IdeiaChannel: channel.id }
                )

                Notify(guild.id, 'Recurso Habilitado', `${user} - \`${user.id}\` ativou o **\`Canal de Sugestões\`** no servidor.`)
                return await interaction.reply({
                    content: `${e.Check} | O canal ${channel} foi configurado com sucesso como \`Canal de Sugestões\``
                })
            }
        }

        async function showStatus() {

            await interaction.deferReply()

            const ConfigEmbed = {
                color: client.green,
                title: `${e.ModShield} Configurações ${guild.name}`,
                description: 'Canais e sistema configurados',
                fields: [
                    
                    {
                        name: `🛰️ Global System Notification`,
                        value: await GetChannel('LogChannel')
                    },
                    {
                        name: '🗣️ Antifake Premium System',
                        value: guildData.Antifake ? `${e.Check} Ativado` : `${e.Deny} Desativado`
                    },
                    {
                        name: `${e.antlink} Antilink Premium System`,
                        value: guildData.AntLink ? `${e.Check} Ativado` : `${e.Deny} Desativado`
                    },
                    {
                        name: `${e.Verify} Autorole System`,
                        value: await GetAutorole()
                    },
                    {
                        name: '💬 Canal de Ideias',
                        value: await GetChannel('IdeiaChannel')
                    },
                    {
                        name: `${e.Leave} Canal de Saida`,
                        value: await GetChannel('LeaveChannel', 'Canal')
                    },
                    {
                        name: `${e.Join} Canal de Boas-Vindas`,
                        value: await GetChannel('WelcomeChannel', 'Canal')
                    },
                    {
                        name: `${e.RedStar} Canal de XP`,
                        value: await GetChannel('XpSystem', 'Canal')
                    },
                    {
                        name: `${e.Report} Canal de Reports`,
                        value: await GetChannel('ReportChannel')
                    },
                    {
                        name: `📝 Confessionário`,
                        value: await GetChannel('ConfessChannel')
                    }
                ],
                footer: { text: `${client.user.username}'s Center Configurations Per Server Showing View` }
            }

            return await interaction.editReply({ embeds: [ConfigEmbed] }).catch(() => { })

            async function GetAutorole() {

                let roles = guildData.Autorole || []

                if (!roles || roles.length === 0) return 'Sistema desativado'

                let rolesMapped = roles.map(roleId => {

                    let role = guild.roles.cache.get(roleId)

                    if (!role) {
                        removeRoleFromAutorole(roleId)
                        return `${e.Deny} | Cargo não encontrado`
                    }

                    return `${role} *\`${roleId}\`*`
                }).join('\n')

                return rolesMapped || 'Indefinido'
            }

            async function GetChannel(a, b) {

                if (b) {

                    let route = `${a}.${b}`

                    if (!guildData[a])
                        return 'Desativado'

                    let Channel = guild.channels.cache.get(guildData[a][b])

                    if (!Channel)
                        await Database.Guild.updateOne(
                            { id: guild.id },
                            { $unset: { [route]: 1 } }
                        )

                    return Channel ? `Ativado: ${Channel} - ${Channel?.name || '\`Nome indefinido\`'}` : 'Desativado'

                } else {

                    if (!guildData[a])
                        return 'Desativado'

                    let Channel = guild.channels.cache.get(guildData[a])

                    if (!Channel)
                        await Database.Guild.updateOne(
                            { id: guild.id },
                            { $unset: { [a]: 1 } }
                        )

                    return Channel ? `Ativado: ${Channel} - ${Channel?.name || '\`Nome indefinido\`'}` : 'Desativado'

                }

            }

            async function removeRoleFromAutorole(roleId) {

                await Database.Guild.updateOne(
                    { id: guild.id },
                    { $pull: { Autorole: roleId } }
                )
                return
            }

        }

        return

    }
}