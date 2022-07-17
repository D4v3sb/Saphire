const Database = require('../../../../modules/classes/Database')
const { Quiz } = Database
const { e } = require('../../../../JSON/emojis.json')

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

    const answer = options.getString('answers')
    const answerIndex = question.answers.findIndex(a => a === answer)

    question.answers.splice(answerIndex, 1)
    quizData[questionIndex] = question
    Quiz.set('quiz', [...quizData])
    return await interaction.reply({ content: `${e.Check} | Resposta deletada com sucesso!` })
}