class Modals {

    get modals() {
        return { ...this }
    }

    newAnimeCharacter = {
        title: 'New Anime Character Quiz Data',
        custom_id: "newAnimeCharacter",
        components: [
            {
                type: 1,
                components: [
                    {
                        type: 4,
                        custom_id: "name",
                        label: "Nome do personagem",
                        style: 1,
                        placeholder: "Naruto",
                        required: true
                    }
                ]
            },
            {
                type: 1,
                components: [
                    {
                        type: 4,
                        custom_id: "image",
                        label: "Link da imagem",
                        style: 1,
                        placeholder: "https://media.discordapp.net/attachments/977336529129209907/977342165632036914/unknown.png",
                        required: true
                    }
                ]
            },
            {
                type: 1,
                components: [
                    {
                        type: 4,
                        custom_id: "anime",
                        label: "Nome do Anime",
                        style: 1,
                        placeholder: "Naruto Shippuden",
                        required: true
                    }
                ]
            }
        ]
    }

    newFlag = {
        title: "Create New Flag",
        custom_id: "newFlagCreate",
        components: [
            {
                type: 1,
                components: [
                    {
                        type: 4,
                        custom_id: "flag",
                        label: "Emoji da bandeira",
                        style: 1,
                        placeholder: "emoji",
                        required: true
                    }
                ]
            },
            {
                type: 1,
                components: [
                    {
                        type: 4,
                        custom_id: "country",
                        label: "Nome da bandeira",
                        style: 1,
                        placeholder: "Brasil, Austria, Argentina...",
                        required: true
                    }
                ]
            },
            {
                type: 1,
                components: [
                    {
                        type: 4,
                        custom_id: "country1",
                        label: "Adicionar Sinônimo",
                        style: 1,
                        placeholder: "Brazil, Usa, Eua..."
                    }
                ]
            },
            {
                type: 1,
                components: [
                    {
                        type: 4,
                        custom_id: "country2",
                        label: "Adicionar Sinônimo +",
                        style: 1,
                        placeholder: "United States, Australia..."
                    }
                ]
            },
            {
                type: 1,
                components: [
                    {
                        type: 4,
                        custom_id: "image",
                        label: "Link da imagem da bandeira",
                        style: 1,
                        placeholder: "https://media.discordapp.net/attachments/975974003229474846/990387818176065557/unknown.png",
                        required: true
                    }
                ]
            } // MAX: 5 Fields
        ]
    }

    editFlag = (emoji, name, image) => {
        return {
            title: "Edit Flag Info",
            custom_id: name,
            components: [
                {
                    type: 1,
                    components: [
                        {
                            type: 4,
                            custom_id: "flag",
                            label: "Emoji da bandeira",
                            style: 1,
                            placeholder: "emoji",
                            required: true,
                            value: emoji || null
                        }
                    ]
                },
                {
                    type: 1,
                    components: [
                        {
                            type: 4,
                            custom_id: "country",
                            label: "Nome da bandeira",
                            style: 1,
                            placeholder: "Brasil, Austria, Argentina...",
                            value: '/bandeiras options flag-adminstration:'
                        }
                    ]
                },
                {
                    type: 1,
                    components: [
                        {
                            type: 4,
                            custom_id: "image",
                            label: "Link da imagem da bandeira",
                            style: 1,
                            placeholder: "https://media.discordapp.net/attachments/975974003229474846/990387818176065557/unknown.png",
                            required: true,
                            value: image || null
                        }
                    ]
                } // MAX: 5 Fields
            ]
        }
    }

    sendLetter = {
        title: 'New Letter',
        custom_id: "newLetter",
        components: [
            {
                type: 1,
                components: [
                    {
                        type: 4,
                        custom_id: "username",
                        label: "Para quem é a carta?",
                        style: 1,
                        min_length: 2,
                        max_length: 37,
                        placeholder: "Nome, Nome#0000 ou ID",
                        required: true
                    }
                ]
            },
            {
                type: 1,
                components: [
                    {
                        type: 4,
                        custom_id: "anonymous",
                        label: "Está é um carta anonima?",
                        style: 1,
                        min_length: 3,
                        max_length: 3,
                        placeholder: "Sim | Não",
                        required: true
                    }
                ]
            },
            {
                type: 1,
                components: [
                    {
                        type: 4,
                        custom_id: "letterContent",
                        label: "Escreva sua carta",
                        style: 2,
                        min_length: 10,
                        max_length: 1024,
                        placeholder: "Em um dia, eu te vi na rua, foi quando...",
                        required: true
                    }
                ]
            }
        ]
    }

    reportLetter = {
        title: "Report Letter Content",
        custom_id: "lettersReport",
        components: [
            {
                type: 1,
                components: [
                    {
                        type: 4,
                        custom_id: "letterId",
                        label: "Informe o ID da carta",
                        style: 1,
                        max_length: 7,
                        max_length: 7,
                        placeholder: "ABC1234",
                        required: true
                    }
                ]
            },
            {
                type: 1,
                components: [
                    {
                        type: 4,
                        custom_id: "reason",
                        label: "Qual é o motivo da sua denúncia?",
                        style: 2,
                        min_length: 10,
                        max_length: 1024,
                        placeholder: "O autor da carta me xingou...",
                        required: true
                    }
                ]
            }
        ]
    }

    transactionsReport = {
        title: "Transactions Report Center",
        custom_id: "transactionsModalReport",
        components: [
            {
                type: 1,
                components: [
                    {
                        type: 4,
                        custom_id: "text",
                        label: "Explique o que aconteceu",
                        style: 2,
                        min_length: 10,
                        max_length: 1024,
                        placeholder: "Na data [xx/xx/xxxx xx:xx] está escrito undefined.",
                        required: true
                    }
                ]
            } // MAX: 5 Fields
        ]
    }

    editCollection = (collection) => {
        return {
            title: "Edit Reaction Role Collection",
            custom_id: collection.name,
            components: [
                {
                    type: 1,
                    components: [
                        {
                            type: 4,
                            custom_id: "name",
                            label: "Trocar o nome da coleção?",
                            style: 1,
                            min_length: 1,
                            max_length: 20,
                            placeholder: collection.name
                        }
                    ]
                },
                {
                    type: 1,
                    components: [
                        {
                            type: 4,
                            custom_id: "embedTitle",
                            label: "Título de apresentação",
                            style: 1,
                            min_length: 1,
                            max_length: 256,
                            placeholder: 'Nenhum título encontrado',
                            required: true,
                            value: collection.embedTitle || null
                        }
                    ]
                },
                {
                    type: 1,
                    components: [
                        {
                            type: 4,
                            custom_id: "uniqueSelection",
                            label: "Esta coleção pode entregar mais de 1 cargo?",
                            style: 1,
                            min_length: 3,
                            max_length: 3,
                            required: true,
                            value: collection.uniqueSelection ? 'não' : 'sim'
                        }
                    ]
                } // MAX: 5 Fields
            ]
        }
    }

    newCollection = {
        title: "New Reaction Roles Collection",
        custom_id: "newCollectionReactionRoles",
        components: [
            {
                type: 1,
                components: [
                    {
                        type: 4,
                        custom_id: "name",
                        label: "Qual o nome da sua nova coleção?",
                        style: 1,
                        min_length: 1,
                        max_length: 20,
                        placeholder: "Cores",
                        required: true
                    }
                ]
            }, // MAX: 5 Fields
            {
                type: 1,
                components: [
                    {
                        type: 4,
                        custom_id: "embedTitle",
                        label: "Título de apresentação",
                        style: 1,
                        min_length: 1,
                        max_length: 256,
                        placeholder: "Selecione a cor do seu nome",
                        required: true
                    }
                ]
            },
            {
                type: 1,
                components: [
                    {
                        type: 4,
                        custom_id: "uniqueSelection",
                        label: "Esta coleção pode entregar mais de 1 cargo?",
                        style: 1,
                        min_length: 3,
                        max_length: 3,
                        placeholder: "sim | não",
                        required: true
                    }
                ]
            } // MAX: 5 Fields
        ]
    }

    newReactionRoleCreate = {
        title: "Reaction Role Create",
        custom_id: "reactionRoleCreateModal",
        components: [
            {
                type: 1,
                components: [
                    {
                        type: 4,
                        custom_id: "roleData",
                        label: "ID ou nome exato do cargo",
                        style: 1,
                        min_length: 1,
                        max_length: 100,
                        placeholder: "123456789123456789 | Cor Azul | Viajante",
                        required: true
                    }
                ]
            },
            {
                type: 1,
                components: [
                    {
                        type: 4,
                        custom_id: "roleTitle",
                        label: "Título para o cargo",
                        style: 1,
                        min_length: 1,
                        max_length: 25,
                        placeholder: "Novidades e Notificações | Sorteios e Prêmios",
                        required: true
                    }
                ]
            },
            {
                type: 1,
                components: [
                    {
                        type: 4,
                        custom_id: "roleDescription",
                        label: "Descrição da Reaction Role",
                        style: 1,
                        max_length: 50,
                        placeholder: "Novidades e Notificações | Sorteios e Prêmios"
                    }
                ]
            }
        ]
    }

    reportBug = {
        title: "Bugs & Errors Reporting",
        custom_id: "BugModalReport",
        components: [
            {
                type: 1,
                components: [
                    {
                        type: 4,
                        custom_id: "commandBuggued",
                        label: "Qual é o comando/sistema?",
                        placeholder: "Balance, Giveaway, AFk, Hug...",
                        style: 1,
                        max_length: 50
                    }
                ]
            },
            {
                type: 1,
                components: [
                    {
                        type: 4,
                        custom_id: "bugTextInfo",
                        label: "O que aconteceu?",
                        style: 2,
                        min_length: 20,
                        max_length: 3900,
                        placeholder: "Quando tal recurso é usado acontece...",
                        required: true
                    }
                ]
            }
        ]
    }

    setNewStatus = {
        title: "Set Status Command",
        custom_id: "setStatusModal",
        components: [
            {
                type: 1,
                components: [
                    {
                        type: 4,
                        custom_id: "newStatus",
                        label: "Digite seu novo status",
                        style: 1,
                        min_length: 5,
                        max_length: 80,
                        placeholder: "No mundo da lua",
                        required: true
                    }
                ]
            }
        ]
    }

    editProfileModal = {
        title: "Edit Profile Information",
        custom_id: "editProfile",
        components: [
            {
                type: 1,
                components: [
                    {
                        type: 4,
                        custom_id: "profileJob",
                        label: "Qual sua profissão?",
                        style: 1,
                        min_length: 5,
                        max_length: 30,
                        placeholder: "Estoquista, Gamer, Terapeuta..."
                    }
                ]
            }, // MAX: 5 Fields
            {
                type: 1,
                components: [
                    {
                        type: 4,
                        custom_id: "profileBirth",
                        label: "Digite seu aniversário",
                        style: 2,
                        min_length: 10,
                        max_length: 10,
                        placeholder: "26/06/1999"
                    }
                ]
            },
            {
                type: 1,
                components: [
                    {
                        type: 4,
                        custom_id: "profileStatus",
                        label: "Digite seu novo status",
                        style: 2,
                        min_length: 5,
                        max_length: 100,
                        placeholder: "No mundo da lua..."
                    }
                ]
            }
        ]
    }

    editReactionRole = (roleData) => {
        return {
            title: "Edit Role in Reaction Role",
            custom_id: roleData.roleId,
            components: [
                {
                    type: 1,
                    components: [
                        {
                            type: 4,
                            custom_id: "roleTitle",
                            label: "Título do cargo",
                            style: 1,
                            min_length: 1,
                            max_length: 25,
                            placeholder: "Sem título",
                            required: true,
                            value: roleData.title || null
                        }
                    ]
                }, // MAX: 5 Fields
                {
                    type: 1,
                    components: [
                        {
                            type: 4,
                            custom_id: "roleDescription",
                            label: "Descrição do Cargo",
                            style: 1,
                            min_length: 0,
                            max_length: 50,
                            placeholder: "Escreva \"null\" para remover a descrição",
                            required: true,
                            value: roleData.description || null
                        }
                    ]
                }
            ]
        }

    }

}

module.exports = Modals