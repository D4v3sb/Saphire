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

    const newQuestion = options.getString('new_question')

    if (newQuestion.length > 1500)
        return await interaction.reply({
            content: `${e.Check} | O limite máximo de caracteres é de 1500 por pergunta.`,
            ephemeral: true
        })

    quizData[questionIndex].question = newQuestion
    Quiz.set('quiz', quizData)
    return await interaction.reply({ content: `${e.Check} | Pergunta editada com sucesso!` })
}