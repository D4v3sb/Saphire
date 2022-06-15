const { g } = require('../../../modules/Images/gifs.json')
const { e } = require('../../../JSON/emojis.json')

const gifData = [
    { name: 'Baka', description: 'Chame alguém de baka', embedTextOne: '🗣️ $user está te chamando de baka, $member.', embedTextTwo: '🗣️ $member e $user estão se chamando de baka, oh my God' },
    { name: 'Soco', description: 'Dê um soco bem dado em alguém', embedTextOne: '👊 $user está te dando socos $member', embedTextTwo: '👊 $member retribuiu o soco $user' },
    { name: 'Onegai', description: 'Implorar não faz mal', embedTextOne: '🙏 $user está te implorando $member' },
    { name: 'Olhando', description: 'Apeans olhando...', embedTextOne: '👀 $user está te olhando $member', embedTextTwo: '👀 $member também está te olhando $user' },
    { name: 'Beijar', description: 'Beije e beije', embedTextOne: '💋 $user está te beijando $member', embedTextTwo: '💋 $member devolvou seu beijo $user' },
    { name: 'Morder', description: 'As vezes, mordem faz bem', embedTextOne: `${e.Bite} $user está mordendo $member`, embedTextTwo: `${e.Bite} $member & $user estão se mordendo` },
    { name: 'Chupar', description: 'Cuidado com isso aqui', embedTextOne: '$user está te chupando $member', embedTextTwo: '$member devolveu a chupada $user' },
    { name: 'Matar', description: 'Kill kill kill!', embedTextOne: '🔪 $user está te matando $member', embedTextTwo: '🔪 $member & $user estão se MATANDO' },
    { name: 'Carinho', description: 'Mostre seu lado fofo', embedTextOne: `${e.pat} $user está te dando carinho $member`, embedTextTwo: `${e.pat} $member também está te dando carinho $user` },
    { name: 'Dedo', description: 'Tem pessoa que merece', embedTextOne: '🖕 $user está te mostrando o dedo $member', embedTextTwo: '🖕 $member te devolveu o dedo $user' },
    { name: 'Hug', description: 'Abraçar faz bem', embedTextOne: '🫂 $user está te dando um abraço $member', embedTextTwo: '🫂 $member também está te abraçando $user' },
    { name: 'Lamber', description: 'Você é um cachorro?', embedTextOne: '👅 $user está te lambendo $member', embedTextTwo: '👅 $member & $user estão se lambendo. Que nojo' },
    { name: 'Cutucar', description: 'Isso irrita de vez em quando', embedTextOne: '👉 $user está te cutucando $member', embedTextTwo: '👉 $member está te cutucando de volta $user' },
    { name: 'Tapa', description: 'Um tapa bem dado conserta muita coisa', embedTextOne: '🖐️ $user está te estapeando $member', embedTextTwo: '🖐️ $member te devolveu o tapa $user' },
    { name: 'Explodir', description: 'EXPLOOOOOSION', embedTextOne: '💥 $user está te explodindo $member', embedTextTwo: '💥 $member te explodiu $user' },
    { name: 'Tocaai', description: 'High Five', embedTextOne: '$user mandou um toca aí $member', embedTextTwo: '$member retribuiu o toca aí $user' },
    { name: 'Pisar', description: 'Pise e esmague', embedTextOne: '🦵 $user está pisando em você $member', embedTextTwo: '🦵 $member devolveu as pisadas' },
    { name: 'TeAmo', description: 'I love you', embedTextOne: '❤️ $user te ama $member', embedTextTwo: '❤️ $member também te ama $user' },
    { name: 'Cumprimentar', description: 'Eai, de boa?', embedTextOne: '$user está te cumprimentando $member', embedTextTwo: '$member retribuiu o cumprimento $user' },
    { name: 'Lutar', description: 'Fight! I\'m better than you!', embedTextOne: '⚔️ $user está lutando com você $member', embedTextTwo: '⚔️ $member entrou na briga e a coisa ficou séria com $user' },
    { name: 'Chutar', description: 'Chutar não é pisar!', embedTextOne: '🦶 $user está te chutando $member', embedTextTwo: '🦶 $member devolveu o chute $user' }
]

const data = {
    name: 'interaction',
    description: '[gifs] Interações gerais',
    dm_permission: false,
    type: 1,
    options: [
        {
            name: 'action',
            description: 'Qual é a sua interacação?',
            type: 3,
            required: true,
            choices: []
        },
        {
            name: 'user',
            description: 'Usuário da interação',
            type: 6,
            required: true
        }
    ]
}

for (let gif of gifData) {
    data.options[0].choices.push({
        name: gif.name.toLowerCase(),
        value: gif.name
    })
}

module.exports = {
    ...data,
    async execute({ interaction: interaction, client: client }) {

        const { options, user } = interaction

        let gifRequest = options.getString('action')
        let option = gifData.find(g => g.name === gifRequest)
        let member = options.getMember('user')
        let textOne = option.embedTextOne.replace('$user', user).replace('$member', member)
        let textTwo = option.embedTextTwo?.replace('$user', user).replace('$member', member)
        let rand = () => {
            return g[option.name][Math.floor(Math.random() * g[option.name].length)]
        }

        if (member.id === client.user.id)
            return await interaction.reply({
                content: `${e.Deny} | Fico feliz por você interagir comigo, mas nas interações, pelo menos por enquanto, eu estou fora de área.`,
                ephemeral: true
            })

        if (member.id === user.id)
            return await interaction.reply({
                content: `${e.Deny} | Sem interações próprias por aqui.`,
                ephemeral: true
            })

        const embed = {
            color: client.blue,
            description: textOne,
            image: { url: rand() },
            footer: { text: '🔁 retribuir' }
        }

        if (!option.embedTextTwo) {
            embed.footer = null
            return await interaction.reply({ embeds: [embed], fetchReply: true })
        }

        let msg = await interaction.reply({ embeds: [embed], fetchReply: true })
        msg.react('🔁').catch(() => { })

        return msg.createReactionCollector({
            filter: (r, u) => u.id === member.id && r.emoji.name === '🔁',
            time: 60000,
            max: 1,
            errors: ['time', 'max']
        })
            .on('collect', () => {

                msg.reactions.removeAll().catch(() => { })

                return msg.edit({
                    embeds: [{
                        color: '#bed324',
                        description: textTwo,
                        image: { url: rand() }
                    }]
                }).catch(() => { })
            })
            .on('end', collected => {
                if (collected.size > 0) return
                let embed = msg.embeds[0]
                if (!embed) return
                embed.color = client.red
                embed.footer = { text: 'Comando cancelado' }
                return msg.edit({ embeds: [embed] }).catch(() => { })
            })

    }
}