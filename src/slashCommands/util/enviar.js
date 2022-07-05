module.exports = {
    name: 'enviar',
    description: '[util] Envie ideias/sugestões/reportes para mim ou para o servidor',
    dm_permission: false,
    type: 1,
    options: [{
        name: 'option',
        description: 'Qual opção deseja executar?',
        type: 3,
        required: true,
        autocomplete: true
    }],
    async execute({ interaction: interaction, modals: modals, emojis: e, client: client }) {

        const { options } = interaction
        const option = options.getString('option')

        switch (option) {
            case 'sugestBot': sendMessageToBot(); break;
            case 'sugestServer': sendMessageToServer(); break;
            case 'reportServer': sendReportMessageToServer(); break;
            case 'disabled': disabled(); break;
            default: await interaction.reply({
                content: `${e.Deny} | Função desconhecida`,
                ephemeral: true
            });
                break;
        }

        return

        async function sendMessageToBot() {
            return await interaction.showModal(modals.ideia(`${client.user.username}'s Recieve Sugest`, 'botSugest', 'Sugestão para a bot', `Minha sugestão para a ${client.user.username} é...`))
        }

        async function sendMessageToServer() {
            return await interaction.showModal(modals.ideia('Sugest Server Modal', 'serverSugest', 'Qual é a sua sugestão?', 'Minha sugestão para o servidor é...'))
        }

        async function sendReportMessageToServer() {
            return await interaction.showModal(modals.ideia('Report Server Modal', 'serverReport', 'Qual é o seu reporte?', 'No chat geral, tem alguém xingando...'))
        }

        async function disabled() {
            return await interaction.reply({
                content: `${e.Info} | Este recurso está desativado neste servidor. Peça para um administrador*(a)* ativa-lo usando o comando \`/config\`.`,
                ephemeral: true
            })
        }

    }
}