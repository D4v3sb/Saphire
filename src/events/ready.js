const { DatabaseObj: { e, config } } = require('../../modules/functions/plugins/database')
const client = require('../../index')
const Data = require('../../modules/functions/plugins/data')
const Database = require('../../modules/classes/Database')
const init = require('../../modules/functions/plugins/initSystems')
const statcord = require('../../statcord')

client.on("ready", async () => {

    await Database.MongoConnect(client)

    // EXTERNAL SERVICES
    statcord.autopost()
    // client.topGGAutoPoster()

    Database.registerClient(client.user.id)
    Database.openLotery(client.user.id)
    Database.Cache.clear()

    let data = await Database.Client.findOne({ id: client.user.id }, 'Rebooting')

    await Database.Client.updateOne(
        { id: client.user.id },
        { $unset: { Rebooting: 1 } }
    )

    if (data?.Rebooting?.ON) {
        let channel = client.channels.cache.get(data.Rebooting?.ChannelId)
        let msg = await channel?.messages.fetch(data.Rebooting.MessageId)

        if (msg)
            msg?.edit(`${e.Check} | Reboot concluído com sucesso!`).catch(() => { })
    }

    const msg = await client.channels.cache.get(config.LogChannelId)?.send(`⏱️ Initial Ping: \`${client.ws.ping}ms\`\n${e.Check} Login: \`${Data()}\``)

    init(client)
    console.log('Event Ready | OK!')

    setTimeout(() => msg?.delete().catch(() => { }), 3000)
    return
})