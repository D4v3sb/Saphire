const Database = require('../../../../modules/classes/Database')
const { Quiz } = Database
const { e } = require('../../../../JSON/emojis.json')
const client = require('../../../../index')

module.exports = async (interaction) => {

    const { options } = interaction
    const questionIndex = options.getInteger('quiz_question')
    const quizData = Quiz.get('quiz')
    const question = quizData[questionIndex]

    if (!question)
        return await interaction.reply({
            content: `${e.Deny} | Nenhuma pergunta foi encontrada.`,
            ephemeral: true
        })

    const embed = {
        color: client.blue,
        title: `${e.saphireLendo} | Quiz Question Viewer`,
        description: `${e.QuestionMark} ${question.question}`,
        fields: []
    }

    for (let i = 0; i < question.answers.length; i++)
        embed.fields.push({ name: `Resposta ${i + 1}`, value: question.answers[i] })

    if (embed.fields.length > 5) {
        embed.fields.length = 5
        embed.fields[4] = { name: 'Limite Excedido', value: `${question.answers.length - 4} respostas restantes.` }
    }

    return await interaction.reply({ embeds: [embed] })
}