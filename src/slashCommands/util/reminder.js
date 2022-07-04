module.exports = {
    name: 'lembrete',
    description: '[util] Crie um novo lembrete',
    dm_permission: false,
    type: 1,
    options: [
        {
            name: 'mensagem',
            description: 'Me lembre de...',
            type: 3,
            required: true
        },
        {
            name: 'quando',
            description: 'Para quando é o lembrete?',
            type: 3,
            required: true
        }
    ],
    async execute({ interaction: interaction, client: client, database: Database, emojis: e, guildData: guildData, member: member }) {

        const moment = require('moment')
        let dataInfo = interaction.options.getString('mensagem')
        let when = interaction.options.getString('quando')
        let { user, channel } = interaction

        if (guildData?.AntLink && !member?.permissions?.toArray()?.includes('ADMINISTRATOR') && dataInfo.replace(/ /g, '').includes('discord.gg')) {
            return interaction.reply({
                content: `${e.antlink} | O sistema de antilink está ativado neste servidor.`,
                ephemeral: true
            })
        }

        let Args = when.trim().split(/ +/g),
            DefinedTime = 0,
            { day } = require('../../../modules/functions/plugins/eventPlugins')

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

            let now = Date.now()
            let allReminder = await Database.Reminder.find({})
            let has = allReminder.find(data =>
                new Date(data.DateNow + data.Time).setMilliseconds(0).valueOf() == (new Date(now + DefinedTime).setMilliseconds(0).valueOf())
                && data.ChannelId === interaction.channel.id
            )

            if (has)
                return await interaction.reply({
                    content: `${e.Deny} | Já existe um lembrete marcado para este horário neste canal. Por favor, defina um tempo diferente. Pode ser em segundos`,
                    ephemeral: true
                })

            const PassCode = require('../../../modules/functions/plugins/PassCode'),
                ReminderCode = PassCode(7).toUpperCase(),
                Data = require('../../../modules/functions/plugins/data')

            new Database.Reminder({
                id: ReminderCode,
                userId: user.id,
                RemindMessage: ReminderMessage,
                Time: DefinedTime,
                DateNow: now,
                ChannelId: channel.id
            }).save()

            return await interaction.reply({
                content: `✅ | Tudo bem! Eu vou te lembrar em **${Data(DefinedTime)}** daqui **${client.GetTimeout(DefinedTime, 0, false)}**`,
                embeds: [{ color: client.blue, title: 'Reminder Content', description: dataInfo }],
                ephemeral: true
            }).catch(() => { })
        }

    }
}