const Database = require('./Database'),
    { Emojis: e, Config: config } = Database,
    { eightyYears, Now, getUser, day } = require('../functions/plugins/eventPlugins'),
    passCode = require('../functions/plugins/PassCode'),
    Modals = require('./Modals')

class ModalInteraction extends Modals {
    constructor(interaction, client) {
        super()
        this.interaction = interaction
        this.client = client
        this.customId = interaction.customId
        this.fields = interaction.fields
        this.user = interaction.user
        this.guild = interaction.guild
        this.channel = interaction.channel
        this.data = {}
    }

    submitModalFunctions = async () => {

        const guildData = await Database.Guild.findOne({ id: this.guild.id }, 'Prefix ReactionRole')

        this.prefix = guildData?.Prefix || this.client.prefix
        this.member = this.guild.members.cache.get(this.user.id)

        const flags = Database.Flags.get('Flags') || []
        if (flags.find(data => data.country[0] === this.customId)) return this.editFlag(this)

        if (guildData?.ReactionRole?.find(d => d.name === this.customId)) return this.newCollectionReactionRoles()
        if (this.customId.length === 18 && !isNaN(this.customId)) return this.editRoleInReactionRole()

        switch (this.customId) {
            case 'setStatusModal': this.setStatusModal(this); break;
            case 'BugModalReport': this.BugModalReport(this); break;
            case 'editProfile': this.editProfile(this); break;
            case 'newLetter': this.newLetter(this); break;
            case 'newReminder': this.newReminder(this); break;
            case 'lettersReport': this.lettersReport(this); break;
            case 'reactionRoleCreateModal': this.reactionRoleCreateModal(this); break;
            case 'transactionsModalReport': this.transactionsModalReport(); break;
            case 'newCollectionReactionRoles': this.newCollectionReactionRoles(); break;
            case 'newAnimeCharacter': this.addCharacter(); break;
            case 'newFlagCreate': this.newFlagCreate(); break;
            default:
                break;
        }

        return
    }

    editProfile = async ({ interaction, fields, user } = this) => {

        let data = await Database.User.findOne({ id: user.id }, 'Perfil'),
            moment = require('moment'), title = undefined,
            job = fields.getTextInputValue('profileJob'),
            status = fields.getTextInputValue('profileStatus'),
            birth = fields.getTextInputValue('profileBirth'),
            msg = 'ℹ | Validação concluída. Resultado:'

        if (data?.Perfil?.TitlePerm)
            title = fields.getTextInputValue('profileTitle')

        if (title && title !== data?.Perfil?.Titulo) {
            msg += '\n✅ | Título'
            Database.updateUserData(user.id, 'Perfil.Titulo', title)
        } else msg += '\n❌ | Título'

        if (job && job !== data?.Perfil?.Trabalho) {
            msg += '\n✅ | Trabalho'
            Database.updateUserData(user.id, 'Perfil.Trabalho', job)
        } else msg += '\n❌ | Trabalho'

        if (birth && birth !== data?.Profile?.Aniversario) {

            const date = moment(birth, "DDMMYYYY"),
                formatedData = date.locale('BR').format('L')

            if (!date.isValid() || date.isBefore(eightyYears()) || date.isAfter(Now())) {
                msg += '\n❌ | Aniversário'
            } else {
                msg += '\n✅ | Aniversário'
                Database.updateUserData(user.id, 'Perfil.Aniversario', formatedData)
            }

        } else msg += '\n❌ | Aniversário'

        if (status && status !== data?.Perfil?.Status) {
            msg += '\n✅ | Status'
            Database.updateUserData(user.id, 'Perfil.Status', status)
        } else msg += '\n❌ | Status'


        return await interaction.reply({
            content: msg,
            ephemeral: true
        })

    }

    newFlagCreate = async ({ interaction, fields, user } = this) => {

        const flags = Database.Flags.get('Flags') || []
        let flag = fields.getTextInputValue('flag')
        let image = fields.getTextInputValue('image')
        let countryName = fields.getTextInputValue('country')
        let syn = fields.getTextInputValue('country1')
        let syn2 = fields.getTextInputValue('country2')

        if (!image.includes('https://media.discordapp.net/attachments'))
            return await interaction.reply({
                content: `${e.Deny} | Verique se o link da imagem segue com esse formato: \`https://media.discordapp.net/attachments\``,
                ephemeral: true
            })


        let has = flags?.find(data => {

            for (let c of data.country)
                if (
                    c.toLowerCase() === countryName?.toLowerCase()
                    || c.toLowerCase() === syn?.toLowerCase()
                    || c.toLowerCase() === syn2?.toLowerCase()
                )
                    return true

            return data.flag == flag || data.image === image
        })

        if (has)
            return await interaction.reply({
                content: `${e.Deny} | Algum dado presente no formulário já pertence a uma bandeira.`,
                ephemeral: true
            })

        let msg = await interaction.reply({
            content: `${e.QuestionMark} | Você confirma adicionar essa bandeira no banco de dados do Flag Game?\n"**${flag} - ${countryName}**"\n${image}`,
            fetchReply: true
        }),
            emojis = ['✅', '❌']

        for (let i of emojis) msg.react(i).catch(() => { })
        let collector = msg.createReactionCollector({
            filter: (r, u) => emojis.includes(r.emoji.name) && u.id === user.id,
            time: 60000,
            max: 1,
            erros: ['time', 'max']
        })
            .on('collect', async (r) => {

                if (r.emoji.name === emojis[1]) {
                    await interaction.editReply({
                        content: `${e.Deny} | Comando cancelado.`
                    })
                    return collector.stop()
                }
                let countries = [countryName]
                if (syn) countries.push(syn)
                if (syn2) countries.push(syn2)
                Database.Flags.push('Flags', { flag: flag, country: [...countries], image: image })
                return await interaction.editReply(`${e.Check} | A bandeira "**${flag} - ${countryName}**" foi adicionada com sucesso!\n${image}`).catch(() => { })
            })
            .on('end', async (i, r) => {
                if (r !== 'user') return
                return await interaction.editReply({ content: `${e.Deny} | Comando cancelado.` }).catch(() => { })
            })
    }

    editFlag = async ({ interaction, fields, client, user } = this) => {

        const flags = [...Database.Flags.get('Flags')]
        const flagEmoji = fields.getTextInputValue('flag')
        const flag = flags.find(data => data.country[0] == this.customId)
        const image = fields.getTextInputValue('image')
        const flagIndex = flags.findIndex(data => data.country[0] === this.customId)
        const editedItens = []
        console.log(flag)
        if (!image.includes('https://media.discordapp.net/attachments'))
            return await interaction.reply({
                content: `${e.Deny} | O link fornecido não segue os padrões necessários. Verifique se o padrão segue este: \`https://media.discordapp.net/attachments\``,
                ephemeral: true
            })

        if (flag.image !== image) editedItens.push('Imagem')
        if (flag.flag !== flagEmoji) editedItens.push('Emoji')

        if (editedItens.length === 0)
            return await interaction.reply({
                content: `${e.Info} | Nenhuma informação foi alterada.`,
                ephemeral: true
            })

        flags.splice(flagIndex, 1)

        if (flags.find(data => data.flag == flagEmoji || data.image == image))
            return await interaction.reply({
                content: `${e.Info} | Alguma informação passada já pertence a uma bandeira presente no banco de dados.`,
                ephemeral: true
            })

        const buttons = {
            type: 1,
            components: [
                {
                    type: 2,
                    label: 'EFETUAR EDIÇÃO',
                    custom_id: 'true',
                    style: 'SUCCESS'
                },
                {
                    type: 2,
                    label: 'CANCELAR EDIÇÃO',
                    custom_id: 'false',
                    style: 'DANGER'
                }
            ]
        }

        const msg = await interaction.reply({
            content: `${e.QuestionMark} | Efetuar edição da bandeira \`${flag.country[0]}\`?`,
            embeds: [{
                color: client.blue,
                title: `${e.Database} | Edição de bandeira`,
                description: `Itens editados: \`${editedItens.join(', ')}\`\nDados anteriores: Emoji: ${flag.flag}\nDados pós alteração: Emoji: ${flagEmoji}`,
                image: { url: image || null }
            }],
            components: [buttons],
            fetchReply: true
        })

        const collector = msg.createMessageComponentCollector({
            filter: int => int.user.id === user.id,
            max: 1,
            time: 60000,
            errors: ['max', 'time']
        })
            .on('collect', async int => {

                const { customId } = int
                int.deferUpdate().catch(() => { })

                if (customId === 'false') return collector.stop()

                Database.Flags.set('Flags', [{ flag: flagEmoji, country: [...flag.country], image: image }, ...flags])
                const embed = msg.embeds[0] || {}
                embed.color = client.green
                embed.title = `${e.Check} | Alteração realizada com sucesso.`
                return await interaction.editReply({
                    content: null,
                    embeds: [embed],
                    components: []
                })
            })
            .on('end', async (i, r) => {
                if (['time', 'user'].includes(r))
                    return await interaction.editReply({
                        content: `${e.Deny} | Comando cancelado.`,
                        embeds: [], components: []
                    })
                return
            })
    }

    async newReminder({ interaction, client, fields, user, channel } = this) {

        const moment = require('moment')
        const time = fields.getTextInputValue('time')
        const dataInfo = fields.getTextInputValue('dataInfo')

        let Args = time.trim().split(/ +/g),
            DefinedTime = 0

        if (Args[0].includes('/') || Args[0].includes(':') || ['hoje', 'today', 'tomorrow', 'amanhã'].includes(Args[0]?.toLowerCase())) {

            let data = Args[0],
                hour = Args[1]

            if (['tomorrow', 'amanhã'].includes(data.toLowerCase()))
                data = day(true)

            if (['hoje', 'today'].includes(data.toLowerCase()))
                data = day()

            if (!hour && data.includes(':') && data.length <= 5) {
                data = day()
                hour = Args[0]
            }

            if (data.includes('/') && data.length === 10 && !hour)
                hour = '12:00'

            if (!data || !hour)
                return await interaction.reply({
                    content: `${e.Deny} | A data informada não é a correta.`,
                    embeds: [{ color: client.blue, title: 'Reminder Content', description: dataInfo }],
                    ephemeral: true
                })

            let dataArray = data.split('/'),
                hourArray = hour.split(':'),
                dia = parseInt(dataArray[0]),
                mes = parseInt(dataArray[1]) - 1,
                ano = parseInt(dataArray[2]),
                hora = parseInt(hourArray[0]),
                minutos = parseInt(hourArray[1]),
                segundos = parseInt(hourArray[2]) || 0

            let date = moment.tz({ day: dia, month: mes, year: ano, hour: hora, minutes: minutos, seconds: segundos }, "America/Sao_Paulo")

            if (!date.isValid()) {
                return await interaction.reply({
                    content: `${e.Deny} | A data informada não é a válida.`,
                    embeds: [{ color: client.blue, title: 'Reminder Content', description: dataInfo }],
                    ephemeral: true
                })
            }

            date = date.valueOf()

            if (date < Date.now())
                return await interaction.reply({
                    content: `${e.Deny} | A data informada é do passado.`,
                    embeds: [{ color: client.blue, title: 'Reminder Content', description: dataInfo }],
                    ephemeral: true
                })

            DefinedTime += date - Date.now()

        } else {

            for (let arg of Args) {

                if (arg.slice(-1).includes('d')) {
                    let time = arg.replace(/d/g, '000') * 60 * 60 * 24
                    if (isNaN(time)) return cancelReminder()
                    DefinedTime += parseInt(time)
                    continue
                }

                if (arg.slice(-1).includes('h')) {
                    let time = arg.replace(/h/g, '000') * 60 * 60
                    if (isNaN(time)) return cancelReminder()
                    DefinedTime += parseInt(time)
                    continue
                }

                if (arg.slice(-1).includes('m')) {
                    let time = arg.replace(/m/g, '000') * 60
                    if (isNaN(time)) return cancelReminder()
                    DefinedTime += parseInt(time)
                    continue
                }

                if (arg.slice(-1).includes('s')) {
                    let time = arg.replace(/s/g, '000')
                    if (isNaN(time)) return cancelReminder()
                    DefinedTime += parseInt(time)
                    continue
                }

                return cancelReminder()
            }
        }

        if (DefinedTime < 3000 || DefinedTime > 1262304000000)
            return await interaction.reply({
                content: '❌ | O tempo definido deve estar dentro de 3 segundos e 40 anos.',
                embeds: [{ color: client.blue, title: 'Reminder Content', description: dataInfo }],
                ephemeral: true
            })

        CreateNewReminder(dataInfo, DefinedTime)

        async function cancelReminder() {
            return await interaction.reply({
                content: '❌ | Data inválida! Verifique se a data esta realmente correta.',
                embeds: [{ color: client.blue, title: 'Reminder Content', description: dataInfo }],
                ephemeral: true
            })
        }

        async function CreateNewReminder(ReminderMessage, DefinedTime) {

            const ReminderCode = passCode(7).toUpperCase(),
                Data = require('../../modules/functions/plugins/data')

            new Database.Reminder({
                id: ReminderCode,
                userId: user.id,
                RemindMessage: ReminderMessage,
                Time: DefinedTime,
                DateNow: Date.now(),
                ChannelId: channel.id
            }).save()

            return await interaction.reply({
                content: `✅ | Tudo bem! Eu vou te lembrar em **${Data(DefinedTime)}** daqui **${client.GetTimeout(DefinedTime, 0, false)}**`,
                embeds: [{ color: client.blue, title: 'Reminder Content', description: dataInfo }],
                ephemeral: true
            }).catch(() => { })
        }

    }

    setStatusModal = async ({ interaction, fields, user } = this) => {

        const newStatus = fields.getTextInputValue('newStatus')

        if (!newStatus)
            return await interaction.reply({
                content: '❌ | Não foi possível verificar o seu novo status.',
                ephemeral: true
            })

        Database.updateUserData(user.id, 'Perfil.Status', newStatus)
        return await interaction.reply({
            content: `✅ | Novo status definido com sucesso!\n📝 | ${newStatus}`,
            ephemeral: true
        })
    }

    addCharacter = async ({ interaction, fields, client } = this) => {

        let characters = Database.Characters.get('Characters') || [],
            image = fields.getTextInputValue('image'),
            name = fields.getTextInputValue('name'),
            anime = fields.getTextInputValue('anime')

        if (!image.includes('https://media.discordapp.net/attachments') && !image.includes('https://cdn.discordapp.com/attachments/'))
            return await interaction.reply({
                content: `${e.Deny} | Verique se o link da imagem segue um desses formatos: \`https://media.discordapp.net/attachments\` | \`https://cdn.discordapp.com/attachments/\``,
                ephemeral: true
            })

        let has = characters?.find(data => data.image == image)

        if (has)
            return await interaction.reply({
                content: `${e.Deny} | Esta mesma imagem já existe no banco de dados.`,
                ephemeral: true
            })

        const { formatString } = require('../../src/commands/games/plugins/gamePlugins')
        let msg = await interaction.reply({
            content: `${e.QuestionMark} | Você confirma adicionar o personagem **\`${formatString(name)}\`** do anime \`${anime}\` no banco de dados do **Quiz Anime Theme**?`,
            embeds: [{
                color: client.blue,
                image: { url: image || null },
                description: 'Se a imagem do personagem não aparecer, quer dizer que o link não é compatível.'
            }],
            fetchReply: true
        }),
            emojis = ['✅', '❌'], clicked = false

        for (let i of emojis) msg.react(i).catch(() => { })
        let collector = msg.createReactionCollector({
            filter: (reaction, user) => emojis.includes(reaction.emoji.name) && user.id === interaction.user.id,
            time: 60000,
            max: 1,
            erros: ['time', 'max']
        })
            .on('collect', (r) => {

                if (r.emoji.name === emojis[1])
                    return collector.stop()

                return this.pushNewCaracter(msg, { name: name, image: image, anime: anime }, formatString)

            })
            .on('end', (i, r) => {
                if (r !== 'user') return
                return msg.edit({ content: `${e.Deny} | Comando cancelado.`, embeds: [] }).catch(() => { })
            })
    }

    async pushNewCaracter(msg, { name: name, image: image, anime: anime }, formatString) {

        Database.Characters.push('Characters', { name: name, image: image, anime: anime })
        return msg.edit({
            content: `${e.Check} | Personagem adicionado com sucesso!`,
            embeds: [{
                color: this.client.blue,
                image: { url: image || null },
                description: `Nome: **\`${formatString(name)}\`**\nAnime: **\`${anime || '\`ANIME NOT FOUND\`'}\`**`
            }]
        }).catch(() => { })
    }

    reactionRoleCreateModal = async ({ interaction, fields, user, channel, guild } = this) => {

        const roleData = fields.getTextInputValue('roleData'),
            title = fields.getTextInputValue('roleTitle'),
            description = fields.getTextInputValue('roleDescription'),
            role = guild.roles.cache.find(role => role.id === roleData || role.name?.toLowerCase() === roleData?.toLowerCase()),
            guildData = await Database.Guild.findOne({ id: guild.id }, 'ReactionRole'),
            roleArray = guildData?.ReactionRole || []

        if (!role)
            return await interaction.reply({
                content: `❌ | Não existe nenhum cargo no servidor com o ID ou nome fornecido: \`${roleData}\`.\n \n> Não sabe pegar o ID do cargo? Olhe esse tópico do suporte do Discord: https://support.discord.com/hc/pt-br/articles/206346498-Onde-posso-encontrar-minhas-IDs-de-Usu%C3%A1rio-Servidor-Mensagem-`,
                ephemeral: true
            })

        let overRole = role.comparePositionTo(this.member.roles.highest) > -1 && guild.ownerId !== user.id

        if (overRole)
            return await interaction.reply({
                content: `❌ |  O cargo ${role} é superior ao seu cargo mais alto, portanto você não tem acesso a ele.`,
                ephemeral: true
            })

        for (let collection of roleArray)
            if (collection?.rolesData?.find(data => data.roleId === role.id))
                return await interaction.reply({
                    content: `❌ | O cargo ${role} já foi configurado como reaction role.`
                })

        if (!role.editable)
            return await interaction.reply({
                content: `❌ | Eu não consigo adicionar o cargo ${role} por entrar acima de mim no ranking de cargos. Suba meu cargo para cima dele que tudo dará certo.`
            })

        const RolePermissions = role?.permissions.toArray() || [],
            BlockPermissionsArray = ['KICK_MEMBERS', 'BAN_MEMBERS', 'MANAGE_GUILD', 'MANAGE_MESSAGES', 'MUTE_MEMBERS', 'DEAFEN_MEMBERS', 'MOVE_MEMBERS', 'MANAGE_NICKNAMES', 'MANAGE_ROLES', 'ADMINISTRATOR', 'MODERATE_MEMBERS']

        for (const perm of RolePermissions)
            if (BlockPermissionsArray.includes(perm))
                return await interaction.reply({
                    content: `❌ | O cargo ${role} possui a permissão **${config.Perms[perm]}** ativada. Não vou prosseguir com a adição deste cargo, isso pode prejudicar o seu servidor.`
                })

        this.data.title = title
        this.data.description = description
        this.data.role = role

        await interaction.reply({ content: '✅ | Tudo certo! Agora é hora de escolher qual o emoji do Reaction Role!', ephemeral: true })
        let msg = await channel.send({
            content: `${e.Loading} | Qual emoji você quer para este cargo?\n> **\`Reaja nesta mensagem com um emoji do Discord ou DESTE SERVIDOR.\`**\n> *Clique no ❌ caso não queria nenhum emoji.*`
        }), collected = false
        msg.react('❌').catch(() => { })

        let collector = msg.createReactionCollector({
            filter: (r, u) => u.id === user.id,
            time: 120000,
            errors: ['time']
        })
            .on('collect', (reaction) => {

                let { emoji } = reaction

                if (emoji.name === '❌') return this.chooseColletion(null, msg, roleArray)

                let emojiData = emoji.id || emoji.name

                if (emoji.id && !guild.emojis.cache.get(emoji.id))
                    return msg.edit(`${msg.content}\n \n❌ | Este emoji não pertence a este servidor. Por favor, escolha um emoji deste servidor ou do Discord.`)

                collected = true
                collector.stop()
                return this.chooseColletion(emojiData, msg, roleArray)
            })
            .on('end', () => {
                if (collected) return
                return msg.edit(`${e.Deny} | Criação do Reaction Role cancelado por falta de respota.`).catch(() => { })
            })
    }

    registerReactionRole = async (emoji = null, msg, collectionName) => {
        msg.reactions.removeAll().catch(() => { })

        let { role, title, description } = this.data

        let objData = { roleId: role.id, title: title }

        if (emoji)
            objData.emoji = emoji

        if (description)
            objData.description = description

        await Database.Guild.updateOne(
            { id: this.guild.id, ['ReactionRole.name']: collectionName },
            { $push: { [`ReactionRole.$.rolesData`]: objData } }
        )

        let data = await Database.Guild.findOne({ id: this.guild.id }, 'ReactionRole'),
            collections = data.ReactionRole || [],
            count = 0, collectionsCount = collections.length

        for (let collection of collections)
            count += collection?.rolesData?.length || 0

        return msg.edit({
            content: `${e.Check} | O cargo ${role} foi adicionado com sucesso na coleção **${collectionName}**!\n${e.Info} | Para executar o novo reaction role, use o comando \`${this.prefix}reactionrole\` e clique em "Throw".\n${e.QuestionMark} | Configurou o cargo errado? Delete ele usando o comando \`${this.prefix}reactionrole\` na opção "Delete".\n${e.Stonks} | Agora, ${this.guild.name} possui ${count} reaction roles em ${collectionsCount} coleções!`,
            components: []
        }).catch(() => { })
    }

    chooseColletion = async (emojiData = null, msg, roleArray) => {

        let selectMenuObject = {
            type: 1,
            components: [{
                type: 3,
                maxValues: 1,
                minValues: 1,
                custom_id: 'registerReactionRole',
                placeholder: 'Escolher uma seleção',
                options: []
            }]
        }, collected = false
        await build()

        msg.edit({
            content: `${e.Loading} | Para qual seleção é este cargo?`,
            embeds: [],
            components: [selectMenuObject]
        })

        let collector = msg.createMessageComponentCollector({
            filter: int => int.user.id === this.user.id,
            idle: 60000,
            errors: ['idle']
        })
            .on('collect', async int => {

                let collections = int.values,
                    collectionName = collections[0]

                let collection = roleArray.find(d => d.name === collectionName)

                if (!collection)
                    return msg.edit({
                        content: '❌ | Coleção não encontrada.',
                        components: [selectMenuObject]
                    }).catch(() => { })

                if (collection?.rolesData?.length >= 24)
                    return msg.edit({
                        content: '❌ | O limite é de 24 Reaction Roles por coleção.',
                        components: [selectMenuObject]
                    }).catch(() => { })

                collected = true
                collector.stop()
                return this.registerReactionRole(emojiData, msg, collectionName)
            })
            .on('end', () => {
                if (collected) return
                return msg.edit({
                    content: `${e.Deny} | Comando cancelado por falta de respota.`,
                    embeds: [],
                    components: []
                }).catch(() => { })
            })

        function build() {
            for (let data of roleArray)
                selectMenuObject.components[0].options.push({
                    label: data.name,
                    description: `Cargos registrados: ${data.rolesData.length}`,
                    emoji: e.Database,
                    value: data.name
                })

            return
        }

    }

    BugModalReport = async ({ interaction, client, fields, user, channel, guild } = this) => {

        const textExplain = fields.getTextInputValue('bugTextInfo')
        const commandWithError = fields.getTextInputValue('commandBuggued') || 'Nenhum'
        let ChannelInvite = await channel.createInvite({ maxAge: 0 }).catch(() => { }) || null
        let guildName = ChannelInvite?.url ? `[${guild.name}](${ChannelInvite.url})` : guild.name

        const embed = {
            color: client.red,
            title: '📢 Report de Bug/Erro Recebido',
            url: ChannelInvite?.url || null,
            description: `> Reporte enviado de: ${guildName}\n> ${user.username} - \`${user.id}\`\n\`\`\`txt\n${textExplain || 'Nenhum dado coletado.'}\n\`\`\``,
            fields: [
                {
                    name: 'ℹ️ | Comando reportado',
                    value: `\`${commandWithError || 'Nenhum'}\``,
                }
            ],
            timestamp: new Date()
        }

        const { Config } = Database

        const guildChannel = client.channels.cache.get(Config.BugsChannelId)

        if (!guildChannel)
            return await interaction.reply({
                content: `❌ | Houve um erro ao encontrar o canal designado para recebimento de reports. Por favor, fale diretamente com meu criador: ${client.users.cache.get(Config.ownerId)?.tag || 'Não encontrado'}`,
                embeds: [embed],
                ephemeral: true
            })

        await guildChannel.send({ embeds: [embed] }).catch(async err => {
            return await interaction.reply({
                content: `❌ | Houve um erro ao enviar o reporte para o canal designado. Por favor, fale diretamente com meu criador: ${client.users.cache.get(Config.OwnerId)?.tag || 'Não encontrado'}\n${err}`,
                embeds: [embed],
                ephemeral: true
            })
        })

        return await interaction.reply({
            content: `✅ | Reporte enviado com sucesso! Muito obrigada pelo seu apoio.`,
            embeds: [embed],
            ephemeral: true
        })

    }

    newLetter = async ({ interaction, client, fields, user, guild, prefix } = this) => {

        let usernameData = fields.getTextInputValue('username')
        let anonymous = fields.getTextInputValue('anonymous')
        let letterContent = fields.getTextInputValue('letterContent'),
            isError = false

        let userLetted = getUser(usernameData, client)

        if (!userLetted)
            return await interaction.reply({
                content: `❌ | Não foi possível achar ninguém com o dado informado. \`${usernameData}\``,
                embeds: [{
                    color: client.blue,
                    title: '📝 Letter\'s Content',
                    description: `\`\`\`txt\n${letterContent}\n\`\`\``
                }],
                ephemeral: true
            })

        if (userLetted.id === user.id)
            return await interaction.reply({
                content: '❌ | Você não pode enviar cartas para você mesmo.',
                ephemeral: true
            })

        if (userLetted.id === client.user.id)
            return await interaction.reply({
                content: '❌ | Eu agradeço seu gesto por me enviar uma carta, mas assim... Eu sou um bot, sabe? Fico te devendo essa.',
                ephemeral: true
            })

        if (userLetted.bot)
            return await interaction.reply({
                content: '❌ | Você não pode enviar cartas para bots.',
                ephemeral: true
            })

        let userData = await Database.User.findOne({ id: userLetted.id }, 'Letters.Blocked'),
            isBlock = userData?.Letters?.Blocked

        if (isBlock)
            return await interaction.reply({
                content: `❌ | Este usuário bloqueou o envio de cartas. Você vai precisar pedir para que ${userLetted.tag} libere o envio usando o comando '${prefix}carta block'`,
                ephemeral: true
            })

        let isAnonymous = ['sim', 'yes'].includes(anonymous?.toLowerCase()) ? true : false,
            ID = passCode(7).toLocaleUpperCase()

        try {

            await userLetted.send({
                content: `ℹ | Algum problema com a carta? Contacte algúm administrador usando o comando \`-adm\``,
                embeds: [{
                    color: client.blue,
                    title: `📨 ${client.user.username}'s Letters System`,
                    description: `ℹ Esta carta foi enviada por: ${isAnonymous ? '\`Usuário anônimo\`' : `${user.tag} - ${user.id}`}`,
                    fields: [{
                        name: `📝 Conteúdo da carta`,
                        value: `\`\`\`txt\n${letterContent}\n\`\`\``
                    }],
                    footer: { text: `A ${client.user.username} não se responsabiliza pelo conteúdo presente nesta carta.` }
                }]
            }).catch(() => {
                isError = true
                return error()
            })

            if (isError) return
            Database.subtractItem(user.id, 'Slot.Cartas', 1)
            Database.SetTimeout(user.id, 'Timeouts.Letter')

            Database.pushUserData(user.id, 'Letters.Sended', {
                letterId: ID,
                to: userLetted.id,
                guildId: guild.id,
                anonymous: isAnonymous,
                content: letterContent,
                date: Date.now()
            })

            Database.pushUserData(userLetted.id, 'Letters.Recieved', {
                letterId: ID,
                from: user.id,
                guildId: guild.id,
                anonymous: isAnonymous,
                content: letterContent,
                date: Date.now()
            })

            return await interaction.reply({
                content: `✅ | A carta foi enviada para ${userLetted.tag} com sucesso! (-1 carta)\n🕵️ | Anônimo: ${isAnonymous ? 'Sim' : 'Não'}`,
                ephemeral: true
            })

        } catch (err) {
            isError = true
            return error()
        }

        async function error() {
            isError = true
            return await interaction.reply({
                content: `❌ | Aparentemente a DM de ${userLetted.tag} está fechada e não posso efetuar o envio da carta.`,
                embeds: [{
                    color: client.blue,
                    title: '📝 Lette\'s Content',
                    description: `\`\`\`txt\n${letterContent}\n\`\`\``
                }],
                ephemeral: true
            })
        }

    }

    lettersReport = async ({ interaction, client, fields, user, prefix } = this) => {

        let letterId = fields.getTextInputValue('letterId'),
            reason = fields.getTextInputValue('reason')

        let Channel = client.channels.cache.get(config.letterChannelReport)

        if (!Channel)
            return await interaction.reply({
                content: '❌ | Não foi possível contactar o canal de reports no servidor principal.',
                ephemeral: true
            })

        Channel.send({
            embeds: [{
                color: client.red,
                title: `${e.Loud} Novo reporte de carta recebido`,
                fields: [
                    {
                        name: '🆔 ID da Carta/Usuário',
                        value: `\`${letterId}\``
                    },
                    {
                        name: `${e.Info} Motivo do reporte`,
                        value: `\`\`\`txt\n${reason}\`\`\``
                    }
                ],
                footer: { text: `ID do usuário: ${user.id}` }
            }]
        })

        return await interaction.reply({
            content: `✅ | Seu reporte foi enviado com sucesso! Caso você não queira receber mais cartas através da Saphire, use o comando \'${prefix}carta block\'. A Staff da ${client.user.username} analisará o ocorrido e punirá o responsável a altura.`,
            ephemeral: true
        })
    }

    transactionsModalReport = async () => {

        let problemText = this.fields.getTextInputValue('text'),
            channel = this.client.channels.cache.get(config.BugsChannelId),
            messageResponde = `✅ | Reporte enviado com sucesso! Muito obrigado por reportar erros.`

        if (!channel) return await this.interaction.reply({
            content: `❌ | Erro ao contactar o canal de reportes.`,
            ephemeral: trueF
        })

        channel.send({
            embeds: [{
                color: this.client.red,
                title: '📢 Reporte de Bugs | TRANSACTIONS COMMAND',
                fields: [
                    {
                        name: '👤 Usuário',
                        value: `> ${this.user.tag || 'NOT FOUND'} - \`${this.user.id}\``
                    },
                    {
                        name: '📝 Conteúdo do Reporte',
                        value: `\`\`\`txt\n${problemText}\n\`\`\``
                    }
                ]
            }]
        }).catch(() => {
            messageResponde = '❌ | Erro ao enviar o reporte ao canal principal.'
        })

        return await this.interaction.reply({
            content: messageResponde,
            ephemeral: true
        })

    }

    newCollectionReactionRoles = async () => {

        let collectionName = this.fields.getTextInputValue('name') || this.customId,
            embedTitle = this.fields.getTextInputValue('embedTitle'),
            uniqueSelection = this.fields.getTextInputValue('uniqueSelection')?.toLowerCase() === 'não' ? true : false

        let guildData = await Database.Guild.findOne({ id: this.guild.id }, 'ReactionRole'),
            collections = guildData?.ReactionRole || [],
            collection = collections.find(d => [this.customId, collectionName].includes(d.name)),
            rolesData = collection?.rolesData ? [...collection.rolesData] : [],
            newCollection = [
                ...collections.filter(c => c.name !== collection?.name),
                {
                    name: collectionName,
                    embedTitle: embedTitle,
                    uniqueSelection: uniqueSelection,
                    rolesData: rolesData,
                    collectionID: collection?.collectionID || passCode(5)
                }
            ]

        await Database.Guild.updateOne(
            { id: this.guild.id },
            {
                $set: {
                    ReactionRole: [...newCollection]
                }
            }
        )

        return await this.interaction.reply({
            content: `✅ | Coleção de Reaction Roles registrada com sucesso!`,
            ephemeral: true
        })

    }

    editRoleInReactionRole = async () => {

        const { fields } = this

        let title = fields.getTextInputValue('roleTitle'),
            description = fields.getTextInputValue('roleDescription') || null,
            roleId = this.customId,
            guildData = await Database.Guild.findOne({ id: this.guild.id }, 'ReactionRole'),
            collections = guildData?.ReactionRole || [],
            collection = collections.find(coll => coll.rolesData.find(role => role.roleId === roleId)),
            rolesData = collection.rolesData || [],
            data = collection.rolesData.find(role => role.roleId === roleId),
            i = collection.rolesData.findIndex(role => role.roleId === roleId)

        await this.interaction.update({})

        let msg = await this.channel.send({
            content: `${e.Loading} | Você vai querer editar o emoji? Se sim, escolha um emoji **\`do discord ou deste servidor\`**. Não? Então clique no x.`
        }), collected = false

        if (data.emoji) msg.react(data.emoji).catch(() => { })
        msg.react('❌').catch(() => { })

        let collector = msg.createReactionCollector({
            filter: (r, u) => u.id === this.user.id,
            time: 120000,
            errors: ['time']
        })
            .on('collect', (reaction) => {

                let { emoji } = reaction
                let emojiData = emoji.id || emoji.name

                if (emoji.id && !this.guild.emojis.cache.has(emoji.id))
                    return msg.edit(`${msg.content}\n \n❌ | Este emoji não pertence a este servidor. Por favor, escolha um emoji deste servidor ou do Discord.`)

                collected = true
                collector.stop()
                return refreshData(emojiData, this.guild)
            })
            .on('end', () => {
                if (collected) return
                return msg.edit(`${e.Deny} | Edição do Reaction Role cancelado por falta de respota.`).catch(() => { })
            })

        async function refreshData(emoji = undefined, guild) {

            rolesData.splice(i, 1, {
                roleId: data.roleId,
                title: title || data.title,
                emoji: emoji === '❌' ? null : emoji,
                description: description === 'null' ? null : description
            })

            await Database.Guild.updateOne(
                { id: guild.id, 'ReactionRole.name': collection.name },
                { $set: { 'ReactionRole.$.rolesData': [...rolesData] } }
            )

            msg.reactions.removeAll().catch(() => { })
            return await msg.edit({
                content: `${e.Check} | Cargo editado com sucesso! Já tem a coleção **${collection.name}** lançada no servidor? Vá até ela e clique em \`Refresh\`. Eu faço todo o resto pra você.`
            }).catch(() => { })
        }
    }

}

module.exports = ModalInteraction