const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v10");
const { readdirSync } = require('fs')

module.exports = async (client) => {

    let commands = []
    let adminCommands = [] // Ideia dada por Gorniaky - 395669252121821227

    readdirSync('./src/slashCommands/').forEach(dir => {
        const commandsData = readdirSync(`./src/slashCommands/${dir}/`).filter(file => file.endsWith('.js'))

        for (let file of commandsData) {
            let pull = require(`../slashCommands/${dir}/${file}`)

            if (pull.name) {
                client.slashCommands.set(pull.name, pull);
                pull.admin ? adminCommands.push(pull) : commands.push(pull);
            } else
                continue
        }
    })

    const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_CLIENT_BOT_TOKEN)

    return (async () => {
        try {

            let guildsId = ['888464632291917956', '986292524790464562']

            for (let guild of guildsId)
                if (client.guilds.cache.has(guild))
                    rest.put(Routes.applicationGuildCommands(client.user.id, guild), { body: adminCommands })

            await rest.put(
                Routes.applicationCommands(client.user.id),
                { body: commands },
            );
            client.user.setActivity(`${client.commands.size + client.slashCommands.size} comandos em ${client.guilds.cache.size} servidores`, { type: 'PLAYING' });
            client.user.setStatus('idle');
            console.log('Slash Commands | OK!');
        } catch (error) {
            console.error(error);
        }
    })();
};