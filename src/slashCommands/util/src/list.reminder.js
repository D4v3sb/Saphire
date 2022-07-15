const Database = require('../../../../modules/classes/Database')
const { e } = require('../../../../JSON/emojis.json')
const client = require('../../../../index')
const Data = require('../../../../modules/functions/plugins/data')

module.exports = async (interaction, request) => {

    const allReminders = await Database.Reminder.find({}) || []
    const userReminders = allReminders.filter(reminders => reminders.userId === interaction.user.id) || []

    const remindersFill = request === 'automatic'
        ? userReminders
        : userReminders.filter(reminder => !reminder.RemindMessage.includes('AUTOMATIC REMINDER'))

    if (userReminders.length === 0 || remindersFill?.length === 0)
        return await interaction.reply({
            content: `${e.Deny} | Você não tem nenhum lembrete ativo.`,
            ephemeral: true
        })

    const embeds = EmbedGenerator(remindersFill)
    const components = []

    if (embeds.length > 1)
        components.push({
            type: 1,
            components: [
                {
                    type: 2,
                    emoji: '⬅',
                    custom_id: 'left',
                    style: 'PRIMARY'
                },
                {
                    type: 2,
                    emoji: '➡',
                    custom_id: 'right',
                    style: 'PRIMARY'
                }
            ]
        })


    const msg = await interaction.reply({
        embeds: [embeds[0]],
        fetchReply: embeds.length > 1,
        components: embeds.length > 1 ? components : []
    })

    if (embeds.length <= 1) return
    let embedIndex = 0

    return msg.createMessageComponentCollector({
        filter: int => int.user.id === interaction.user.id,
        idle: 30000,
        errors: ['idle']
    })
        .on('collect', async int => {

            const { customId } = int

            int.deferUpdate().catch(() => { })

            if (customId === 'right') {
                embedIndex++
                if (!embeds[embedIndex]) embedIndex = 0
            } else {
                embedIndex--
                if (embedIndex < 0) embedIndex = embeds.length - 1
            }

            return await interaction.editReply({ embeds: [embeds[embedIndex]] }).catch(() => { })
        })
        .on('end', () => {

            const embed = msg.embeds[0]

            if (!embed) return interaction.editReply({ components: [] }).catch(() => { })

            embed.color = client.red
            return interaction.editReply({ components: [], embeds: [embed] })
        })

    function EmbedGenerator(array) {

        let amount = 10
        let page = 1
        const embeds = []
        const length = array.length / 10 <= 1 ? 1 : parseInt((array.length / 10) + 1)

        for (let i = 0; i < array.length; i += 10) {

            const current = array.slice(i, amount)
            const fields = current.map(data => ({ name: `🆔 \`${data.id}\``, value: `💭 ${data.RemindMessage?.length > 250 ? data.RemindMessage.slice(0, 250) + '...' : data.RemindMessage}\n⏱ ${Data(data.Time + data.DateNow, 0, false)}` }))
            const pageCount = length > 1 ? ` - ${page}/${length}` : ''

            embeds.push({
                color: client.blue,
                title: `${e.ReminderBook} Lista de Lembretes${pageCount}`,
                fields: [...fields],
                footer: { text: `${array.length} Lembretes ativos` }
            })

            page++
            amount += 10

        }

        return embeds
    }
}