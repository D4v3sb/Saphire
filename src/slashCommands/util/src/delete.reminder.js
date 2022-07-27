const Database = require('../../../../modules/classes/Database')
const { e } = require('../../../../JSON/emojis.json')

module.exports = async (interaction, reminderId) => {

    if (!reminderId)
        return await interaction.reply({
            content: `${e.Deny} | Nenhum ID foi definido ao executar o comando.`,
            ephemeral: true
        })

    if (reminderId === 'all') return deleteAll()

    const reminder = await Database.Reminder.findOne({ id: reminderId })

    if (!reminder)
        return await interaction.reply({
            content: `${e.Deny} | Nenhum lembrete foi encontrado.`,
            ephemeral: true
        })

    if (reminder.userId !== interaction.user.id)
        return await interaction.reply({
            content: `${e.Deny} | Este lembrete não pertence a você.`,
            ephemeral: true
        })

    await Database.Reminder.deleteOne({ id: reminderId })

    return await interaction.reply({
        content: `${e.Check} | O lembrete \`${reminderId}\` foi deletado com sucesso.`,
        ephemeral: true
    })

    async function deleteAll() {

        const allReminders = await Database.Reminder.find({}) || []
        const userReminders = allReminders.filter(reminders => reminders.userId === interaction.user.id)

        if (userReminders.length === 0)
            return await interaction.reply({
                content: `${e.Deny} | Você não possui nenhum lembrete.`,
                ephemeral: true
            })

        await Database.Reminder.deleteMany({ userId: interaction.user.id })
        return await interaction.reply({
            content: `${e.Check} | Todos os seus lembretes foram deletados.`,
            ephemeral: true
        })
    }
}