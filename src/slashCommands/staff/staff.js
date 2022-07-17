module.exports = {
    name: 'staff',
    description: '[administration] Comandos exclusivos para os membros da Saphire\'s Team',
    dm_permission: false,
    staff: true,
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
                {
                    name: 'edit',
                    description: '[staff] Edite uma marca',
                    type: 1,
                    options: [
                        {
                            name: 'select_logo_marca',
                            description: 'Selecione uma logo/marca',
                            type: 3,
                            required: true,
                            autocomplete: true
                        },
                        {
                            name: 'name',
                            description: 'Edite o nome da logo/marca',
                            type: 3
                        },
                        {
                            name: 'add_sinonimo',
                            description: 'Adicionar um novo sinônimo',
                            type: 3
                        },
                        {
                            name: 'remove_sinonimo',
                            description: 'Adicionar um novo sinônimo',
                            type: 3,
                            autocomplete: true
                        },
                        {
                            name: 'editar_imagem_com_censura',
                            description: 'Editar imagem da logo/marca',
                            type: 3,
                            autocomplete: true
                        },
                        {
                            name: 'editar_imagem_sem_censura',
                            description: 'Editar imagem da logo/marca',
                            type: 3
                        }
                    ]
                },
                {
                    name: 'delete',
                    description: '[staff] Deletar uma logo/marca',
                    type: 1,
                    options: [
                        {
                            name: 'select_logo_marca',
                            description: 'Selecione uma logo/marca',
                            type: 3,
                            required: true,
                            autocomplete: true
                        }
                    ]
                }
            ]
        },
        {
            name: 'quiz',
            description: '[staff] Comando para gerenciar o conteúdo do comando quiz',
            type: 2,
            options: [
                {
                    name: 'new',
                    description: '[staff] Adicionar uma nova pergunta',
                    type: 1,
                    options: [
                        {
                            name: 'question',
                            description: 'Nova pergunta do quiz',
                            type: 3,
                            required: true
                        },
                        {
                            name: 'answer',
                            description: 'Resposta número 1',
                            type: 3,
                            required: true
                        },
                        {
                            name: 'answer2',
                            description: 'Resposta número 2',
                            type: 3
                        },
                        {
                            name: 'answer3',
                            description: 'Resposta número 2',
                            type: 3
                        }
                    ]
                },
                {
                    name: 'delete',
                    description: '[staff] Delete uma pergunta do quiz',
                    type: 1,
                    options: [
                        {
                            name: 'quiz_question',
                            description: 'Selecione a pergunta para deletar',
                            type: 3,
                            required: true,
                            autocomplete: true
                        }
                    ]
                },
                {
                    name: 'add_answers',
                    description: 'Adicione uma nova resposta a uma pergunta',
                    type: 1,
                    options: [
                        {
                            name: 'quiz_question',
                            description: 'Selecione a pergunta que deseja',
                            type: 4,
                            required: true,
                            autocomplete: true
                        },
                        {
                            name: 'new_answer',
                            description: 'Resposta a ser adicionada',
                            type: 3,
                            required: true
                        },
                        {
                            name: 'new_answer2',
                            description: 'Resposta a ser adicionada',
                            type: 3
                        },
                        {
                            name: 'new_answer3',
                            description: 'Resposta a ser adicionada',
                            type: 3
                        },
                        {
                            name: 'new_answer4',
                            description: 'Resposta a ser adicionada',
                            type: 3
                        }
                    ]
                },
                {
                    name: 'del_answers',
                    description: 'Delete uma resposta de uma pergunta',
                    type: 1,
                    options: [
                        {
                            name: 'quiz_question',
                            description: 'Selecione a pergunta que deseja',
                            type: 4,
                            required: true,
                            autocomplete: true
                        },
                        {
                            name: 'answers',
                            description: 'Resposta a ser deleteada',
                            type: 3,
                            required: true,
                            autocomplete: true
                        }
                    ]
                }
            ]
        }
    ],
    async execute({ interaction: interaction, database: Database, emojis: e, clientData: clientData }) {

        const { Config: config } = Database
        const { user } = interaction
        const adms = [...clientData.Administradores, ...clientData.Moderadores, config.ownerId, '327496267007787008']

        if (!adms.includes(user.id))
            return await interaction.reply({
                content: `${e.OwnerCrow} | Este é um comando privado para a Saphire's Team.`,
                ephemeral: true
            })

        return require('./index')(interaction)
    }
}