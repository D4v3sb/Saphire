const { rankCard } = require('simply-djs')
const Vip = require('../../../modules/functions/public/vip')

module.exports = {
    name: 'level',
    description: '[level] Confira seu level ou de alguém',
    type: 1,
    dm_permission: false,
    options: [
        {
            name: 'user',
            description: 'Selecione um membro para ver o level dele',
            type: 6
        },
        {
            name: 'search_user',
            description: 'Pesquise por um usuário',
            type: 3,
            autocomplete: true
        },
        {
            name: 'change_background',
            description: 'Mude seu background para ficar estiloso.',
            type: 3,
            autocomplete: true
        },
        {
            name: 'buy_background',
            description: 'Compre backgrounds',
            type: 3,
            autocomplete: true
        },
        {
            name: 'level_options',
            description: 'Mais opções aqui',
            type: 3,
            autocomplete: true
        }
    ],
    async execute({ interaction: interaction, client: client, database: Database, emojis: e, clientData: clientData, guildData: guildData }) {

        const { BgLevel } = Database
        const { options, user: author, guild } = interaction

        let user = client.users.cache.get(options.getString('search_user')) || options.getUser('user') || author
        let level_options = options.getString('level_options')
        let hide = level_options === 'hide' ? true : false
        let bg = options.getString('change_background')
        let showList = level_options === 'list'
        let buyBg = options.getString('buy_background')
        let userData = await Database.User.findOne({ id: user.id }, 'Balance Walls Level Xp')
        let data = {}
        let LevelWallpapers = BgLevel.get('LevelWallpapers')

        if (showList) return bgAcess()

        if (!userData)
            return await interaction.reply({
                content: `${e.Database} | DATABASE | O usuário **${user?.tag || 'Indefinido'}** *\`${user?.id || '0'}\`* não foi encontrado no meu banco de dados.`,
                ephemeral: true
            })

        if (buyBg) return buyBackground(buyBg)

        if (user.bot)
            return await interaction.reply({
                content: `${e.Deny} | Bots não possuem experiência.`,
                ephemeral: true
            })

        if (bg) return setNewWallpaper()

        if (!guild.clientPermissions('ATTACH_FILES'))
            return await interaction.reply({
                content: `${e.Info} | Eu preciso da permissão **Enviar Arquivos** para executar este comando.`
            })

        return SendLevel()

        async function setNewWallpaper() {

            let background = BgLevel.get(`LevelWallpapers.${bg}`)
            let atual = userData.Walls.Set

            if (!background)
                return await interaction.reply({
                    content: `${e.Info} | Este background não existe. Selecione um background que você possui selecionando a opção na lista de backgrounds. Você pode ver seus backgrounds usando \`/level change_background:\``,
                    ephemeral: true
                })

            if (atual === background.Image)
                return await interaction.reply({
                    content: `${e.Info} | Este wallpaper já é o seu atual.`,
                    ephemeral: true
                })

            if (bg === 'bg0') {
                Database.delete(author.id, 'Walls.Set')
                return await interaction.reply({ content: `${e.Check} | Você resetou seu background para \`${background.Name}\`.` })
            }

            if (!clientData.BackgroundAcess?.includes(author.id) && !userData.Walls?.Bg?.includes(bg))
                return await interaction.reply({
                    content: `${e.Deny} | Você não tem esse background. Que tal comprar ele usando \`/level buy_background: ${bg}\`?`
                })

            Database.updateUserData(author.id, 'Walls.Set', background.Image)
            return await interaction.reply({
                embeds: [{
                    color: client.green,
                    description: `${e.Check} | Você alterou seu background para \`${background.Name}\``,
                    image: { url: background.Image }
                }]
            })

        }

        async function bgAcess() {

            let bgacess = clientData.BackgroundAcess

            if (!bgacess || bgacess.length === 0)
                return await interaction.reply({
                    content: `${e.Info} | Não há ninguém na lista de acesso livro aos wallpapers`
                })

            let format = bgacess.map(data => `${client.users.cache.get(data)?.tag || 'Não encontrado'} - \`${data}\``).join('\n')

            return await interaction.reply({
                embeds: [{
                    color: client.blue,
                    title: `${e.ModShield} Background Free Access`,
                    description: format || 'Lista vazia'
                }]
            })
        }

        async function SendLevel() {
            await interaction.deferReply({ ephemeral: hide })

            await build()

            try {
                await rankCard(false, interaction, {
                    member: user, // String
                    level: data.level || 0, // Number
                    currentXP: data.exp || 0, // Number
                    neededXP: data.xpNeeded || 0, // Number
                    rank: data.rank || 0, // Number
                    slash: true, // Boolean
                    background: userData.Walls?.Set || LevelWallpapers?.bg0?.Image || null // String
                }).then(() => { msg.delete().catch(() => { }) }).catch(err => { })

                return

            } catch (err) { return interactionError(interaction, err) }
        }

        async function build() {
            data.level = userData.Level || 0
            data.exp = userData.Xp || 0
            data.xpNeeded = parseInt((userData.Level || 1) * 275)

            let usersAllData = Database.Cache.get('rankLevel') || []

            if (!usersAllData || usersAllData.length === 0)
                return data.rank = 'N/A'

            if (!usersAllData.find(d => d.id === user.id))
                return data.rank = '2000^'

            data.rank = usersAllData.findIndex(author => author?.id === user.id) + 1 || '2000^'
            return
        }

        async function buyBackground(code) {

            const vip = await Vip(author.id)
            const moeda = guildData?.Moeda || `${e.Coin} Safiras`
            const BgLevel = Database.BgLevel

            let wallpaperData = BgLevel.get(`LevelWallpapers.${code}`)

            if (!wallpaperData)
                return await interaction.reply({
                    content: `${e.Deny} | Po favor, selecione um wallpaper existe na lista de wallpapers.`,
                    ephemeral: true
                })

            let price = wallpaperData.Price,
                name = wallpaperData.Name,
                designerId = wallpaperData.Designer,
                limite = wallpaperData.Limit,
                image = wallpaperData.Image,
                money = userData?.Balance || 0

            if (vip)
                price -= parseInt(price * 0.3)

            if (price < 1) price = 0

            if (price > money)
                return await interaction.reply({
                    content: `${e.Deny} | ${author}, você precisa de pelo menos **${price} ${moeda}** para comprar o fundo **${name}**`,
                    ephemeral: true
                })

            let msg = await interaction.reply({
                embeds: [{
                    color: client.blue,
                    description: `${e.QuestionMark} | ${author}, você realmente quer comprar o wallpaper \`${name}\` por **${price} ${moeda}**?`,
                    image: { url: image }
                }],
                fetchReply: true
            }),
                emojis = ['✅', '❌']

            for (let i of emojis) msg.react(i).catch(() => { })

            return msg.createReactionCollector({
                filter: (r, u) => emojis.includes(r.emoji.name) && u.id === author.id,
                max: 1,
                time: 60000,
                errors: ['time']
            })
                .on('collect', async (reaction) => {

                    msg.reactions.removeAll().catch(() => { })
                    if (reaction.emoji.name === emojis[0])
                        return newFastBuy()

                    return await interaction.editReply({
                        content: `${e.Deny} | Compra cancelada.`,
                        embeds: []
                    })
                })

                .on('end', async (i, r) => {
                    if (['user', 'limit'].includes(r)) return
                    msg.reactions.removeAll().catch(() => { })
                    return await interaction.editReply({
                        content: `${e.Deny} | Compra cancelada por falta de resposta.`,
                        embeds: []
                    })
                })

            async function newFastBuy() {

                let comissao = parseInt(price * 0.02)

                if (comissao < 1) comissao = 0

                Database.pushUserData(author.id, 'Walls.Bg', code)

                if (client.users.cache.has(designerId) && comissao > 1) {
                    Database.PushTransaction(designerId, `${e.gain} Ganhou ${comissao} Safiras via *Wallpaper Designers CashBack*`)
                    Database.add(designerId, comissao)
                }

                if (limite > 0) BgLevel.subtract(`LevelWallpapers.${code}.Limit`, 1)

                if (price > 0) {
                    Database.subtract(author.id, price)
                    Database.PushTransaction(
                        author.id,
                        `${e.loss} Gastou ${price} Safiras comprando o *Wallpaper ${code}*`
                    )
                }

                return await interaction.editReply({
                    embeds: [{
                        color: client.green,
                        title: '💳 Compra de Wallpaper efetuada com sucesso.',
                        description: `${e.Info} | Você comprou o wallpaper \`${code} - ${name}\`. Você pode colocar este wallpaper usando \`/level change_background: ${code}\``,
                        image: { url: image }
                    }]
                })
            }
        }
    }
}