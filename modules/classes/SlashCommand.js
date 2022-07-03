const Modals = require('./Modals')
const util = require('../../src/structures/util')

class SlashCommand extends Modals {
    constructor(interaction, client) {
        super()
        this.interaction = interaction
        this.user = interaction.user
        this.member = interaction.member
        this.guild = interaction.guild
        this.channel = interaction.channel
        this.client = client
        this.error = require('../functions/config/interactionError')
        this.Database = require('./Database')
        this.e = this.Database.Emojis
    }

    async execute(guildData, clientData) {

        const command = this.client.slashCommands.get(this.interaction.commandName);
        if (!command) return

        let staff = [...clientData.Administradores, this.Database.Config.ownerId]

        if (command.admin && !staff.includes(this.interaction.user.id))
            return await this.interaction.reply({
                content: `${this.e.Deny} | Este comando é exclusivo para meus administradores.`,
                ephemeral: true
            })

        await command.execute({
            interaction: this.interaction,
            emojis: this.e,
            database: this.Database,
            client: this.client,
            data: this,
            guild: this.guild,
            modals: this.modals,
            member: this.member,
            guildData: guildData,
            clientData: clientData,
        }).catch(err => this.error(this, err))

        return this.registerCommand()
    }

    async CheckBeforeExecute() {

        const { guild, client, e, Database, interaction, user, channel } = this

        let guildData = await Database.Guild.findOne({ id: guild?.id })
        let clientData = await Database.Client.findOne({ id: client.user.id })

        if (clientData.Rebooting?.ON)
            return await interaction.reply({ content: `${e.Loading} | Reiniciando em breve...\n${e.BookPages} | ${clientData.Rebooting?.Features || 'Nenhum dado fornecido'}` })

        if (clientData?.Blacklist?.Users?.some(data => data?.id === user.id))
            return await interaction.reply({
                content: '❌ | Você está na blacklist.',
                ephemeral: true
            })

        if (!this.member?.permissions?.toArray()?.includes('ADMINISTRATOR') && guildData?.Blockchannels?.Channels?.includes(channel.id))
            return await interaction.reply({
                content: `${e.Deny} | Meus comandos foram bloqueados neste canal.`,
                ephemeral: true
            })

        let comandosBloqueados = clientData?.ComandosBloqueadosSlash || [],
            cmdBlocked = comandosBloqueados?.find(Cmd => Cmd.cmd === interaction.commandName)
        if (cmdBlocked)
            return await interaction.reply({
                content: `${e.BongoScript} | Este Slash Command foi bloqueado por algum Bug/Erro ou pelos meus administradores.\n> Quer fazer algúm reporte? Use o comando \`/bug\`\n> Motivo do bloqueio: ${cmdBlocked?.error || 'Motivo não informado.'}`,
                ephemeral: true
            })

        return this.execute(guildData, clientData)
    }

    async registerCommand() {
        return await this.Database.Client.updateOne(
            { id: this.client.user.id },
            { $inc: { ComandosUsados: 1 } },
            { upsert: true }
        )
    }

    async autoComplete() {
        const { name, value } = this.interaction.options.getFocused(true)
        let mapped = await this.executeAutoComplete(name, value)

        if (mapped.length > 25) mapped.length = 25
        return await this.interaction.respond(mapped)
    }

    async executeAutoComplete(name, value) {

        if (name === 'channel') {
            let data = await this.Database.Guild.findOne({ id: this.guild.id }, 'Blockchannels'),
                channelsBlocked = data?.Blockchannels?.Channels || [],
                named = channelsBlocked.map(channelId => this.guild.channels.cache.get(channelId))

            let fill = named.filter(ch => ch?.name.toLowerCase().includes(value?.toLowerCase())) || []
            return fill.map(ch => ({ name: ch.name, value: ch.id }))
        }

        if (name === 'users_banned') {

            let banneds = await this.guild.bans.fetch()
            let banned = banneds.toJSON()

            banned.length = 25
            let fill = banned.filter(data => data?.user.tag.toLowerCase().includes(value.toLowerCase()) || data?.user.id.includes(value)) || []
            return fill.map(data => {
                let nameData = `${data.user.tag} - ${data.user.id} | ${data.reason?.slice(0, 150) || 'Sem razão definida'}`

                if (nameData.length > 100)
                    nameData = nameData.slice(0, 97) + '...'

                return { name: nameData, value: data.user.id }
            })
        }

        if (['color', 'cor'].includes(name)) {

            let colors = Object.keys(util.HexColors)

            let fill = colors.filter(data => util.ColorsTranslate[data].toLowerCase().includes(value.toLowerCase()))
            return fill.map(data => ({ name: util.ColorsTranslate[data], value: util.HexColors[data] }))
        }

        if (name === 'betchoice') {
            let data = await this.Database.Client.findOne({ id: this.client.user.id }, 'GlobalBet')
            let bets = data?.GlobalBet || []

            let betObject = [
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

            let fill = betObject.filter(d => d.name.includes(value))
            return fill.map(d => ({ name: `${d.name} Safiras | ${d.length || 0} apostas em espera`, value: `${d.name}` }))
        }

        if (name === 'blocked_commands') {

            let data = await this.Database.Client.findOne({ id: this.client.user.id }, 'ComandosBloqueadosSlash')

            let bugs = data?.ComandosBloqueadosSlash || []

            const fill = bugs.filter(bug => bug.cmd?.toLowerCase().includes(value.toLowerCase()))
            return fill.map(bug => {

                let name = `${bug.cmd} | ${bug.error}`

                if (name.length > 100)
                    name = name.slice(0, 97) + '...'

                return { name: name, value: bug.cmd }
            })

        }

        if (name === 'command') {
            let commands = this.client.slashCommands.map(cmd => ({ name: cmd.name, description: cmd.description }))

            const fill = commands.filter(cmd => cmd.name?.toLowerCase().includes(value.toLowerCase()))
            return fill.map(cmd => {
                let name = `${cmd.name} | ${cmd.description}`

                if (name.length > 100)
                    name = name.slice(0, 97) + '...'

                return { name: name, value: cmd.name }
            })
        }

        if (['de', 'para'].includes(name)) {

            let languages = Object.entries(util.Languages)

            const fill = languages.filter(([a, b]) => a.includes(value.toLowerCase()) || b.toLowerCase().includes(value.toLowerCase()))
            return fill.map(([a, b]) => ({ name: b, value: b }))
        }

        if (name === 'search_guild') {

            const fill = this.client.guilds.cache.filter(guild =>
                guild.name.toLowerCase().includes(value.toLowerCase())
                || guild.id.includes(value)
            )

            return fill.map(guild => ({ name: `(${guild.members.cache.size}) - ${guild.name} | ${guild.id}`, value: guild.id }))
        }

        if (name === 'search_user') {

            const fill = this.client.users.cache.filter(user =>
                user.tag.toLowerCase().includes(value.toLowerCase())
                || user.id.includes(value)
            )

            return fill.map(user => ({ name: `${user.tag} | ${user.id}`, value: user.id }))
        }

        if (name === 'change_background') {

            const userData = await this.Database.User.findOne({ id: this.user.id }, 'Walls') || []
            const wallSetted = userData.Walls?.Set
            const clientData = await this.Database.Client.findOne({ id: this.client.user.id }, 'BackgroundAcess') || []
            const userBackground = clientData?.BackgroundAcess.includes(this.user.id)
                ? Object.keys(this.Database.BgLevel.get('LevelWallpapers'))
                : userData.Walls?.Bg

            const validWallpapers = userBackground?.map(bg => {
                let data = this.Database.BgLevel.get(`LevelWallpapers.${bg}`)

                if (!data || data.Image === wallSetted) return

                return { name: `${bg} - ${data.Name}`, value: bg }
            }) || []

            if (validWallpapers.length > 0) {

                return validWallpapers
                    .filter(a => a)
                    .filter(data => data.name.toLowerCase().includes(value.toLowerCase()))

                if (wallSetted)
                    mapped.unshift({
                        name: 'Retirar Background Atual',
                        value: 'bg0'
                    })
            }
        }

        if (name === 'buy_background') {

            const clientData = await this.Database.Client.findOne({ id: this.client.user.id }, 'BackgroundAcess') || []
            if (clientData?.BackgroundAcess.includes(this.user.id)) return []

            const userData = await this.Database.User.findOne({ id: this.user.id }, 'Walls') || []
            const userBackgrounds = userData.Walls?.Bg || []
            const backgrounds = Object.entries(this.Database.BgLevel.get('LevelWallpapers') || {})
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

            return walls?.map(bg => {

                let limit = bg[1]?.Limit > 0 ? ` | Estoque: ${bg[1]?.Limit || 0}` : ''
                let nameData = `${bg[0]} - ${bg[1].Name} | ${bg[1].Price} Safiras${limit}`

                if (nameData.length > 100)
                    nameData = nameData.slice(0, 97) + '...'

                return { name: nameData, value: bg[0] }

            })
                .filter(data => data.name.toLowerCase().includes(value.toLowerCase())) || []
        }

        if (name === 'level_options') {
            const clientData = await this.Database.Client.findOne({ id: this.client.user.id }, 'BackgroundAcess Administradores')
            const arr = [{ name: 'Esconder mensagem só para mim', value: 'hide' }]

            if (clientData.Administradores?.includes(this.user.id))
                arr.push({ name: 'Usuário que possuem acesso ao Backgrounds', value: 'list' })

            return arr
        }

        return []
    }
}

module.exports = SlashCommand