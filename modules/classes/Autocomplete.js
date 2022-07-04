const util = require('../../src/structures/util')
const Database = require('./Database')
const client = require('../../index')

class Autocomplete {
    constructor(interaction) {
        this.interaction = interaction
        this.user = interaction.user
        this.member = interaction.member
        this.guild = interaction.guild
        this.channel = interaction.channel
        this.e = Database.Emojis
    }

    async build() {

        const { name, value } = this.interaction.options.getFocused(true)

        switch (name) {
            case 'channel': this.blockedChannels(value); break;
            case 'users_banned': this.usersBanned(value); break;
            case 'color': case 'cor': this.utilColors(value); break;
            case 'betchoice': this.betChoices(value); break;
            case 'blocked_commands': this.blockCommands(value); break;
            case 'de': case 'para': this.translateLanguages(value); break;
            case 'search_guild': this.allGuilds(value); break;
            case 'search_user': this.allUsers(value); break;
            case 'change_background': this.changeLevelBackground(value); break;
            case 'buy_background': this.buyLevelBackground(value); break;
            case 'select_country': this.flagSearch(value); break;
            case 'flag-adminstration': this.flagAdminOptions(); break;
            case 'level_options': this.levelOptions(); break;
            default: this.respond(); break;
        }

        return
    }

    async flagAdminOptions() {
        const data = await Database.Client.findOne({ id: client.user.id }, 'Moderadores Administradores')
        if (![...data?.Administradores, Database.Names.Lereo, ...data?.Moderadores]?.includes(this.user.id)) return this.respond()

        return this.respond([
            {
                name: 'Nova bandeira',
                value: 'newFlag'
            },
            {
                name: 'Editar bandeira',
                value: 'editFlag'
            },
            {
                name: 'Remover bandeira',
                value: 'remove'
            },
            {
                name: 'Lista de bandeiras',
                value: 'list'
            },
            {
                name: 'Países sem bandeiras',
                value: 'noflaglist'
            }
        ])
    }

    flagSearch(value) {
        const flags = Database.Flags.get('Flags') || []
        const fill = flags.filter(flag => flag.country[0].toLowerCase().includes(value.toLowerCase()) || flag.flag === value || flag.image === value)
        const { formatString } = require('../../src/commands/games/plugins/gamePlugins')
        const mapped = fill.map(flag => ({ name: formatString(flag.country[0]), value: flag.country[0] }))
        return this.respond(mapped)
    }

    async blockedChannels(value) {
        const data = await Database.Guild.findOne({ id: this.guild.id }, 'Blockchannels')
        const channelsBlocked = data?.Blockchannels?.Channels || []
        const named = channelsBlocked.map(channelId => this.guild.channels.cache.get(channelId))
        const fill = named.filter(ch => ch && ch?.name.toLowerCase().includes(value?.toLowerCase())) || []
        return this.respond(fill.map(ch => ({ name: ch.name, value: ch.id })))
    }

    async usersBanned(value) {
        const banneds = await this.guild.bans.fetch()
        const banned = banneds.toJSON()
        const fill = banned.filter(data => data?.user.tag.toLowerCase().includes(value.toLowerCase()) || data?.user.id.includes(value)) || []
        const mapped = fill.map(data => {
            let nameData = `${data.user.tag} - ${data.user.id} | ${data.reason?.slice(0, 150) || 'Sem razão definida'}`

            if (nameData.length > 100)
                nameData = nameData.slice(0, 97) + '...'

            return { name: nameData, value: data.user.id }
        })
        return this.respond(mapped)
    }

    utilColors(value) {
        const colors = Object.keys(util.HexColors)
        const fill = colors.filter(data => util.ColorsTranslate[data].toLowerCase().includes(value.toLowerCase()))
        const mapped = fill.map(data => ({ name: util.ColorsTranslate[data], value: data }))
        return this.respond(mapped)
    }

    async betChoices(value) {
        const data = await Database.Client.findOne({ id: client.user.id }, 'GlobalBet')
        const bets = data?.GlobalBet || []

        const betObject = [
            { name: '0', length: bets['0']?.length },
            { name: '100', length: bets['100']?.length },
            { name: '2000', length: bets['2000']?.length },
            { name: '5000', length: bets['5000']?.length },
            { name: '10000', length: bets['10000']?.length },
            { name: '20000', length: bets['20000']?.length },
            { name: '30000', length: bets['30000']?.length },
            { name: '40000', length: bets['40000']?.length },
            { name: '50000', length: bets['50000']?.length },
            { name: '60000', length: bets['60000']?.length },
            { name: '70000', length: bets['70000']?.length },
            { name: '80000', length: bets['80000']?.length },
            { name: '90000', length: bets['90000']?.length },
            { name: '100000', length: bets['100000']?.length }
        ]

        const fill = betObject.filter(d => d.name.includes(value))
        const mapped = fill.map(d => ({ name: `${d.name} Safiras | ${d.length || 0} apostas em espera`, value: `${d.name}` }))
        return this.respond(mapped)
    }

    async blockCommands(value) {
        const data = await Database.Client.findOne({ id: client.user.id }, 'ComandosBloqueadosSlash')
        const bugs = data?.ComandosBloqueadosSlash || []
        const fill = bugs.filter(bug => bug.cmd?.toLowerCase().includes(value.toLowerCase()))
        const mapped = fill.map(bug => {

            let name = `${bug.cmd} | ${bug.error}`

            if (name.length > 100)
                name = name.slice(0, 97) + '...'

            return { name: name, value: bug.cmd }
        })
        return this.respond(mapped)
    }

    showCommands(value) {
        const commands = client.slashCommands.map(cmd => ({ name: cmd.name, description: cmd.description }))
        const fill = commands.filter(cmd => cmd.name?.toLowerCase().includes(value.toLowerCase()))
        const mapped = fill.map(cmd => {
            let name = `${cmd.name} | ${cmd.description}`

            if (name.length > 100)
                name = name.slice(0, 97) + '...'

            return { name: name, value: cmd.name }
        })
        return this.respond(mapped)
    }

    translateLanguages(value) {
        const languages = Object.entries(util.Languages)
        const fill = languages.filter(([a, b]) => a.includes(value.toLowerCase()) || b.toLowerCase().includes(value.toLowerCase()))
        const mapped = fill.map(([a, b]) => ({ name: b, value: b }))
        return this.respond(mapped)
    }

    allGuilds(value) {
        const fill = client.guilds.cache.filter(guild =>
            guild.name.toLowerCase().includes(value.toLowerCase())
            || guild.id.includes(value)
        )
        const mapped = fill.map(guild => ({ name: `(${guild.members.cache.size}) - ${guild.name} | ${guild.id}`, value: guild.id }))
        return this.respond(mapped)

    }

    allUsers(value) {
        const fill = client.users.cache.filter(user =>
            user.tag.toLowerCase().includes(value.toLowerCase())
            || user.id.includes(value)
        )
        const mapped = fill.map(user => ({ name: `${user.tag} | ${user.id}`, value: user.id }))
        return this.respond(mapped)

    }

    async changeLevelBackground(value) {

        const userData = await Database.User.findOne({ id: this.user.id }, 'Walls') || []
        const wallSetted = userData.Walls?.Set
        const clientData = await Database.Client.findOne({ id: client.user.id }, 'BackgroundAcess') || []
        const userBackground = clientData?.BackgroundAcess.includes(this.user.id)
            ? Object.keys(Database.BgLevel.get('LevelWallpapers'))
            : userData.Walls?.Bg

        let validWallpapers = userBackground?.map(bg => {
            let data = Database.BgLevel.get(`LevelWallpapers.${bg}`)
            if (!data || data.Image === wallSetted) return
            return { name: `${bg} - ${data.Name}`, value: bg }
        }) || []

        if (validWallpapers.length > 0) {

            validWallpapers = validWallpapers
                .filter(a => a)
                .filter(data => data.name.toLowerCase().includes(value.toLowerCase()))

            if (wallSetted)
                validWallpapers.unshift({
                    name: 'Retirar Background Atual',
                    value: 'bg0'
                })
        }

        return this.respond(validWallpapers)
    }

    async buyLevelBackground(value) {

        const clientData = await Database.Client.findOne({ id: client.user.id }, 'BackgroundAcess') || []
        if (clientData?.BackgroundAcess.includes(this.user.id)) return this.respond()

        const userData = await Database.User.findOne({ id: this.user.id }, 'Walls') || []
        const userBackgrounds = userData.Walls?.Bg || []
        const backgrounds = Object.entries(Database.BgLevel.get('LevelWallpapers') || {})
        const walls = backgrounds
            .sort((a, b) => {
                let num = parseInt(a[0].slice(2, 5))
                let num2 = parseInt(b[0].slice(2, 5))
                return num - num2
            })
            .filter(bg =>
                !userBackgrounds.includes(bg[0])
                && bg[0] !== 'bg0'
                && bg[1]?.Limit > 0
            ) || []

        const mapped = walls?.map(bg => {

            let limit = bg[1]?.Limit > 0 ? ` | Estoque: ${bg[1]?.Limit || 0}` : ''
            let nameData = `${bg[0]} - ${bg[1].Name} | ${bg[1].Price} Safiras${limit}`

            if (nameData.length > 100)
                nameData = nameData.slice(0, 97) + '...'

            return { name: nameData, value: bg[0] }

        })
            .filter(data => data.name.toLowerCase().includes(value.toLowerCase())) || []

        return this.respond(mapped)
    }

    async levelOptions() {
        const clientData = await Database.Client.findOne({ id: client.user.id }, 'BackgroundAcess Administradores')
        const arr = [{ name: 'Esconder mensagem só para mim', value: 'hide' }]

        if (clientData.Administradores?.includes(this.user.id))
            arr.push({ name: 'Usuários que possuem acesso aos Backgrounds', value: 'list' })

        return this.respond(arr)
    }

    async respond(mappedArray = []) {

        if (mappedArray.length > 25) mappedArray.length = 25

        if (mappedArray.length)
            mappedArray = mappedArray.map(data => {

                if (data?.name?.length > 100)
                    data.name = data.name.slice(0, 97) + '...'

                return { name: data?.name, value: data?.value }
            })

        return await this.interaction.respond(mappedArray)
    }
}

module.exports = Autocomplete