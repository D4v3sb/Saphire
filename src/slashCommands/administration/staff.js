module.exports = {
    name: 'staff',
    description: '[administration] Comandos exclusivos para os membros da Saphire\'s Team',
    dm_permission: false,
    admin: true,
    type: 1,
    options: [
        {
            name: 'logomarca',
            description: '[staff] Comando para gerenciar o conteúdo do comando logomarca',
            type: 2,
            options: [
                {
                    name: 'new',
                    description: '[staff] Adicionar uma nova logo/marca',
                    type: 1,
                    options: [
                        {
                            name: 'marca',
                            description: 'Nome da logo/marca',
                            type: 3,
                            required: true
                        },
                        {
                            name: 'image_url_sem_censura',
                            description: 'Link da imagem sem censura',
                            type: 3,
                            required: true
                        },
                        {
                            name: 'image_url_com_censura',
                            description: 'Link da imagem com censura',
                            type: 3
                        },
                        {
                            name: 'sinonimo',
                            description: 'Adicionar um sinônimo a marca',
                            type: 3
                        },
                        {
                            name: 'outro_sinonimo',
                            description: 'Adicionar um sinônimo a marca',
                            type: 3
                        }
                    ]
                },
                {
                    name: 'view',
                    description: '[staff] Veja as marcas',
                    type: 1,
                    options: [
                        {
                            name: 'select_logo_marca',
                            description: 'Selecione uma marca',
                            type: 3,
                            required: true,
                            autocomplete: true
                        }
                    ]
                },
                // {
                //     name: 'edit',
                //     description: '[staff] Edite uma marca',
                //     type: 1,
                //     options: [
                //         {
                //             name: 'select_logo_marca',
                //             description: 'Selecione uma logo/marca',
                //             type: 3,
                //             required: true,
                //             autocomplete: true
                //         },
                //         {
                //             name: 'add_sinonimo',
                //             description: 'Adicionar um novo sinônimo',
                //             type: 3
                //         },
                //         {
                //             name: 'remove_sinonimo',
                //             description: 'Adicionar um novo sinônimo',
                //             type: 3,
                //             autocomplete: true
                //         },
                //         {
                //             name: 'editar_imagem_com_censura',
                //             description: 'Editar imagem da logo/marca',
                //             type: 3
                //         },
                //         {
                //             name: 'editar_imagem_sem_censura',
                //             description: 'Editar imagem da logo/marca',
                //             type: 3
                //         }
                //     ]
                // },
                // {
                //     name: 'delete',
                //     description: '[staff] Deletar uma logo/marca',
                //     type: 1,
                //     options: [
                //         {
                //             name: 'select_logo_marca',
                //             description: 'Selecione uma logo/marca',
                //             type: 3,
                //             required: true,
                //             autocomplete: true
                //         }
                //     ]
                // }
            ]
        }
    ],
    async execute({ interaction: interaction, database: Database, emojis: e, clientData: clientData }) {

        const { Config: config } = Database
        const { options, user } = interaction
        const adms = [...clientData.Administradores, clientData.Moderadores, config.ownerId, '327496267007787008']

        if (!adms.includes(user.id))
            return await interaction.reply({
                content: `${e.OwnerCrow} | Este é um comando privado para a Saphire's Team.`,
                ephemeral: true
            })

        const subCommandGroup = options.getSubcommandGroup()

        switch (subCommandGroup) {
            case 'logomarca': logoMarca(); break;
            default: await interaction.reply({
                content: `${e.Deny} | Nenhuma função foi encontrada`,
                ephemeral: true
            });
                break;
        }

        return

        async function logoMarca() {

            const subCommand = options.getSubcommand()
            const newLogoMarca = require('./staff/newLogoMarca')
            const viewLogoMarca = require('./staff/viewLogoMarca')
            // const editLogoMarca = require('./staff/editLogoMarca')

            switch (subCommand) {
                case 'new': newLogoMarca(interaction); break;
                case 'view': viewLogoMarca(interaction); break;
                // case 'edit': editLogoMarca(interaction); break;
                // case 'delete': deleteLogoMarca(); break;
                default: await interaction.reply({
                    content: `${e.Deny} | Nenhuma função foi encontrada`,
                    ephemeral: true
                });
                    break;
            }

            return
        }
    }
}