
const { readdirSync } = require("fs"),
    { MessageSelectMenu, MessageActionRow, MessageEmbed } = require("discord.js")

module.exports = {
    name: 'help',
    description: '[bot] Central de ajuda',
    dm_permission: false,
    type: 1,
    options: [
        {
            name: 'command',
            description: '[bot] Pesquise por um comando',
            type: 3
        }
    ],
    async execute({ interaction: interaction, client: client, database: Database, emojis: e, guildData: guildData, clientData: clientData }) {

        const { Config: config } = Database,
            prefix = guildData?.Prefix || client.prefix,
            { user, options } = interaction

        let command = options.getString('command')
        if (command) return HelpWithArgs(command)

        let SaphireInviteLink = `https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=applications.commands%20bot`,
            ghostServer = client.guilds.cache.get(config.ghostServerId),
            serverInvite = ghostServer ? ` ou quem sabe entrar na [${ghostServer.name}](${config.MoonServerLink}) para se divertir?` : '',
            PrincipalEmbed = new MessageEmbed()
                .setColor('#246FE0')
                .setTitle(`${e.BlueHeart} Centralzinha de Ajuda da ${client.user.username}`)
                .setURL(`${SaphireInviteLink}`)
                .setImage('https://media.discordapp.net/attachments/893361065084198954/939681589724598282/teste.png?width=720&height=223')
                .addField(`${e.Info} Perguntas frequentes`, `Está com alguma dúvida? \`${prefix}faq\``)
                .addField('🛰️ Global System Notification', `Ative o \`${prefix}logs\` no servidor e aproveite do meu sistema avançado de notificação. Eu vou te avisar desde os bans/kicks até Autoroles com permissões editadas.`)
                .addField(`${e.SaphireTimida} Saphire`, `Você pode [me adicionar](${SaphireInviteLink}) no seu servidor e também pode entrar no [meu servidor de suporte](${config.SupportServerLink}) pra tirar algumas dúvidas${serverInvite}`)
                .addField(`${e.CoroaDourada} Premium Stage`, `Tem interesse em desbloquear comandos únicos? Use \`${prefix}premium\` e descubra mais.`)
                .addField('🆕 Atualizações', 'Acesse a segunda aba do painel de ajuda e fique por dentro de tudo.')
                .addField(`${e.Stonks} New Reaction Role System`, `Siiiim! Agora eu possuo um sistema de Reaction Role! Vem dar uma olhada! \`${prefix}reactionrole\``)
                .addField(`⭐ Slash Commands`, `\`/giveaway\`, \`/reminder\`, \`/autorole\` entre outros comandos ganharam seus Slash Commands.`)
                .setFooter({ text: 'Este painel se fechará após 1 minuto de inatividade' }),

            painel = new MessageActionRow()
                .addComponents(new MessageSelectMenu()
                    .setCustomId('menu')
                    .setPlaceholder('Escolher uma categoria') // Mensagem estampada
                    .addOptions([
                        {
                            label: 'Painel Inicial',
                            description: 'Painel Principal',
                            emoji: `${e.BlueHeart}`,
                            value: 'PainelPrincipal',
                        },
                        {
                            label: 'Atualizações',
                            description: 'Atualizações que eu recebi',
                            emoji: '⭐',
                            value: 'att',
                        },
                        {
                            label: 'AFK',
                            description: 'Afk Global System',
                            emoji: `${e.Afk}`,
                            value: 'afk',
                        },
                        {
                            label: 'Admin',
                            description: 'Saphire\'s Team Administrator',
                            emoji: `${e.Admin}`,
                            value: 'admin',
                        },
                        {
                            label: 'Animes',
                            description: 'Todo mundo gosta de animes, não é?',
                            emoji: `${e.NezukoDance}`,
                            value: 'animes',
                        },
                        {
                            label: 'Bot, vulgo Eu',
                            description: 'Todos os comandos ligados a euzinha aqui',
                            emoji: `${e.Gear}`,
                            value: 'bot',
                        },
                        {
                            label: 'Configurações',
                            description: 'Comandos de configurações do servidor/usuário',
                            emoji: `${e.On}`,
                            value: 'config',
                        },
                        {
                            label: 'Economia 1',
                            description: 'Economy Global System',
                            emoji: `${e.PandaProfit}`,
                            value: 'economy',
                        },
                        {
                            label: 'Economia 2',
                            description: 'Economy Global System',
                            emoji: `${e.PandaProfit}`,
                            value: 'economy2',
                        },
                        {
                            label: 'Games/Jogos',
                            description: 'Que tal só se divertir?',
                            emoji: '🎮',
                            value: 'games',
                        },
                        {
                            label: 'Interação',
                            description: 'Interagir com os outros é muito legal',
                            emoji: '🫂',
                            value: 'interactions',
                        },
                        {
                            label: 'Pros Usuários',
                            description: 'Comandos dos usuários',
                            emoji: `${e.RedStar}`,
                            value: 'users',
                        },
                        {
                            label: 'Moderação/Administração 1',
                            description: 'Comandos só pros Mod/Adm de plantão',
                            emoji: `${e.ModShield}`,
                            value: 'moderation',
                        },
                        {
                            label: 'Moderação/Administração 2',
                            description: 'Comandos só pros Mod/Adm de plantão',
                            emoji: `${e.ModShield}`,
                            value: 'moderation2',
                        },
                        {
                            label: 'Desenvolvedor',
                            description: 'Comandos exclusivos do meu criador/desenvolvedor',
                            emoji: `${e.OwnerCrow}`,
                            value: 'owner',
                        },
                        {
                            label: 'Perfil',
                            description: 'Comandos do perfil pessoal de cada um',
                            emoji: '👤',
                            value: 'perfil',
                        },
                        {
                            label: 'Vip',
                            description: 'Sistema VIP',
                            emoji: `${e.VipStar}`,
                            value: 'vip'
                        },
                        {
                            label: 'Random',
                            description: 'Pensa numas coisas aleatórias',
                            emoji: `${e.CoolDoge}`,
                            value: 'random',
                        },
                        {
                            label: 'Reações/Emoções',
                            description: 'Mostre ao mundo como se sente',
                            emoji: '😁',
                            value: 'reactions',
                        },
                        {
                            label: 'Manipulação de Imagens',
                            description: 'Manipule imagens com os membros',
                            emoji: '🖼️',
                            value: 'images',
                        },
                        {
                            label: 'Servidor',
                            description: 'Comandos fechados só para o servidor',
                            emoji: `${e.PlanetServer}`,
                            value: 'servidor',
                        },
                        {
                            label: 'Utilidades',
                            description: 'Comandos uteis para qualquer um, garanto',
                            emoji: `${e.QuestionMark}`,
                            value: 'util',
                        },
                        {
                            label: 'Premium Stage',
                            description: 'Comandos exclusivos para Servidores Premium',
                            emoji: `${e.CoroaDourada}`,
                            value: 'premium',
                        },
                        {
                            label: 'Fechar o painel de ajuda',
                            description: 'Desativa o painel rápido',
                            emoji: `${e.Deny}`,
                            value: 'Close',
                        },
                    ])
                )

        const msg = await interaction.reply({
            embeds: [PrincipalEmbed],
            components: [painel],
            fetchReply: true
        }),
            collector = msg.createMessageComponentCollector({
                filtro: (int) => int.customId === 'menu' && int.user.id === user.id,
                idle: 60000
            })

                .on('collect', async (int) => {

                    let value = int.values[0]
                    int.deferUpdate().catch(() => { })

                    if (value === 'PainelPrincipal') return msg.edit({ embeds: [PrincipalEmbed], components: [painel] }).catch(() => { })
                    if (value === 'afk') return Afk()
                    if (value === 'att') return atualization()
                    if (value === 'Close') return collector.stop()

                    let values = await readdirSync('./src/commands/')

                    if (values.includes(value?.toLowerCase()))
                        return HelpPainel(`${value}`)

                    return await interaction.followUp({
                        content: `${e.QuestionMark} | Algo estranho aconteceu.`,
                        ephemeral: true
                    })

                    function Afk() {
                        return msg.edit({
                            embeds: [
                                {
                                    color: client.blue,
                                    title: `${e.Planet} Afk Global System`,
                                    description: 'Utilize este comando para avisar que você está offline.',
                                    fields: [
                                        {
                                            name: '🏠 Servidor',
                                            value: 'Avisarei apenas neste servidor que você está offline.'
                                        },
                                        {
                                            name: '🌎 Global',
                                            value: 'Avisarei em todos os servidores que você está offline.'
                                        },
                                        {
                                            name: '❌ Cancelar',
                                            value: 'Cancela o comando.'
                                        },
                                        {
                                            name: `${e.Warn} | Atenção!`,
                                            value: '> 1. O \`Modo Global\` é desativado quando você mandar uma mensagem em qualquer servidor comigo.\n> 2. O \`Modo Servidor\` será desativado apenas se você mandar mensagem no servidor em que o sistema foi ativado.\n> 3. O \`Modo Global\` sobre põe o modo local.'
                                        }
                                    ]
                                }
                            ],
                            components: [painel]
                        }).catch(() => { })
                    }

                    async function HelpPainel(x) {

                        let cots = [],
                            catts = [],
                            cmdsBlocked = clientData?.ComandosBloqueados || [],
                            formatedBlock = cmdsBlocked.map(data => data.cmd)?.flat() || []

                        readdirSync("./src/commands/").forEach(dir => {
                            if (dir.toLowerCase() !== x.toLowerCase()) return
                            const commands = readdirSync(`./src/commands/${dir}/`).filter(file => file.endsWith(".js"))

                            const cmds = commands.map(command => {
                                let file = require(`../../commands/${dir}/${command}`),
                                    name = file.name?.replace(".js", ""),
                                    des = client.commands.get(name)?.description || "Sem descrição",
                                    emo = client.commands.get(name)?.emoji || 'X',
                                    format = `\`${prefix}${name}\``,
                                    correctNameByAlias = formatedBlock.map(data => client.aliases.get(`${data}`))

                                if (correctNameByAlias.includes(name)) {
                                    emo = '🔒'
                                    des = 'Comando bloqueado pelo meu criador ou por algum bug.'
                                }

                                if (!name) {
                                    emo = '🔴'
                                    format = '\`Comando indisponível\`'
                                    des = '---------------------------------'
                                }

                                return { cname: `${emo || '❔'} ${format}`, des: des }
                            })
                            cmds.map(co => catts.push({ name: `${cmds.length === 0 ? "Em andamento." : co.cname}`, value: co.des }))

                            cots.push(dir.toLowerCase())
                        })

                        if (cots.includes(x.toLowerCase()))
                            return msg.edit({
                                embeds: [
                                    {
                                        color: client.blue,
                                        title: `Classe: ${x.charAt(0).toUpperCase() + x.slice(1)}`,
                                        description: `Use \`${prefix}help [comando]\` para obter mais informações.`,
                                        fields: catts
                                    }
                                ],
                                components: [painel]
                            }).catch(() => { })

                        return msg.edit({
                            content: `${e.Deny} | Nada foi encontrado.`,
                            embeds: []
                        }).catch(() => { })
                    }

                    function atualization() {
                        return msg.edit({
                            embeds: [
                                {
                                    color: client.blue,
                                    title: `⭐ Notas da Última Atualização`,
                                    description: `Aqui ficam informações da última atualização que eu recebi. Caso queria ver as atualizações antigas, acesse [meu servidor](${config.SupportServerLink}).`,
                                    fields: [

                                        {
                                            name: `🆕 Reaction Role`,
                                            value: `Meu novo sistema de reaction role. Você pode ativa-lo usando \`${prefix}reactionrole\` ou apenas \`${prefix}rr\``
                                        },
                                        {
                                            name: `🆕 Comando Quiz | ${prefix}quiz`,
                                            value: 'Rework e novo modo *Anime Theme*'
                                        },
                                        {
                                            name: '📝 Modals & ⭐ Slash Commands',
                                            value: `Alguns comandos receberam seus adicionais: \`${prefix}reminder | ${prefix}bug | ${prefix}giveaway\` foram uns deles`
                                        },
                                        {
                                            name: '🆕 Auto Lembrete',
                                            value: `Alguns comandos receberam um botão com um ⏰. Ao clicar neste relógio, a ${client.user} vai te avisar assim que o timeout do comando acabar.\nAlguns deles foram o \`${prefix}daily\` & \`${prefix}bitcoin\``
                                        },
                                        {
                                            name: '⭐ Slash Commands',
                                            value: 'O Slash Command está começando a crescer nos sistemas da Saphire. Que tal dar uma olhada? Utilize \`/\`.'
                                        },
                                        {
                                            name: '⛔ Remoção',
                                            value: `\`${prefix}forca\` -> Movido para Slash Command \`/forca\``
                                        },
                                        {
                                            name: `${e.bug} Bugs`,
                                            value: `RASPADINHA - Multiple Channels Interactions - ${e.Check} Fixed | \`22/05/2022\``
                                        }
                                    ]
                                }],
                            components: [painel]
                        }).catch(() => { })
                    }

                })

                .on('end', () => {

                    let embed = msg.embeds[0]
                    if (!embed) return
                    embed.color = client.red
                    embed.footer = { text: 'Comando cancelado.' }

                    return msg.edit({ embeds: [embed], components: [] }).catch(() => { })
                })

        async function HelpWithArgs(x) {
            const command = client.commands.get(x.toLowerCase()) || client.commands.find((c) => c.aliases && c.aliases.includes(x.toLowerCase()))
            if (!command) return await interaction.reply({
                content: `${e.Deny} | Comando inválido! Use \`${prefix}help\` para todos os comandos.`,
                ephemeral: true
            })

            return await interaction.reply({
                embeds: [
                    {
                        color: client.blue,
                        title: `Detalhes do Comando: ${command.name ? `${command.name}` : "Sem nome definido."}`,
                        fields: [
                            {
                                name: 'Comando:',
                                value: command.name ? `\`${prefix}${command.name}\`` : "Sem nome definido.",
                                inline: true
                            },
                            {
                                name: 'Atalhos',
                                value: command.aliases ? `${command.aliases?.map(data => `\`${prefix}${data}\``)?.join(', ')}` : "Sem atalhos definido.",
                                inline: true
                            },
                            {
                                name: 'Uso',
                                value: command.usage ? `\`${command.usage}\`` : 'Nenhum dado definido'
                            },
                            {
                                name: 'Descrição',
                                value: command.description ? command.description : "Sem descrição definida"
                            }
                        ]
                    }
                ]
            })
        }

        return

    }
}