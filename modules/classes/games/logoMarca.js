const Database = require('../Database')
const client = require('../../../index')
const util = require('../../../src/structures/util')
const { e } = require('../../../JSON/emojis.json')
const { formatString, emoji } = require('../../../src/commands/games/plugins/gamePlugins')

class LogoMarcaGame {
    constructor(interaction, logoData) {
        this.interaction = interaction
        this.logoData = [...logoData].randomize()
        this.channel = interaction.channel
        this.channelId = this.channel.id
        this.gameData = { counter: 0, round: 1, users: [], sandBox: false }
        this.collectors = {}
        this.msg = undefined
        this.embed = { color: util.HexColors[this.interaction.options.getString('color')] || '#9BFF85' }
    }

    async registerNewGameAndStart() {
        if (Database.Cache.get('logomarca')?.includes(this.channelId)) return
        Database.Cache.push('logomarca', this.channelId)

        const embed = [{
            color: client.blue,
            title: `${e.logomarca} ${client.user.username}'s Logo & Marca Quiz`,
            description: `${e.Loading} | Carregando Logos & Marcas e registrando canal...`
        }]

        this.msg = this.interaction.replied
            ? await this.channel.send({ embeds: embed })
            : await this.interaction.reply({ embeds: embed, fetchReply: true })

        return setTimeout(() => this.game(), 4000)
    }

    getLogo() {
        let logo = this.gameData.sandBox ? this.logoData.random() : this.logoData[0]
        if (!logo) {
            this.gameData.sandBox = true
            this.logoData = [...Database.Logomarca.get('LogoMarca')]?.randomize()
            logo = this.logoData[0]
        }
        if (!this.gameData.sandBox) this.logoData.splice(0, 1)
        return logo
    }

    async game() {

        const logo = this.getLogo()
        if (!logo) return finish()

        this.gameData.logo = logo
        this.embed.image = { url: logo.images.censored ?? logo.images.uncensored }
        this.embed.title = `${e.logomarca} ${client.user.username}'s Logo & Marca Quiz`
        this.embed.description = `${e.Loading} Qual o nome desta marca?`
        this.embed.footer = { text: `Round: ${this.gameData.round} | ${this.gameData.sandBox ? 'SANDBOX ATIVADO' : `${this.logoData.length} Imagens Restantes`}` }
        this.msg?.delete().catch(() => { })
        this.msg = this.interaction.replied
            ? await this.channel.send({ embeds: [this.embed] })
            : await this.interaction.reply({ embeds: [this.embed], fetchReply: true })

        return this.initCollectors()
    }

    async initCollectors() {

        this.gameData.round++

        this.collectors.collectorCounter = this.channel.createMessageCollector({
            filter: msg => true,
            time: 20000
        })
            .on('collect', async msg => {

                this.gameData.counter++
                if (this.gameData.counter < 10) return
                this.msg.delete().catch(() => { })
                this.gameData.counter = 0
                return this.msg = await msg.channel.send({ embeds: [this.embed] })

            })
            .on('end', (i, r) => {
                if (r === 'user') return
                this.collectors.collectorRightAnswer?.stop()
                return this.finish()
            })

        this.collectors.collectorRightAnswer = this.channel.createMessageCollector({
            filter: msg => !msg.author.bot && this.gameData.logo.name.find(name => name.toLowerCase() === msg.content?.toLowerCase()),
            max: 1
        })
            .on('collect', async msg => {

                this.collectors.collectorCounter?.stop()
                this.gameData.counter = 0
                this.addAccept(msg.author)
                this.embed.image = { url: this.gameData.logo.images.uncensored }
                this.embed.description = `${e.Check} | ${msg.author} acertou a marca \`${formatString(this.gameData.logo.name[0])}\`\n${e.Loading} | Carregando próximo round...`
                this.msg.delete().catch(() => { })
                this.msg = await msg.reply({
                    embeds: [
                        this.embed, {
                            color: client.blue,
                            title: `${e.Gear} Gaming System`,
                            description: `${e.Loading} | Carregando próximo round...`
                        }
                    ]
                })
                return setTimeout(() => this.game(), 5000)
            })

        return
    }

    async addAccept(user) {

        let has = this.gameData.users.find(u => u.id === user.id)

        has
            ? has.points++
            : this.gameData.users.push({ id: user.id, points: 1 })

        return this.format()
    }

    async format() {

        const field = this.embed.fields || []
        const mapped = this.gameData.users.sort((a, b) => b.points - a.points).slice(0, 5).map((u, i) => `${emoji(i)} ${this.interaction.guild.members.cache.get(u.id)} - ${u.points} Pontos`).join('\n')

        return field.length > 0
            ? this.embed.fields[0] = { name: 'Pontuação', value: mapped || 'Nenhum usuário foi encontrado' }
            : this.embed.fields = { name: 'Pontuação', value: mapped || 'Nenhum usuário foi encontrado' }

    }

    async finish() {
        Database.Cache.pull('logomarca', this.channelId)
        this.embed.color = client.red
        this.embed.description = `${e.Deny} | Ninguém acertou a marca \`${formatString(this.gameData.logo.name[0])}\``
        this.embed.image = { url: this.gameData.logo.images.uncensored }
        this.msg.delete().catch(() => { })
        this.msg = await this.channel.send({
            embeds: [this.embed],
            components: [
                {
                    type: 1,
                    components: [{
                        type: 2,
                        label: 'REINICIAR',
                        emoji: '🔄',
                        custom_id: 'reset',
                        style: 'PRIMARY'
                    }]
                }
            ]
        })
        return this.resetGame()
    }

    async resetGame() {

        return this.msg.createMessageComponentCollector({
            filter: int => true,
            time: 60000
        })
            .on('collect', async int => {

                const { customId } = int

                this.gameData = { counter: 0, round: 0, users: [], sandBox: false }
                this.embed = { color: util.HexColors[this.interaction.options.getString('color')] || '#9BFF85' }
                this.msg.edit({ components: [] }).catch(() => { })
                return this.registerNewGameAndStart()
            })
            .on('end', () => this.msg.edit({ components: [] }).catch(() => { }))

    }
}

module.exports = LogoMarcaGame