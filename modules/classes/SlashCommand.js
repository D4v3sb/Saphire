const Modals = require('./Modals')
const client = require('../../index')
const statcord = require('../../statcord')

class SlashCommand extends Modals {
    constructor(interaction) {
        super()
        this.interaction = interaction
        this.user = interaction.user
        this.member = interaction.member
        this.guild = interaction.guild
        this.channel = interaction.channel
        this.error = require('../functions/config/interactionError')
        this.Database = require('./Database')
        this.e = this.Database.Emojis
    }

    async execute(guildData, clientData) {

        const command = client.slashCommands.get(this.interaction.commandName);
        if (!command) return

        const { Config: config } = this.Database
        const admins = [...clientData.Administradores, this.Database.Config.ownerId]
        const staff = [...clientData.Administradores, ...clientData.Moderadores, config.ownerId, '327496267007787008']

        if (command.admin && !admins.includes(this.interaction.user.id))
            return await this.interaction.reply({
                content: `${this.e.Deny} | Este comando é exclusivo para meus administradores.`,
                ephemeral: true
            })

        if (command.staff && !staff.includes(this.interaction.user.id))
            return await this.interaction.reply({
                content: `${this.e.Deny} | Este comando é exclusivo para os membros da equipe Saphire's Team.`,
                ephemeral: true
            })

        await command.execute({
            interaction: this.interaction,
            emojis: this.e,
            database: this.Database,
            client: client,
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

        const { guild, e, Database, interaction, user, channel } = this

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
        statcord.postCommand(this.interaction.commandName, this.user.id)
        return await this.Database.Client.updateOne(
            { id: client.user.id },
            {
                $inc: {
                    ComandosUsados: 1,
                    [`CommandsCount.${this.interaction.commandName}`]: 1
                }
            },
            { upsert: true }
        )
    }
}

module.exports = SlashCommand