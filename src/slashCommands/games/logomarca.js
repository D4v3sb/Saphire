module.exports = {
    name: 'logomarca',
    description: '[games] Comando sob construção',
    dm_permission: false,
    type: 1,
    options: [
        {
            name: 'view',
            description: '[games] Veja uma única marca',
            type: 1,
            options: [
                {
                    name: 'select_logo_marca',
                    description: 'Veja as marcas disponíveis do comando',
                    type: 3,
                    required: true,
                    autocomplete: true
                }
            ]
        },
        {
            name: 'list',
            description: '[games] Ver a lista de logo/marcas',
            type: 1,
            options: [
                {
                    name: 'filter',
                    description: 'Filtre as marcas pelas primeiras letras (ou não)',
                    type: 3
                }
            ]
        },
        {
            name: 'new_game',
            description: '[games] Começar o quiz de logo/marcas',
            type: 1,
            options: [
                {
                    name: 'color',
                    description: 'Escolher cor do embed do jogo',
                    type: 3,
                    autocomplete: true
                }
            ]
        },
        {
            name: 'info',
            description: '[games] Informações gerais do comando',
            type: 1
        }
    ],
    async execute({ interaction: interaction, emojis: e, client: client, database: Database }) {

        const { options } = interaction
        const subCommand = options.getSubcommand()

        switch (subCommand) {
            case 'list': require('./src/list.LogoMarca')(interaction); break;
            case 'view': require('./src/view.LogoMarca')(interaction); break;
            case 'new_game': require('./src/newGame.LogoMarca')(interaction); break;
            case 'info': showInfo(); break;
            default:
                await interaction.reply({
                    content: `${e.Loading} | Nenhuma sub-função foi encontrada..`
                });
                break;
        }
        return

        async function showInfo() {
            return await interaction.reply({
                embeds: [
                    {
                        color: client.blue,
                        title: `${e.logomarca} ${client.user.username}'s Logo & Marca Info`,
                        description: `O jogo Logo & Marca é um Quiz. O objetivo é simples, acertar o máximo de logos e marcas que aparecer.`,
                        fields: [
                            {
                                name: '❤ Vidas ou Reset 🔄',
                                value: 'Para cada jogo existem 3 vidas e o reset. Quando ninguém acertar a marca, você pode recomeçar de onde parou. Porém, apenas 3 vezes. E claro, o reset é para começar tudo novamente.'
                            },
                            {
                                name: '😨 HO MEU DEUS, EU NÃO APAREÇO NO RANKING',
                                value: 'Calma aí coisinha fofa! Apenas os 5 primeiros com mais pontos aparecem no ranking.'
                            },
                            {
                                name: `${e.bug} Bugou, e agora?`,
                                value: 'Reporte o problema atráves do comando `/bug`'
                            },
                            {
                                name: `${e.logomarca} Créditos`,
                                value: `${e.Gear} Código Fonte: ${client.users.cache.get(Database.Names.Rody)?.tag || 'Rody#1000'}\n🖌 Designer e Edição: ${client.users.cache.get(Database.Names.San)?.tag || 'San O.#0001'}\n${e.boxes} Recursos: ${client.users.cache.get(Database.Names.Khetlyn)?.tag || 'Khetlyn#4323'} & ${client.users.cache.get(Database.Names.Moana)?.tag || 'moana#6370'}`
                            }
                        ],
                        footer: { text: `${Database.Logomarca.get('LogoMarca')?.length || 0} Logos & Marcas` }
                    }
                ]
            })
        }
    }
}