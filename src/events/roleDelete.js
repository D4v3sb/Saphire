const client = require('../../index')
const Notify = require('../../modules/functions/plugins/notify')
const Database = require('../../modules/classes/Database')

client.on('roleDelete', async (role) => {

    let guild = await Database.Guild.findOne({ id: role.guild.id }, 'Autorole')
    if (!guild?.Autorole || guild.Autorole.length === 0 || !guild.Autorole.includes(role.id)) return

    await Database.Guild.updateOne(
        { id: role.guild.id },
        { $pull: { Autorole: role.id } }
    )

    return Notify(role.guild.id, 'Autorole Desabilitado', `O cargo **${role.name}** configurado no sistema de **Autorole** foi deletado.`)
})