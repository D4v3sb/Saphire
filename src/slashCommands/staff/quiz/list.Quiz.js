const Database = require('../../../../modules/classes/Database')
const { Quiz } = Database
const { e } = require('../../../../JSON/emojis.json')
const client = require('../../../../index')

module.exports = async (interaction) => {

    const quizData = Quiz.get('quiz')
    const embeds = await EmbedGenerator(quizData)
    let arrayIndex = 0

    const buttons = {
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
    }

    const msg = await interaction.reply({
        embeds: [embeds[0]],
        fetchReply: embeds.length > 1,
        components: embeds.length > 1 ? [buttons] : []
    })

    if (embeds.length <= 1) return

    const collector = msg.createMessageComponentCollector({
        filter: int => int.user.id === interaction.user.id,
        idle: 30000
    })
        .on('collect', async int => {

            const { customId } = int

            if (customId === 'right') {
                arrayIndex++
                if (!embeds[arrayIndex]) arrayIndex = 0
            }

            if (customId === 'left') {
                arrayIndex--
                if (!embeds[arrayIndex]) arrayIndex = embeds.length - 1
            }

            await int.deferUpdate().catch(() => { })
            return await interaction.editReply({ embeds: [embeds[arrayIndex]] }).catch(() => { })
        })
        .on('end', async () => {
            const embed = msg.embeds[0]

            if (!embed) return await interaction.editReply({ components: [] }).catch(() => { })

            embed.color = client.red
            return await interaction.editReply({ embeds: [embed], components: [] }).catch(() => { })
        })

    function EmbedGenerator(array) {

        let amount = 10
        let page = 1
        let embeds = []
        let counter = 1
        let length = array.length / 10 <= 1 ? 1 : parseInt((array.length / 10) + 1)

        for (let i = 0; i < array.length; i += 10) {

            const current = array.slice(i, amount)
            const description = current.map(quiz => `> ${counter++}. **${quiz.question}**\n> ${quiz.answers.length > 1 ? `${quiz.answers.length} Respostas` : '1 Resposta'}`).join('\n \n')
            const pageCount = length > 1 ? ` - ${page}/${length}` : ''

            embeds.push({
                color: client.blue,
                title: `${e.Commands} Lista de Perguntas do Quiz${pageCount}`,
                description: description,
                footer: { text: `${quizData.length} Perguntas` }
            })

            page++
            amount += 10

        }

        return embeds
    }
}