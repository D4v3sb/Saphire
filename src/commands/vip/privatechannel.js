const { DatabaseObj: { e, config } } = require('../../../modules/functions/plugins/database'),
    { Permissions } = require('discord.js'),
    Error = require('../../../modules/functions/config/errors'),
    Colors = require('../../../modules/functions/plugins/colors'),
    Vip = require('../../../modules/functions/public/vip')

module.exports = {
    name: 'privatechannel',
    aliases: ['canalprivado'],
    category: 'vip',
    ClientPermissions: ['MANAGE_CHANNELS'],
    emoji: `${e.VipStar}`,
    usage: '<privatechannel> [info]',
    description: 'Crie um canal privado só pra você no meu servidor principal',

    run: async (client, message, args, prefix, MessageEmbed, Database) => {

        if (message.guild.id !== config.guildId)
            return message.reply(`${e.Deny} | Este é um comando privado do meu servidor principal. Você pode entrar se quiser.\n${config.ServerLink}`)

        let vip = await Vip(message.author.id)

        if (!vip) return message.reply(`${e.Deny} | Este comando é exclusivos para VIP's. Para saber mais, use \`${prefix}vip\``)

        let data = await Database.User.findOne({ id: message.author.id }, 'PrivateChannel')

        let CanalAtual = data.PrivateChannel?.Channel,
            CanalServer = message.guild.channels.cache.get(CanalAtual),
            DataUsers = data.PrivateChannel?.Users || []
        user = message.mentions.members.first() || message.mentions.repliedUser || message.guild.members.cache.get(args[1])

        if (CanalAtual && !CanalServer)
            Database.delete(message.author.id, 'PrivateChannel')

        if (['delete', 'deletar', 'excluir', 'fechar', 'apagar'].includes(args[0]?.toLowerCase()))
            return DeleteChannel()

        if (['add', 'addfriend', 'adicionar'].includes(args[0]?.toLowerCase()))
            return AddFriend()

        if (['edit', 'editar', 'nome', 'name'].includes(args[0]?.toLowerCase()))
            return EditChannelName()

        if (['rem', 'removefriend', 'remover', 'tirar', 'delfriend', 'remove'].includes(args[0]?.toLowerCase()))
            return RemoveFriend()

        if (['friends', 'amigos', 'users', 'membros'].includes(args[0]?.toLowerCase()))
            return FriendChannelList()

        if (['removeall', 'delall'].includes(args[0]?.toLowerCase()))
            return RemoveAll()

        if (['help', 'info', 'ajuda'].includes(args[0]?.toLowerCase()))
            return PrivateChannelInfo()

        return NewChannelVip()

        async function EditChannelName() {

            if (!CanalServer)
                return message.reply(`${e.Deny} | Você não possui um canal privado. Crie um e depois tente usar este comando novamente.`)

            let NomeDoCanal = args.slice(1).join(' ')

            if (!NomeDoCanal)
                return message.reply(`${e.Info} | Você pode editar o nome do seu canal privado neste comando.\n\`${prefix}privatechannel edit <novo nome do canal>\``)

            if (NomeDoCanal.length > 40)
                return message.reply(`${e.Deny} | O nome do canal não pode ultrapassar 40 caracteres.`)

            CanalServer.setName(NomeDoCanal, [`Author: ${message.author.tag}`]).then(NewName => {
                return message.reply(`${e.Check} | Canal renomeado para **${NewName}**`)
            }).catch(err => { return message.channel.send(`${e.Deny} | Ocorreu um erro ao trocar o nome do canal.\n\`${err}\``) })

        }

        async function NewChannelVip() {

            if (CanalServer)
                return message.reply(`${e.Deny} | Você já tem um canal aberto no servidor: ${CanalServer}`)

            let NomeDoCanal = args.join(' ') || message.author.tag
            if (NomeDoCanal.length > 40)
                return message.reply(`${e.Deny} | O nome do canal não pode ultrapassar 40 caracteres.`)

            await message.guild.channels.create(NomeDoCanal, {
                type: 'GUILD_TEXT',
                topic: `${message.author.id}`,
                parent: '898749174814769182',
                reason: `Canal criado por: ${message.author.tag}`,
                permissionOverwrites: [
                    {
                        id: message.guild.id,
                        deny: [Permissions.FLAGS.VIEW_CHANNEL],
                    },
                    {
                        id: message.author.id,
                        allow: [Permissions.FLAGS.VIEW_CHANNEL, Permissions.FLAGS.SEND_MESSAGES, Permissions.FLAGS.ATTACH_FILES, Permissions.FLAGS.EMBED_LINKS, Permissions.FLAGS.MANAGE_MESSAGES],
                    },
                ]
            }).then(channel => {
                Database.updateUserData(message.author.id, 'PrivateChannel.Channel', channel.id)
                channel.send(`${message.author}, este é o seu canal privado. Para excluir ele, use o comando \`${prefix}privatechannel delete\``)
                return message.reply(`${e.Check} | O seu canal privado foi criado com sucesso! ${channel}`)
            }).catch(err => {
                Error(message, err)
                return message.channel.send(`${e.Deny} | Ocorreu um erro ao criar o canal.\n\`${err}\``)
            })
        }

        async function DeleteChannel() {

            if (!CanalAtual)
                return message.reply(`${e.Deny} | Você não tem nenhum canal privado aberto.`)

            const msg = await message.reply(`${e.QuestionMark} | Você tem certeza em deletar o seu canal privado? Tudo salvo nele será apagado.`)

            msg.react('✅').catch(() => { }) // Check
            msg.react('❌').catch(() => { }) // X

            return msg.awaitReactions({
                filter: (reaction, user) => ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id,
                max: 1,
                time: 15000,
                errors: ['time']
            }).then(collected => {
                const reaction = collected.first()

                if (reaction.emoji.name === '✅') {

                    Database.delete(message.author.id, 'PrivateChannel.Channel')
                    CanalServer.delete().then(() => {
                        return message.reply(`${e.Check} | O canal foi deletado com sucesso!`).catch(() => { })
                    }).catch(err => {
                        return message.channel.send(`${e.Deny} | Não foi possível deletar o canal.\n\`${err}\``)
                    })

                }

                return msg.edit(`${e.Deny} | Comando cancelado.`).catch(() => { })
            }).catch(() => msg.edit(`${e.Deny} | Comando cancelado por tempo expirado.`).catch(() => { }))

        }

        async function AddFriend() {

            if (!CanalServer)
                return message.reply(`${e.Deny} | Você não tem nenhum canal privado.`)

            if (DataUsers.length >= 5)
                return message.reply(`${e.Deny} | O número limite de participantes neste canal é de 5 membros (fora o criador e administradores do servidor).`)

            if (!user)
                return message.reply(`${e.Deny} | Você precisa me dizer quem você quer adicionar no canal.`)

            if (DataUsers.includes(user.id))
                return message.reply(`${e.Deny} | Este usuário já está no seu canal privado.`)

            await Database.User.updateOne(
                { id: message.author.id },
                { $push: { 'PrivateChannel.Users': user.id } }
            )

            CanalServer.permissionOverwrites.create(user, {
                SEND_MESSAGES: true,
                VIEW_CHANNEL: true,
                ATTACH_FILES: true,
                EMBED_LINKS: true,
                MANAGE_MESSAGES: true
            })
            CanalServer.send(`${user}, você foi adicionado ao canal privado de ${message.author}.`).catch(() => { })
            return message.reply(`${e.Check} | ${user} foi adicionado ao seu canal privado. Para remover, use \`${prefix}privatechannel remove @user\``)
        }

        async function RemoveFriend() {

            if (!CanalServer)
                return message.reply(`${e.Deny} | Você não tem nenhum canal privado.`)

            if (!user)
                return message.reply(`${e.Deny} | Você precisa me dizer quem você quer remover do canal.`)

            if (!DataUsers.includes(user.id))
                return message.reply(`${e.Deny} | Este usuário não está no seu canal privado.`)

            await Database.User.updateOne(
                { id: message.author.id },
                { $pull: { 'PrivateChannel.Users': user.id } }
            )

            CanalServer.permissionOverwrites.delete(user)
            return message.reply(`${e.Check} | ${user} foi removido do seu canal privado.`)

        }

        async function RemoveAll() {

            if (!CanalServer)
                return message.reply(`${e.Deny} | Você não tem nenhum canal privado.`)

            let users = CanalServer.members

            try {
                users.forEach(User => {
                    if (User.id !== message.author.id)
                        CanalServer.permissionOverwrites.delete(User)
                })
            } catch (err) {
                return message.channel.send(`${e.Warn} | Houve um erro ao retirar todos os membros do canal privado.\n\`${err}\``).catch(() => { })
            }

            return message.reply(`${e.Check} | Todos os membros *(exceto administradores)* foram removidos do seu canal privado.`)
        }

        async function PrivateChannelInfo() {

            let color = await Colors(message.author.id)

            return message.reply(
                {
                    embeds: [
                        new MessageEmbed()
                            .setColor(color)
                            .setTitle(`${e.VipStar} Canal Privado`)
                            .setDescription('Este comando te permite criar um canal só pra você')
                            .addFields(
                                {
                                    name: '🔒 Bloqueio',
                                    value: 'Exclusivo para VIP\'s'
                                },
                                {
                                    name: 'Crie o canal',
                                    value: `\`${prefix}privatechannel [Nome do Canal](opicional)\``
                                },
                                {
                                    name: 'Delete o canal',
                                    value: `\`${prefix}privatechannel delete\``
                                },
                                {
                                    name: 'Edite o nome do canal',
                                    value: `\`${prefix}privatechannel edit <Novo Nome>\``
                                },
                                {
                                    name: 'Adicione amigos',
                                    value: `\`${prefix}privatechannel add <@amigo/ID>\``
                                },
                                {
                                    name: 'Remova amigos do canal',
                                    value: `\`${prefix}privatechannel remove <@amigo>\``
                                },
                                {
                                    name: 'Remova todos',
                                    value: `\`${prefix}privatechannel removeall\``
                                },
                                {
                                    name: 'Observações',
                                    value: 'Todos os comandos podem ser usados fora do canal privado. O sistema de busca da Saphire vai detectar o seu canal (se houver um)\n \nAdministradores são imunes ao bloqueio e terão acesso ao seu canal, porém, os canais da categoria VIP são silenciados e os administradores irão ignora-los..'
                                }
                            )
                            .setFooter(`${client.user.username} Vip System`)
                    ]
                }
            )
        }
    }
}