const Database = require('./Database')
const { Emojis: e } = Database
const Modals = require('./Modals')
const client = require('../../index')

class ButtonInteraction extends Modals {
    constructor(interaction) {
        super()
        this.interaction = interaction
        this.customId = interaction.customId
        this.user = interaction.user
        this.channel = interaction.channel
        this.guild = interaction.guild
    }

    execute() {

        switch (this.customId) {
            case 'setStatusChange': this.setStatusCommand(); break;
            case 'editProfile': this.editProfile(); break;
            case 'newProof': this.newProof(); break;
            case 'closeProof': this.newProof(true); break;
            case 'getVotePrize': this.topGGVote(); break;
            default:
                break;
        }

        return
    }

    async setStatusCommand() {

        let data = await Database.User.findOne({ id: this.user.id }, 'Perfil.Status'),
            status = data?.Perfil?.Status || null,
            modal = this.setNewStatus

        if (status) {
            modal.components[0].components[0].label = 'Altere seu status'
            modal.components[0].components[0].value = status
        }

        await this.interaction.showModal(modal)

    }

    async newProof(close = false) {

        const { guild, interaction, user } = this

        let hasChannel = guild.channels.cache.find(ch => ch.topic === user.id)

        if (close) {
            if (!hasChannel)
                return await interaction.reply({
                    content: '❌ | Você não possui nenhum canal aberto no servidor.',
                    ephemeral: true
                })

            hasChannel.delete().catch(async () => {
                return await interaction.reply({
                    content: '❌ | Falha ao deletar o seu canal.',
                    ephemeral: true
                })
            })

            return await interaction.reply({
                content: '✅ | Canal deletado com sucesso!',
                ephemeral: true
            })
        }

        if (hasChannel)
            return await interaction.reply({
                content: `❌ | Você já possui um canal aberto no servidor. Ele está aqui: ${hasChannel}`,
                ephemeral: true
            })

        let arr = [], parentId = '893307009246580746'
        guild.channels.cache.map(ch => arr.push(ch.parentId))

        let parentIds = [...new Set(arr)].filter(d => typeof d === 'string')

        if (!parentIds.includes(parentId))
            parentId = null

        const { Permissions } = require('discord.js')

        return guild.channels.create(user.tag, {
            type: 'GUILD_TEXT',
            topic: user.id,
            parent: parentId,
            permissionOverwrites: [
                {
                    id: guild.id,
                    deny: [Permissions.FLAGS.VIEW_CHANNEL],
                },
                {
                    id: user.id,
                    allow: [Permissions.FLAGS.VIEW_CHANNEL, Permissions.FLAGS.SEND_MESSAGES, Permissions.FLAGS.ATTACH_FILES, Permissions.FLAGS.EMBED_LINKS],
                }
            ],
            reason: `Solicitado por ${user.id}`
        }).then(async channel => {
            channel.send(`${e.Check} | ${user}, o seu canal de comprovante foi aberto com sucesso!\n🔍 | Mande o **COMPROVANTE** do pagamento/pix/transação contendo **DATA, HORA e VALOR**.\n${e.Info} | Lembrando! Cada real doado é convertido em 15.000 Safiras + 7 Dias de VIP`)
            return await interaction.reply({
                content: `✅ | Canal criado com sucesso. Aqui está ele: ${channel}`,
                ephemeral: true
            })
        }).catch(async err => {
            if (err.code === 30013)
                return await interaction.reply({
                    content: 'ℹ | O servidor atingiu o limite de **500 canais**.',
                    ephemeral: true
                })

            return await interaction.reply({
                content: `❌ | Ocorreu um erro ao criar um novo canal.\n\`${err}\``,
                ephemeral: true
            })
        })

    }

    async editProfile() {

        const data = await Database.User.findOne({ id: this.user.id }, 'Perfil')
        const title = data?.Perfil?.Titulo || null
        const job = data?.Perfil?.Trabalho || null
        const niver = data?.Perfil?.Aniversario || null
        const status = data?.Perfil?.Status || null
        const modal = this.editProfileModal

        if (job) {
            modal.components[0].components[0].label = job ? 'Alterar Profissão' : 'Qual sua profissão?'
            modal.components[0].components[0].value = job.length >= 5 ? job : null
        }

        if (niver) {
            modal.components[1].components[0].label = niver ? 'Alterar Aniversário' : 'Digite seu aniversário'
            modal.components[1].components[0].value = niver.length >= 5 ? niver : null
        }

        if (status) {
            modal.components[2].components[0].label = status ? 'Alterar Status' : 'Digite seu novo status'
            modal.components[2].components[0].value = status.length >= 5 ? status : null
        }

        if (data?.Perfil?.TitlePerm)
            modal.components.unshift({
                type: 1,
                components: [
                    {
                        type: 4,
                        custom_id: "profileTitle",
                        label: title ? "Alterar título" : "Qual seu título?",
                        style: 1,
                        min_length: 3,
                        max_length: 20,
                        placeholder: "Escrever novo título",
                        value: title?.length >= 5 ? title : null
                    }
                ]
            })

        return await this.interaction.showModal(modal)
    }

    async topGGVote() {

        const Topgg = require('@top-gg/sdk')
        const api = new Topgg.Api(process.env.TOP_GG_TOKEN)

        const hasVoted = await api.hasVoted(this.user.id)
        const userData = await Database.User.findOne({ id: this.user.id }, 'Timeouts.TopGGVote')
        const guildData = await Database.User.findOne({ id: this.guild.id }, 'Moeda')
        const timeout = client.Timeout(43200000, userData?.Timeouts.TopGGVote)
        const moeda = guildData?.Moeda || `${e.Coin} Safiras`

        if (hasVoted && timeout)
            return await this.interaction.reply({
                content: `${e.Info} | ${this.user}, você já votou nas últimas 12 horas. Espere esse tempo passar.`,
            })

        await Database.User.updateOne(
            { id: this.user.id },
            {
                $inc: {
                    Balance: 3000,
                    Xp: 1000
                },
                'Timeouts.TopGGVote': Date.now()
            },
            { upsert: true }
        )

        return await this.interaction.reply({ content: `${e.Check} | ${this.user}, você resgatou sua recompensa de voto e ganhou **+5000 ${moeda}** & **+1000 XP ${e.RedStar}**` })
    }

}

module.exports = ButtonInteraction
