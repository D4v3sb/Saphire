module.exports = {
    name: 'admin',
    description: '[administration] Comandos privados para meus administradores',
    dm_permission: false,
    type: 1,
    options: [
        {
            name: 'add',
            description: '[administration] Adicionar valores',
            type: 1,
            options: [
                {
                    name: 'function',
                    description: '[add] Função a ser executada',
                    type: 3,
                    required: true,
                    choices: [
                        {
                            name: 'Balance',
                            value: 'money'
                        },
                        {
                            name: 'Bônus',
                            value: 'bonus'
                        },
                        {
                            name: 'Experience',
                            value: 'xp'
                        },
                        {
                            name: 'Level',
                            value: 'level'
                        },
                        {
                            name: 'Likes',
                            value: 'likes'
                        },
                        {
                            name: 'Bits de Bitcoins',
                            value: 'bits'
                        }
                    ]
                },
                {
                    name: 'quantity',
                    description: '[add] Valor a ser adicionado',
                    type: 4,
                    required: true
                },
                {
                    name: 'mention',
                    description: '[add] By Mention',
                    type: 6,
                },
                {
                    name: 'id',
                    description: '[add] By Id',
                    type: 3,
                }
            ]
        },
        {
            name: 'subtract',
            description: '[administration] Subtrair valores',
            type: 1,
            options: [
                {
                    name: 'function',
                    description: '[remove] Função a ser executada',
                    type: 3,
                    required: true,
                    choices: [
                        {
                            name: 'Balance',
                            value: 'subtract_money'
                        },
                        {
                            name: 'Experience',
                            value: 'subtract_xp'
                        },
                        {
                            name: 'Level',
                            value: 'subtract_level'
                        },
                        {
                            name: 'Likes',
                            value: 'subtract_Likes'
                        }
                    ]
                },
                {
                    name: 'quantity',
                    description: '[remove] Valor a ser removido',
                    type: 4,
                    required: true
                },
                {
                    name: 'mention',
                    description: '[remove] By Mention',
                    type: 6,
                },
                {
                    name: 'id',
                    description: '[remove] By Id',
                    type: 3,
                }
            ]
        },
        {
            name: 'set',
            description: '[administration] Definir valores',
            type: 1,
            options: [
                {
                    name: 'function',
                    description: '[set] Função a ser executada',
                    type: 3,
                    required: true,
                    choices: [
                        {
                            name: 'Developer',
                            value: 'developer'
                        },
                        {
                            name: 'Administrator',
                            value: 'adm'
                        },
                        {
                            name: 'Moderator',
                            value: 'mod'
                        },
                        {
                            name: 'Designer',
                            value: 'designer'
                        },
                        {
                            name: 'Title Halloween',
                            value: 'halloween'
                        },
                        {
                            name: 'Title Bug Hunter',
                            value: 'bughunter'
                        },
                        {
                            name: 'Acess to Level Backgrounds',
                            value: 'bgacess'
                        },
                        {
                            name: 'Estrela 1',
                            value: 'estrela1'
                        },
                        {
                            name: 'Estrela 2',
                            value: 'estrela2'
                        },
                        {
                            name: 'Estrela 3',
                            value: 'estrela3'
                        },
                        {
                            name: 'Estrela 4',
                            value: 'estrela4'
                        },
                        {
                            name: 'Estrela 5',
                            value: 'estrela5'
                        },
                        {
                            name: 'Estrela 6',
                            value: 'estrela6'
                        },
                        {
                            name: 'Level',
                            value: 'levelSet'
                        },
                        {
                            name: 'Experience',
                            value: 'xpSet'
                        }
                    ]
                },
                {
                    name: 'mention',
                    description: '[set] By Mention',
                    type: 6,
                },
                {
                    name: 'id',
                    description: '[set] By Id',
                    type: 3,
                },
                {
                    name: 'quantity',
                    description: '[set] Quantidade a ser configurada',
                    type: 4,
                }
            ]
        },
        {
            name: 'remove',
            description: '[administration] Remover valores',
            type: 1,
            options: [
                {
                    name: 'function',
                    description: '[remove] Função a ser executada',
                    type: 3,
                    required: true,
                    choices: [
                        {
                            name: 'Developer',
                            value: 'developerRemove'
                        },
                        {
                            name: 'Administrator',
                            value: 'admRemove'
                        },
                        {
                            name: 'Moderator',
                            value: 'modRemove'
                        },
                        {
                            name: 'Designer',
                            value: 'designerRemove'
                        },
                        {
                            name: 'Title Bug Hunter',
                            value: 'bughunterRemove'
                        },
                        {
                            name: 'Title Halloween',
                            value: 'halloweenRemove'
                        },
                        {
                            name: 'Acess to Levels Backgrounds',
                            value: 'bgacessRemove'
                        },
                        {
                            name: 'Servers',
                            value: 'serversRemove'
                        },
                        {
                            name: 'Blacklist',
                            value: 'blacklistRemove'
                        },
                        {
                            name: 'Estrela 1',
                            value: 'estrelaRemove1'
                        },
                        {
                            name: 'Estrela 2',
                            value: 'estrelaRemove2'
                        },
                        {
                            name: 'Estrela 3',
                            value: 'estrelaRemove3'
                        },
                        {
                            name: 'Estrela 4',
                            value: 'estrelaRemove4'
                        },
                        {
                            name: 'Estrela 5',
                            value: 'estrelaRemove5'
                        },
                        {
                            name: 'Estrela 6',
                            value: 'estrelaRemove6'
                        }
                    ]
                },
                {
                    name: 'quantity',
                    description: '[remove] Valor a ser removido',
                    type: 4
                },
                {
                    name: 'mention',
                    description: '[remove] By Mention',
                    type: 6,
                },
                {
                    name: 'id',
                    description: '[remove] By Id',
                    type: 3,
                }
            ]
        },
        {
            name: 'delete',
            description: '[administration] Deletar valores',
            type: 1,
            options: [
                {
                    name: 'function',
                    description: '[delete] Função a ser executada',
                    type: 3,
                    required: true,
                    choices: [
                        {
                            name: 'Log Register',
                            value: 'logregisterDelete'
                        },
                        {
                            name: 'Cache Data',
                            value: 'cacheDelete'
                        },
                        {
                            name: 'Balance',
                            value: 'moneyDelete'
                        },
                        {
                            name: 'Usuário',
                            value: 'userDelete'
                        },
                        {
                            name: 'Timeouts',
                            value: 'timeoutDelete'
                        },
                        {
                            name: 'Perfil',
                            value: 'profileDelete'
                        },
                        {
                            name: 'Clan',
                            value: 'clanDelete'
                        },
                        {
                            name: 'Vip',
                            value: 'vipDelete'
                        },
                        {
                            name: 'Bits de Bitcoins',
                            value: 'bitsDelete'
                        }
                    ]
                },
                {
                    name: 'mention',
                    description: '[delete] By Mention',
                    type: 6,
                },
                {
                    name: 'id',
                    description: '[delete] By Id',
                    type: 3,
                }
            ]
        },
        {
            name: 'options',
            description: '[administration] Outras opções',
            type: 1,
            options: [
                {
                    name: 'function',
                    description: '[delete] Função a ser executada',
                    type: 3,
                    required: true,
                    choices: [
                        {
                            name: 'Console Log',
                            value: 'terminal'
                        },
                        {
                            name: 'Host Bot Status',
                            value: 'stats'
                        },
                        {
                            name: 'Reboot',
                            value: 'reboot'
                        }
                    ]
                },
                {
                    name: 'input',
                    description: 'Informações adicionais',
                    type: 3
                }
            ]
        }
    ],
    async execute({ interaction: interaction, client: client, database: Database, emojis: e, clientData: clientData }) {

        const { options } = interaction
        const { Config: config } = Database
        const adms = clientData?.Administradores || []

        if (!adms.includes(interaction.user.id) && interaction.user.id !== config.ownerId)
            return await interaction.reply({
                content: `${e.OwnerCrow} | Este é um comando privado para os meus administradores.`,
                ephemeral: true
            })

        let func = options.getString('function')
        let id = options.getString('id')
        let user = client.users.cache.get(id) || options.getUser('mention')
        let amount = options.getInteger('quantity')

        if (!user && !['serversRemove', 'logregisterDelete', 'cacheDelete', 'clanDelete', 'terminal', 'stats', 'reboot'].includes(func))
            return await interaction.reply({
                content: `${e.Deny} | Nenhum usuário encontrado.`,
                ephemeral: true
            })

        if (func.includes('estrelaRemove')) return delete_estrela()
        if (func.includes('estrela')) return set_estrela()

        switch (func) {
            case 'money': add_Money(); break;
            case 'bonus': add_Bonus(); break;
            case 'xp': add_Xp(); break;
            case 'level': add_Level(); break;
            case 'bits': add_Bits(); break;
            case 'likes': add_Likes(); break;

            case 'subtract_money': subtract_Money(); break;
            case 'subtract_xp': subtract_Xp(); break;
            case 'subtract_level': subtract_Level(); break;
            case 'subtract_Likes': subtract_Likes(); break;

            case 'adm': set_Administrator(); break;
            case 'mod': set_Moderator(); break;
            case 'halloween': set_Halloween(); break;
            case 'bughunter': set_Bughunter(); break;
            case 'bgacess': set_BgAcess(); break;
            case 'developer': set_Developer(); break;
            case 'designer': set_Designer(); break;
            case 'levelSet': set_Level(); break;
            case 'xpSet': set_Xp(); break;

            case 'admRemove': remove_Administrator(); break;
            case 'modRemove': remove_Moderator(); break;
            case 'bughunterRemove': remove_Bughunter(); break;
            case 'bgacessRemove': remove_BgAcess(); break;
            case 'halloweenRemove': remove_Halloween(); break;
            case 'developerRemove': remove_Developer(); break;
            case 'designerRemove': remove_Designer(); break;
            case 'serversRemove': remove_Servers(); break;
            case 'blacklistRemove': remove_Blacklist(); break;

            case 'logregisterDelete': delete_Logregister(); break;
            case 'cacheDelete': delete_Cache(); break;
            case 'userDelete': delete_User(); break;
            case 'profileDelete': delete_Profile(); break;
            case 'timeoutDelete': delete_Timeout(); break;
            case 'vipDelete': delete_Vip(); break;
            case 'clanDelete': delete_Clan(); break;
            case 'bitsDelete': delete_Bits(); break;
            case 'moneyDelete': delete_Money(); break;

            case 'terminal': get_terminal(); break;
            case 'stats': get_stats(); break;
            case 'reboot': reboot(); break;

            default: await interaction.reply({
                content: `${e.Deny} | **${func}** | Não é um argumento válido.`,
                ephemeral: true
            }); break;
        }

        async function delete_Money() {

            await Database.User.updateOne(
                { id: user.id },
                {
                    $unset: {
                        Balance: 1,
                        Transactions: 1
                    }
                }
            )

            Database.PushTransaction(
                user.id,
                `${e.Admin} Teve seus dados econômicos deletados por um Administrador`
            )
            return await interaction.reply({
                content: `${e.Check} | Os dados econônicos de **${user.tag} \`${user.id}\`** foram deletados com sucesso.`,
                ephemeral: true
            })

        }

        async function get_terminal() {

            const axios = require('axios')

            await interaction.deferReply({}),
                terminal = (await axios.get(`https://discloud.app/api/v2/app/912509487984812043/logs`, {
                    headers: { "api-token": process.env.DISCLOUD_API_TOKEN }
                })).data

            return await interaction.editReply({
                content: `${e.Check} Tudo certo!`,
                embeds: [
                    {
                        color: client.blue,
                        title: `${e.Reference} Discloud Logs ${terminal.bot_id}`,
                        url: terminal.link,
                        description: `\`\`\`txt\n${terminal.logs}\`\`\``
                    }
                ]
            })


        }

        async function subtract_Likes() {
            Database.addItem(user.id, 'Likes', -amount)
            return await interaction.reply({
                content: `${e.RedStar} | ${amount} likes foram removidos de ${user.tag}.`,
                ephemeral: true
            })
        }

        async function get_stats() {

            const axios = require('axios')

            await interaction.deferReply({}),
                info = (await axios.get(`https://discloud.app/api/v2/app/912509487984812043`, {
                    headers: {
                        "api-token": process.env.DISCLOUD_API_TOKEN
                    }
                })).data,
                user = (await axios.get('https://discloud.app/api/v2/user', {
                    headers: {
                        "api-token": process.env.DISCLOUD_API_TOKEN
                    }
                })).data

            return await interaction.editReply({
                embeds: [
                    {
                        color: client.blue,
                        title: 'Discloud Host Information',
                        fields: [
                            {
                                name: `${e.SaphireOk} Bot Stats`,
                                value: `**Bot:** \`${client.users.cache.get(info?.bot_id)?.tag || "Não encontrado"}\` \`${info?.bot_id || 'Indefinido'}\`\n**Plano:** \`${user.plan}\``
                            },
                            {
                                name: `${e.Commands} Plan End date`,
                                value: `\`${new Date(user.planDataEnd).toLocaleString('pt-br', { timeZone: 'America/Sao_Paulo' })}\``
                            },
                            {
                                name: `${e.PlanetServer} Container`,
                                value: `\`${info.container === 'Online' ? `🟢 Online` : `🔴 Offline`}\``
                            },
                            {
                                name: `${e.Download} Cpu Usage`,
                                value: `\`${info.cpu}\``
                            },
                            {
                                name: `${e.Obs} Ram Memory Usage`,
                                value: `\`${info.memory}\``
                            },
                            {
                                name: `${e.PlanetServer} Last Discloud Restart`,
                                value: `\`${info.last_restart?.replace(/a few seconds/g, 'A alguns segundos').replace(/a minute/g, 'Menos de um minuto').replace(/minutes/g, 'minutos').replace(/hours/g, 'horas').replace(/days/g, 'dias').replace(/a day/g, 'Por volta de um dia').replace(/an hour/g, '+/- 1 hora')}\``
                            }
                        ]
                    }
                ]
            }).catch(() => { })
        }

        async function reboot() {

            const reason = options.getString('input')
            const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

            const msg = await interaction.reply({
                content: `${e.Loading} | Iniciando reboot...`,
                fetchReply: true
            })

            await Database.Client.updateOne(
                { id: client.user.id },
                {
                    Rebooting: {
                        ON: true,
                        Features: reason || 'Nenhum dado fornecido.',
                        ChannelId: interaction.channel.id,
                        MessageId: msg.id
                    },
                    'Lotery.Close': true
                }
            )

            fetch(`https://discloud.app/api/v2/app/912509487984812043/restart`, {
                method: 'POST',
                headers: {
                    "api-token": process.env.DISCLOUD_API_TOKEN
                }
            })
                .then(info => info.json())
                .then(async json => {

                    if (json.status === 'error') {

                        await Database.Client.updateOne(
                            { id: client.user.id },
                            {
                                $unset: {
                                    Rebooting: 1,
                                    'Lotery.Close': 1
                                }
                            }
                        )

                        msg.edit({
                            content: `${e.Deny} | Não foi possível iniciar o reboot.\n${e.Warn} | Error Message: \`${json.message}\``
                        }).catch(() => { })
                        return
                    }
                })
        }

        async function set_estrela() {

            let estrelaData = {}

            switch (func) {
                case 'estrela1': estrelaData = {
                    route: 'Perfil.Estrela.Um',
                    userResponse: '1º Estrela',
                    number: 'Um'
                }; break;
                case 'estrela2': estrelaData = {
                    route: 'Perfil.Estrela.Dois',
                    userResponse: '2º Estrela',
                    number: 'Dois'
                }; break;
                case 'estrela3': estrelaData = {
                    route: 'Perfil.Estrela.Tres',
                    userResponse: '3º Estrela',
                    number: 'Tres'
                }; break;
                case 'estrela4': estrelaData = {
                    route: 'Perfil.Estrela.Quatro',
                    userResponse: '4º Estrela',
                    number: 'Quatro'
                }; break;
                case 'estrela5': estrelaData = {
                    route: 'Perfil.Estrela.Cinco',
                    userResponse: '5º Estrela',
                    number: 'Cinco'
                }; break;
                case 'estrela6': estrelaData = {
                    route: 'Perfil.Estrela.Seis',
                    userResponse: '6º Estrela',
                    number: 'Seis'
                }; break;
            }

            let get = await Database.User.findOne({ id: user.id }, estrelaData.route)

            if (!get) return await interaction.reply({
                content: `${e.Database} | DATABASE | Usuário não encontrado.`,
                ephemeral: true
            })

            let data = get.Perfil?.Estrela[estrelaData.number]

            if (data)
                return await interaction.reply({
                    content: `${e.Info} | ${user.username} já tem a ${estrelaData.userResponse}.`,
                    ephemeral: true
                })

            Database.updateUserData(user.id, estrelaData.route, true)

            return await interaction.reply({
                content: `${e.Check} | ${user.username} agora possui a **${estrelaData.userResponse}**.`,
                ephemeral: true
            })
        }

        async function set_Level() {

            if (!amount)
                return await interaction.reply({
                    content: `${e.Deny} | Informar um valor válido`,
                    ephemeral: true
                })

            Database.updateUserData(user.id, 'Level', amount)
            return await interaction.reply({
                content: `${e.Check} | O level de **${user.tag} \`${user.id}\`** foi reconfigurado para ${amount}`,
                ephemeral: true
            })
        }

        async function delete_Bits() {
            Database.delete(user.id, 'Perfil.Bits')
            return await interaction.reply({
                content: `${e.Check} | Os bits de ${user} foram deletados.`
            })
        }

        async function delete_Clan() {

            if (!id)
                return await interaction.reply({
                    content: `${e.Info} | Forneça um Clan-KeyCode para a exclução.`,
                    ephemeral: true
                })

            let clan = await Database.Clan.findOne({ id: id })

            if (!clan)
                return await interaction.reply({
                    content: `${e.Deny} | Este clan não existe.`,
                    ephemeral: true
                })

            Database.Clan.deleteOne({ id: id })
            return await interaction.reply({
                content: `${e.Check} | O clan ${clan.Name || '**Nome não encontrado**'} foi deletado com sucesso!`,
                ephemeral: true
            })
        }

        async function set_Xp() {

            if (!amount && amount !== 0)
                return await interaction.reply({
                    content: `${e.Deny} | Informar um valor válido`,
                    ephemeral: true
                })

            Database.updateUserData(user.id, 'Xp', amount)
            return await interaction.reply({
                content: `${e.Check} | A experiência de **${user.tag} \`${user.id}\`** foi reconfigurado para ${amount}`,
                ephemeral: true
            })
        }

        async function delete_estrela() {

            let estrelaData = {}

            switch (func) {
                case 'estrelaRemove1': estrelaData = {
                    route: 'Perfil.Estrela.Um',
                    userResponse: '1º Estrela',
                    number: 'Um'
                }; break;
                case 'estrelaRemove2': estrelaData = {
                    route: 'Perfil.Estrela.Dois',
                    userResponse: '2º Estrela',
                    number: 'Dois'
                }; break;
                case 'estrelaRemove3': estrelaData = {
                    route: 'Perfil.Estrela.Tres',
                    userResponse: '3º Estrela',
                    number: 'Tres'
                }; break;
                case 'estrelaRemove4': estrelaData = {
                    route: 'Perfil.Estrela.Quatro',
                    userResponse: '4º Estrela',
                    number: 'Quatro'
                }; break;
                case 'estrelaRemove5': estrelaData = {
                    route: 'Perfil.Estrela.Cinco',
                    userResponse: '5º Estrela',
                    number: 'Cinco'
                }; break;
                case 'estrelaRemove6': estrelaData = {
                    route: 'Perfil.Estrela.Seis',
                    userResponse: '6º Estrela',
                    number: 'Seis'
                }; break;
            }

            let get = await Database.User.findOne({ id: user.id }, estrelaData.route)

            if (!get) return await interaction.reply({
                content: `${e.Database} | DATABASE | Usuário não encontrado.`,
                ephemeral: true
            })

            let data = get.Perfil?.Estrela[estrelaData.number]

            if (!data)
                return await interaction.reply({
                    content: `${e.Info} | ${user.username} não possui a ${estrelaData.userResponse}.`,
                    ephemeral: true
                })

            Database.delete(user.id, estrelaData.route)

            return await interaction.reply({
                content: `${e.Check} | ${user.username} não possui mais a **${estrelaData.userResponse}**.`,
                ephemeral: true
            })
        }

        async function delete_User() {

            let u = await Database.User.findOne({ id: user.id })

            if (!u)
                return await interaction.reply({
                    content: `${e.Info} | Este usuário não existe na minha database.`,
                    ephemeral: true
                })

            Database.deleteUser(user.id)
            return await interaction.reply({
                content: `${e.Check} | Todos os dados de ${user?.tag || '**Usuário não encontrado**'} foram deletados.`,
                ephemeral: true
            })
        }

        async function delete_Profile() {
            Database.delete(user.id, 'Perfil')
            return await interaction.reply({
                content: `${e.Check} | O perfil de ${user.tag} foi deletado com sucesso!`,
                ephemeral: true
            })
        }

        async function delete_Vip() {

            const Vip = require('../../../modules/functions/public/vip')
            let isVip = await Vip(user.id)

            if (!isVip)
                return await interaction.reply({
                    content: `${e.Deny} | Este usuário não é vip.`,
                    ephemeral: true
                })

            Database.delete(user.id, 'Vip')
            return await interaction.reply({
                content: `${e.Check} | O vip de ${user} foi deletado.`,
                ephemeral: true
            })
        }

        async function delete_Timeout() {
            Database.delete(user.id, 'Timeouts')
            return await interaction.reply({
                content: `${e.Check} | Todos os timeouts de ${user.tag} foram deletados com sucesso!`,
                ephemeral: true
            })
        }

        async function remove_Blacklist() {

            let blacklist = clientData.Blacklist?.Users || []

            if (!blacklist.includes(user.id))
                return await interaction.reply({
                    content: `${e.Deny} | Este usuário **${user.tag} \`${user.id}\`** não se encontra na blacklist.`,
                    ephemeral: true
                })

            await Database.Client.updateOne(
                { id: client.user.id },
                { $pull: { 'Blacklist.Users': user.id } }
            )

            return await interaction.reply({
                content: `${e.Check} | O usuário **${user.tag} \`${user.id}\`** foi removido blacklist.`,
                ephemeral: true
            })
        }

        async function set_Halloween() {

            let data = clientData.Titles?.Halloween || []

            if (data.includes(user.id))
                return await interaction.reply({
                    content: `${e.Info} | ${user.tag} já possui o título **🎃 Halloween 2021**`,
                    ephemeral: true
                })

            await Database.Client.updateOne(
                { id: client.user.id },
                { $push: { 'Titles.Halloween': user.id } }
            )

            return await interaction.reply({
                content: `${e.Check} | ${user.username} agora possui o título **🎃 Halloween 2021**!`,
                ephemeral: true
            })
        }

        async function remove_Halloween() {

            let data = clientData.Titles?.Halloween || []

            if (!data.includes(user.id))
                return await interaction.reply({
                    content: `${e.Info} | ${user.tag} não possui o título **🎃 Halloween 2021**`,
                    ephemeral: true
                })

            await Database.Client.updateOne(
                { id: client.user.id },
                { $pull: { 'Titles.Halloween': user.id } }
            )

            return await interaction.reply({
                content: `${e.Check} | ${user.username} não possui mais o título **🎃 Halloween 2021**!`,
                ephemeral: true
            })
        }

        async function delete_Logregister() {
            await Database.LogRegister.remove({})
            return await interaction.reply({
                content: `${e.Check} | LogRegister excluído com sucesso!`
            })
        }

        async function delete_Cache() {
            await Database.Cache.clear({})
            return await interaction.reply({
                content: `${e.Check} | Cache excluído com sucesso!`
            })
        }

        async function remove_Servers() {
            let servers = 0, leaved = 0

            await interaction.deferReply()

            await client.guilds.cache.forEach(g => {
                servers++
                if (g.members.cache.size <= amount && !['980891407659196567', '888464632291917956', '882475447387054081'].includes(g.id)) {
                    leaved++
                    g.leave().catch(() => { })
                }
            })

            return await interaction.editReply(`${e.Check} | Eu saí de **${leaved}/${servers} servidores** que tinham menos de **${amount} membros.**`).catch(() => { })
        }

        async function add_Level() {
            Database.addItem(user.id, 'Level', amount)
            return await interaction.reply({
                content: `${e.RedStar} | ${amount} níveis foram adicionados a ${user.tag}.`,
                ephemeral: true
            })
        }

        async function add_Bits() {
            Database.addItem(user.id, 'Perfil.Bits', amount)
            return await interaction.reply({
                content: `${e.RedStar} | ${amount} bits foram adicionados a ${user.tag}.`,
                ephemeral: true
            })
        }

        async function add_Likes() {
            Database.addItem(user.id, 'Likes', amount)
            return await interaction.reply({
                content: `${e.RedStar} | ${amount} likes foram adicionados a ${user.tag}.`,
                ephemeral: true
            })
        }

        async function set_Designer() {

            let dataUsers = clientData.Titles?.OfficialDesigner || []

            if (dataUsers.includes(user.id))
                return await interaction.reply({
                    content: `${e.Info} | ${user.username} já é um Designer Official & Emojis Productor.`,
                    ephemeral: true
                })

            await Database.Client.updateOne(
                { id: client.user.id },
                { $push: { 'Titles.OfficialDesigner': user.id } }
            )

            return await interaction.reply({
                content: `${e.Check} | ${user.username} agora é um Designer Official & Emojis Productor`,
                ephemeral: true
            })
        }

        async function remove_Designer() {

            let dataUsers = clientData.Titles?.OfficialDesigner || []

            if (!dataUsers.includes(user.id))
                return await interaction.reply({
                    content: `${e.Info} | ${user.username} não é um Designer Official.`,
                    ephemeral: true
                })

            await Database.Client.updateOne(
                { id: client.user.id },
                { $pull: { 'Titles.OfficialDesigner': user.id } }
            )

            return await interaction.reply({
                content: `${e.Check} | ${user.username} não é mais é um Designer Official & Emojis Productor`,
                ephemeral: true
            })
        }

        async function subtract_Level() {
            Database.addItem(user.id, 'Level', -amount)
            return await interaction.reply({
                content: `${e.RedStar} | ${amount} níveis foram removidos de ${user.tag}.`,
                ephemeral: true
            })
        }

        async function subtract_Xp() {
            Database.addItem(user.id, 'Xp', -amount)
            return await interaction.reply({
                content: `${e.RedStar} | ${amount} experiências foram removidas de ${user.tag}.`,
                ephemeral: true
            })
        }

        async function set_BgAcess() {

            let bgData = clientData.BackgroundAcess || []

            if (bgData.includes(user.id))
                return await interaction.reply({
                    content: `${e.Info} | ${user.username} já possui acesso aos background.`,
                    ephemetral: true
                })

            await Database.Client.updateOne(
                { id: client.user.id },
                { $push: { BackgroundAcess: user.id } }
            )

            return await interaction.reply({
                content: `${e.Check} | ${user.username} Agora possui acesso livre aos backgrounds.`,
                ephemetral: true
            })
        }

        async function remove_BgAcess() {

            let bgData = clientData.BackgroundAcess || []

            if (!bgData.includes(user.id))
                return interaction.reply({
                    content: `${e.Info} | ${user.username} já possui acesso aos background.`,
                    ephemeral: true
                })

            await Database.Client.updateOne(
                { id: client.user.id },
                { $pull: { BackgroundAcess: user.id } }
            )

            return interaction.reply({
                content: `${e.Info} | ${user.username} não possui mais acesso aos background.`,
                ephemeral: true
            })
        }

        async function set_Developer() {

            let dataUsers = clientData.Titles?.Developer || []

            if (dataUsers.includes(user.id))
                return await interaction.reply({
                    content: `${e.Info} | ${user.username} já é um Developer.`,
                    ephemeral: true
                })

            await Database.Client.updateOne(
                { id: client.user.id },
                { $push: { 'Titles.Developer': user.id } }
            )

            return await interaction.reply({
                content: `${e.Check} | ${user.username} agora é um Developer!`,
                ephemeral: true
            })
        }

        async function remove_Developer() {

            let dataUsers = clientData.Titles?.Developer || []

            if (!dataUsers.includes(user.id))
                return await interaction.reply({
                    content: `${e.Info} | ${user.username} não é um Developer.`,
                    ephemeral: true
                })

            await Database.Client.updateOne(
                { id: client.user.id },
                { $pull: { 'Titles.Developer': user.id } }
            )

            return await interaction.reply({
                content: `${e.Check} | ${user.username} não é mais é um Developer.`,
                ephemeral: true
            })
        }

        async function add_Xp() {
            Database.addItem(user.id, 'Xp', amount)
            return await interaction.reply({
                content: `${e.RedStar} | ${amount} experiências foram adicionadas a ${user.tag}.`,
                ephemeral: true
            })
        }

        async function set_Administrator() {

            if (interaction.user.id !== config.ownerId)
                return await interaction.reply({
                    content: `${e.Deny} | Recurso privado ao meu desenvolvedor.`,
                    ephemeral: true
                })

            if (adms.includes(user.id))
                return await interaction.reply({
                    content: `${e.Deny} | ${user.tag} já é um administrador.`,
                    ephemeral: true
                })

            await Database.Client.updateOne(
                { id: client.user.id },
                { $push: { Administradores: user.id } },
                { upsert: true }
            )

            user.send(`Parabéns! Você agora é um **${e.Admin} Official Administrator** do meu sistema.`).catch(() => { })
            return await interaction.reply({
                content: `${e.Check} | **${user.username} *\`${user.id}\`*** agora é um ${e.Admin} Administrador*(a)*.`,
                ephemeral: true
            })

        }

        async function remove_Administrator() {

            if (!adms.includes(user.id))
                return await interaction.reply({
                    content: `${e.Deny} | ${user.tag} não é um administrador.`,
                    ephemeral: true
                })

            await Database.Client.updateOne(
                { id: client.user.id },
                { $pull: { Administradores: user.id } },
                { upsert: true }
            )

            return await interaction.reply({
                content: `${e.Check} | **${user.username} *\`${user.id}\`*** foi removido do cargo ${e.Admin} Administrador.`,
                ephemeral: true
            })

        }

        async function remove_Moderator() {

            let mods = clientData?.Moderadores || []

            if (!mods.includes(user.id))
                return await interaction.reply({
                    content: `${e.Deny} | ${user.tag} não é um moderador.`,
                    ephemeral: true
                })

            await Database.Client.updateOne(
                { id: client.user.id },
                { $pull: { Moderadores: user.id } },
                { upsert: true }
            )

            return await interaction.reply({
                content: `${e.Check} | **${user.username} *\`${user.id}\`*** foi removido do cargo ${e.Admin} Moderador.`,
                ephemeral: true
            })

        }

        async function set_Moderator() {

            let mods = clientData?.Moderadores || []

            if (mods.includes(user.id))
                return await interaction.reply({
                    content: `${e.Deny} | ${user.tag} já é um moderador.`,
                    ephemeral: true
                })

            await Database.Client.updateOne(
                { id: client.user.id },
                { $push: { Moderadores: user.id } },
                { upsert: true }
            )

            return await interaction.reply({
                content: `${e.Check} | **${user.username} *\`${user.id}\`*** agora é um ${e.Admin} Moderador*(a)*.`,
                ephemeral: true
            })

        }

        async function remove_Bughunter() {

            let dataUsers = clientData.Titles?.BugHunter || []

            if (!dataUsers.includes(user.id))
                return await interaction.reply({
                    content: `${e.Info} | ${user.username} não é um Bug Hunter.`,
                    ephemeral: true
                })

            await Database.Client.updateOne(
                { id: client.user.id },
                { $pull: { 'Titles.BugHunter': user.id } }
            )

            return await interaction.reply({
                content: `${e.Check} | ${user.tag} \`${user.id}\` não é mais é um Bug Hunter.`,
                ephemeral: true
            })
        }
        async function set_Bughunter() {

            let dataUsers = clientData.Titles?.BugHunter || []

            if (dataUsers.includes(user.id))
                return await interaction.reply({
                    content: `${e.Info} | ${user.username} já é um Bug Hunter.`,
                    ephemeral: true
                })

            await Database.Client.updateOne(
                { id: client.user.id },
                { $push: { 'Titles.BugHunter': user.id } }
            )

            return await interaction.reply({
                content: `${e.Check} | ${user.tag} \`${user.id}\` agora é um Bug Hunter.`,
                ephemeral: true
            })
        }

        async function subtract_Money() {
            Database.add(user.id, -amount)
            Database.PushTransaction(user.id, `${e.Admin} Remoção de ${amount} Safiras por um Administrador`)
            return await interaction.reply({
                content: `${e.Coin} | ${amount} Safiras foram removidas de ${user.tag}.`,
                ephemeral: true
            })
        }

        async function add_Money() {
            Database.add(user.id, amount)
            Database.PushTransaction(user.id, `${e.Admin} Recebeu ${amount} Safiras de um Administrador`)
            return await interaction.reply({
                content: `${e.Coin} | ${amount} Safiras foram adicionados a ${user.tag}.`,
                ephemeral: true
            })
        }

        async function add_Bonus() {
            Database.add(user.id, amount)
            user.send(`${e.SaphireFeliz} | Você recebeu um bônus de **${amount} ${moeda}**. Parabéns!`).catch(() => { })
            return await interaction.reply({
                content: `${e.Check} | Bônus de ${amount} ${e.Coin} Safiras foram entregues a ${user.tag}.`,
                ephemeral: true
            })
        }

        return
    }
}