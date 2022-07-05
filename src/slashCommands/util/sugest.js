module.exports = {
    name: 'sugest',
    description: '[util] Mande ideias/sugestões para mim ou para o servidor',
    dm_permission: false,
    type: 1,
    options: [
        {
            name: 'enviar',
            description: '[util] Envie ideias/sugestões para o servidor ou para mim',
            type: 1,
            options: [
                {
                    name: 'option',
                    description: 'Qual opção deseja executar?',
                    type: 3,
                    required: true,
                    autocomplete: true
                }
            ]
        },
        {
            name: 'config',
            description: 'bla',
            type: 1,
            options: [
                {
                    name: 'choose_channel',
                    description: 'Selecione o canal',
                    type: 3,
                    required: true,
                    autocomplete: true
                }
            ]
        }
    ],
    async execute({ interaction: interaction, modals: modals, emojis: e, guildData: guildData, database: Database, client: client }) {

        const { options, guild, channel: atualChannel } = interaction
        const option = options.getString('option')
        const channelOption = options.getString('choose_channel')
        const channel = guild.channels.cache.get(channelOption) || atualChannel

        if (channelOption === 'disable') return disable()
        if (channelOption?.length === 18) return enable()

        switch (option) {
            case 'bot': sendMessageToBot(); break;
            case 'server': sendMessageToServer(); break;
            case 'disabled': disabled(); break;
            default: await interaction.reply({
                content: `${e.Deny} | Função desconhecida`,
                ephemeral: true
            });
                break;
        }

        return

        async function disable() {

            await Database.Guild.updateOne(
                { id: guild.id },
                { $unset: { IdeiaChannel: 1 } }
            )

            return await interaction.reply({
                content: `${e.Check} | O canal ${channel} foi retirado com e não é mais o \`Canal de Ideias\``
            })
        }

        async function enable() {

            if (guildData?.IdeiaChannel === channel.id)
                return await interaction.reply({
                    content: `${e.Deny} | Este já é o canal atual.`,
                    ephemeral: true
                })

            await Database.Guild.updateOne(
                { id: guild.id },
                { IdeiaChannel: channel.id }
            )

            return await interaction.reply({
                content: `${e.Check} | O canal ${channel} foi configurado com sucesso como \`Canal de Ideias\``
            })
        }

        async function sendMessageToBot() {
            return await interaction.showModal(modals.ideia(`${client.user.username}'s Recieve Sugest`, 'botSugest'))
        }

        async function sendMessageToServer() {
            return await interaction.showModal(modals.ideia('Sugest Server Modal', 'serverSugest'))
        }

        async function disabled() {
            return await interaction.reply({
                content: `${e.Info} | Este recurso está desativado neste servidor. Peça para um administrador*(a)* ativa-lo usando o comando \`/sugest config\`.`,
                ephemeral: true
            })
        }

    }
}