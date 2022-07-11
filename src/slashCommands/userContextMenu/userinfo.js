const { Flags: flags } = require('../../structures/util')

module.exports = {
    name: 'User Info',
    dm_permission: false,
    type: 2,
    async execute({ interaction: interaction, client: client, database: Database, emojis: e }) {

        const { targetUser: user, targetMember: member, guild, user: author } = interaction
        const Data = require('../../../modules/functions/plugins/data')
        const { Config: config } = Database
        const Colors = require('../../../modules/functions/plugins/colors')
        const components = []
        const userData = {}
        const memberData = {}

        const userflags = user?.flags?.toArray() || []
        userData.Bandeiras = `${userflags.length > 0 ? userflags.map(flag => `\`${flags[flag] ? flags[flag] : flag}\``).join(', ') : 'Nenhuma'}`
        userData.system = user.system ? '\n🧑‍💼 `\`Usuário do Sistema\``' : ''
        userData.avatar = user.avatarURL({ dynamic: true, format: "png", size: 1024 })
        userData.bot = user.bot ? '\`Sim\`' : '\`Não\`'
        userData.createAccount = `<t:${parseInt(user.createdAt.getTime() / 1000)}:f>`
        userData.timeoutAccount = client.formatTimestamp(user.createdAt.getTime())

        if (member) {
            memberData.joinedAt = Data(member.joinedAt.getTime(), false, false)
            memberData.joinedTimestamp = client.formatTimestamp(member.joinedAt.getTime())
            memberData.onwer = (guild.ownerId === user.id) ? '\`Sim\`' : '\`Não\`'
            memberData.adm = member.permissions.toArray().includes('ADMINISTRATOR') ? '\`Sim\`' : '\`Não\`'
            memberData.associado = member.pending ? '\`Não\`' : '\`Sim\`'
            memberData.premiumSince = member.premiumSinceTimestamp ? `\n${e.Boost} Booster há: \`${client.formatTimestamp(member.premiumSinceTimestamp)}\`` : ''
            memberData.roles = member.roles.cache.filter(r => r.name !== '@everyone').map(r => `\`${r.name}\``).join(', ') || '\`Nenhum cargo\`'
            memberData.permissions = (() => {

                if (user.id === guild.ownerId) return `${user.username} é o dono*(a)* do servidor. Possui todas as permissões.`

                return member.permissions.toArray().map(perm => `\`${config.Perms[perm]}\``).join(', ')
            })()
        }

        const colorData = member ? await Colors(user.id) : client.blue
        const whoIs = user.id === author.id ? 'Suas Informações' : `Informações de ${user.username}`

        const embeds = [
            {
                color: colorData,
                title: `${e.Info} ${whoIs}`,
                description: `Resultado: ${member ? user : user.username}`,
                fields: [
                    {
                        name: '👤 Usuário',
                        value: `✏️ Nome: ${user.tag} | \`${user.id}\`\n🤖 Bot: ${userData.bot}\n🏳️ Bandeiras: ${userData.Bandeiras}${userData.system}\n📆 Criou a conta em: \`${userData.createAccount}\`\n⏱️ Criou a conta faz: \`${userData.timeoutAccount}\``
                    }
                ],
                thumbnail: { url: userData.avatar }
            },
            {
                color: colorData,
                title: `${e.Info} ${guild.name} | ${whoIs}`,
                fields: [
                    {
                        name: '🔰 Servidor',
                        value: `✏️ Nome no servidor: ${member?.displayName}\n${e.OwnerCrow} Dono: ${memberData?.onwer}\n${e.ModShield} Administrador: ${memberData?.adm}\n🎨 Cor: \`${member?.displayHexColor}\`\n🤝 Associado: ${memberData?.associado}${memberData?.premiumSince}\n📅 Entrou em: \`${memberData?.joinedAt}\`\n⏱️ Entrou no servidor faz: \`${memberData?.joinedTimestamp}\``
                    },
                    {
                        name: '@ Cargos',
                        value: memberData?.roles
                    }
                ]
            },
            {
                color: colorData,
                title: `${e.Info} ${whoIs}`,
                fields: [
                    {
                        name: '⚙️ Permissões',
                        value: `${memberData?.permissions}`
                    }
                ]
            }
        ]

        const integrations = await guild.fetchIntegrations() || []
        const application = integrations.find(data => data.application.id === user.id)?.application

        if (application) {
            const embed = { color: client.blue, title: `🤖 Informações da Integração` }

            embed.description = application.description || null
            embeds.push(embed)
            components.push({
                type: 1,
                components: [
                    {
                        type: 2,
                        label: 'ADICIONAR BOT',
                        emoji: '🔗',
                        url: `https://discord.com/oauth2/authorize?client_id=${application.id}&scope=bot%20applications.commands&permissions=2146958847`,
                        style: 'LINK'
                    }
                ]
            })
        }

        return await interaction.reply({ embeds: embeds, ephemeral: true, components: components })

    }
}