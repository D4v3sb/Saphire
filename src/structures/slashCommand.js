const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v10");
const { readdirSync } = require('fs')

module.exports = async (client) => {

    let commands = [];

    readdirSync('./src/slashCommands/').forEach(dir => {
        const commandsData = readdirSync(`./src/slashCommands/${dir}/`).filter(file => file.endsWith('.js'))

        for (let file of commandsData) {
            let pull = require(`../slashCommands/${dir}/${file}`)

            if (pull.name) {
                client.slashCommands.set(pull.name, pull);
                commands.push(pull);
            } else
                continue
        }
    })

    const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_CLIENT_BOT_TOKEN)

    return (async () => {
        try {
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