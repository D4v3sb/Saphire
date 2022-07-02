const fetch = require("node-fetch")
const allowedFormats = ["webp", "png", "jpg", "jpeg", "gif"]
const allowedSizes = Array.from({ length: 9 }, (e, i) => 2 ** (i + 4))

module.exports = {
    name: 'avatar',
    description: '[util] Veja o avatar e faixa de usuários',
    // dm_permission: false,
    type: 1,
    options: [
        {
            name: 'user',
            description: 'Selecione um usuário para ver o avatar',
            type: 6
        },
        {
            name: 'search_user',
            description: 'Pesquise por um usuário para ver o avatar',
            type: 3,
            autocomplete: true
        }
    ],
    async execute({ interaction: interaction, client: client, database: Database, emojis: e }) {

        const { options, user: author, guild } = interaction

        let user = options.getUser('user') || client.users.cache.get(options.getString('search_user')) || author
        let member = guild?.members.cache.get(user?.id)
        let userAvatarURL = user.avatarURL({ dynamic: true, format: "png", size: 1024 })
        let memberAvatarURL = member?.avatarURL({ dynamic: true, format: "png", size: 1024 })
        let userAvatarImage = user.displayAvatarURL({ dynamic: true, format: "png", size: 1024 })
        let memberAvatarImage = member?.displayAvatarURL({ dynamic: true, format: "png", size: 1024 })
        let Emojis = ['⬅️', '📨', '🗑️', '💙', '➡️']
        let banner = await get(user?.id, 2048, "png", true)
        let embeds = [{
            embed: {
                color: client.blue,
                description: `${e.Download} [Clique aqui](${userAvatarURL}) para baixar o avatar original de ${user.tag}`,
                image: { url: userAvatarImage }
            },
            type: 'original'
        }]
        let atualEmbed = 0
        let DmUserGuild = []
        let DmUserOriginal = []
        let DmUserBanner = []

        if (memberAvatarImage && userAvatarImage !== memberAvatarImage)
            embeds.push({
                embed: {
                    color: client.blue,
                    description: `${e.Download} [Clique aqui](${memberAvatarURL}) para baixar o avatar no servidor de ${member?.user?.tag || 'NomeDesconhecido'}`,
                    image: { url: memberAvatarImage }
                },
                type: 'guild'
            })

        if (banner)
            embeds.push({
                embed: {
                    color: client.blue,
                    description: `${e.Download} [Clique aqui](${banner}) para baixar o banner de ${member?.user?.tag || 'NomeDesconhecido'
                        }`,
                    image: { url: banner }
                },
                type: 'banner'
            })

        const buttonsWithArrows = [
            {
                type: 1,
                components: [
                    {
                        type: 2,
                        emoji: Emojis[0], // Left Arrow
                        custom_id: 'leftArrow',
                        style: 'PRIMARY'
                    },
                    {
                        type: 2,
                        emoji: Emojis[1], // letter
                        custom_id: 'letter',
                        style: 'PRIMARY'
                    },
                    {
                        type: 2,
                        emoji: Emojis[2], // X
                        custom_id: 'x',
                        style: 'DANGER'
                    },
                    {
                        type: 2,
                        emoji: Emojis[3], // Blue Heart
                        custom_id: 'blueHeart',
                        style: 'PRIMARY'
                    },
                    {
                        type: 2,
                        emoji: Emojis[4], // Right Arrow
                        custom_id: 'rightArrow',
                        style: 'PRIMARY'
                    }
                ]
            }
        ]

        const buttonsWithoutArrows = [
            {
                type: 1,
                components: [
                    {
                        type: 2,
                        emoji: Emojis[1], // Letter
                        custom_id: 'letter',
                        style: 'PRIMARY'
                    },
                    {
                        type: 2,
                        emoji: Emojis[2], // X
                        custom_id: 'x',
                        style: 'DANGER'
                    },
                    {
                        type: 2,
                        emoji: Emojis[3], // Blue Heart
                        custom_id: 'blueHeart',
                        style: 'PRIMARY'
                    }
                ]
            }
        ]

        const buttons = embeds.length > 1 ? buttonsWithArrows : buttonsWithoutArrows

        let msg = await interaction.reply({
            embeds: [embeds[0].embed],
            components: buttons,
            fetchReply: true
        })

        return msg.createMessageComponentCollector({
            filter: int => true,
            idle: 60000
        })
            .on('collect', async (int) => {

                let intId = int.customId,
                    intUser = int.user

                await int.deferUpdate().catch(() => { })
                if (intId === 'blueHeart') return NewLike(intUser, int)
                if (intId === 'letter') return sendLetter(intUser, int)

                if (intId === 'rightArrow' && intUser.id === author.id) {
                    atualEmbed++
                    if (!embeds[atualEmbed]) atualEmbed = 0

                    return msg.edit({ embeds: [embeds[atualEmbed].embed] }).catch(() => { })
                }

                if (intId === 'leftArrow' && intUser.id === author.id) {
                    atualEmbed--
                    if (!embeds[atualEmbed]) atualEmbed = embeds.length - 1

                    return msg.edit({ embeds: [embeds[atualEmbed].embed] }).catch(() => { })
                }

                if (intId === 'x' && [author.id, user.id].includes(intUser.id))
                    return msg.delete().catch(() => { })

                return
            })
            .on('end', () => msg.edit({ components: [] }).catch(() => { }))

        async function sendLetter(u, int) {

            let embedType = embeds[atualEmbed].type,
                replaceWord = 'a foto'

            if (DmUserBanner.includes(u.id) && embedType === 'banner') return
            if (DmUserGuild.includes(u.id) && embedType === 'guild') return
            if (DmUserOriginal.includes(u.id) && embedType === 'original') return

            u.send({
                content: `Foto enviada de: ${guild?.name}`,
                embeds: [embeds[atualEmbed].embed],
                components: []
            }).catch(async () => {
                return await int.followUp({
                    content: `${e.Deny} | ${u}, sua DM está fechada. Verifique suas configurações e tente novamente.`,
                    ephemeral: true
                })
            })

            if (embedType === 'banner') {
                DmUserBanner.push(u.id)
                replaceWord = 'o banner'
            }

            if (embedType === 'guild') {
                DmUserGuild.push(u.id)
                replaceWord = 'a foto personalizada no servidor'
            }

            if (embedType === 'original') DmUserOriginal.push(u.id)

            return await int.followUp({
                content: `${e.Check} | ${u} solicitou ${replaceWord} de ${user.username} para sua DM.`
            })

        }

        async function NewLike(Author, int) {

            if (user.id === client.user.id)
                return await int.followUp({
                    content: `${Author}, olha... Eu agradeço... Mas você já viu meu \`${prefix}perfil @${client.user.username}\`?`,
                    ephemeral: true
                })

            if (Author.id === user.id) return

            if (user.bot)
                return await int.followUp({
                    content: `${e.Deny} | <@${Author.id}>, bots não podem receber likes, ok?`,
                    ephemeral: true
                })

            let authorData = await Database.User.findOne({ id: Author.id }, 'Timeouts.Rep'),
                userData = await Database.User.findOne({ id: user.id })

            if (!userData) {

                let u = client.users.cache.get(user.id)

                if (!u)
                    return await int.followUp({
                        content: `${e.Deny} | Usuário desconhecido.`,
                        ephemeral: true
                    })

                Database.registerUser(u)
                return await int.followUp({
                    content: `${e.Deny} | <@${Author.id}>, tenta de novo por favor...`,
                    ephemeral: true
                })
            }

            if (client.Timeout(1800000, authorData.Timeouts.Rep))
                return await int.followUp({
                    content: `${e.Nagatoro} | ${Author}, calminha aí Princesa! \`${client.GetTimeout(1800000, authorData.Timeouts.Rep)}\``,
                    ephemeral: true
                })

            Database.addItem(user.id, 'Likes', 1)
            Database.SetTimeout(Author.id, 'Timeouts.Rep')

            return await int.followUp({
                content: `${e.Check} | ${Author} deu um like para ${user.tag}.`
            })
        }

        async function createBannerURL(userId, banner, format = "webp", size = "1024", dynamic) {
            if (dynamic) format = banner.startsWith("a_") ? "gif" : format
            if (!banner) return false
            return `https://cdn.discordapp.com/banners/${userId}/${banner}.${format}${parseInt(size) ? `?size=${parseInt(size)}` : ''}`
        }

        async function get(userId, size, format, dynamic) {

            if (format && !allowedFormats.includes(format)) return false
            if (size && (!allowedSizes.includes(parseInt(size)) || isNaN(parseInt(size)))) return false
            if (dynamic && typeof dynamic !== "boolean") return false
            let Data = ""

            try {

                await fetch(`https://discord.com/api/v9/users/${userId}`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bot ${process.env.DISCORD_CLIENT_BOT_TOKEN}` }
                })
                    .then(res => res.json())
                    .then(user => {
                        if (user.code == 50035) return false
                        if (!user.banner) return false
                        if (user.banner) Data = createBannerURL(user.id, user.banner, format, size, dynamic)
                    })

            } catch (err) {
                return false
            }

            return Data ? Data : false
        }
    }
}