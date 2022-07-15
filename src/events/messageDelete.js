const client = require('../../index')
const Notify = require('../../modules/functions/plugins/notify')
const Database = require('../../modules/classes/Database')

client.on('messageDelete', async message => {

    const giveaway = await Database.Giveaway.findOne({ MessageID: message.id })

    if (!giveaway) return

    Database.deleteGiveaway(message.id)
    return Notify(message.guild.id, 'Sorteio cancelado', `A mensagem do sorteio \`${message.id}\` foi deleta. Todas as informações deste sorteio foram deletadas.`)

})