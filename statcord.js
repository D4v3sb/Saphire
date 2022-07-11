const { Client } = require("statcord.js")
const client = require('./index')

const statcord = new Client({ client: client, key: process.env.STATCORD_KEY })

statcord.on("autopost-start", () => console.log("Statcord Data Connection | OK!"))

statcord.on("post", status => {
    if (!status) return;

    const Database = require('./modules/classes/Database')
    const { Config } = Database
    
    return client.users.cache.get(Config.ownerId)?.send({
        embeds: [
            {
                color: client.red,
                title: 'STATCORD ERROR',
                description: `\`\`\`txt\n${`${status}`?.slice(0, 4090)}\n\`\`\``
            }
        ]
    })
})

module.exports = statcord