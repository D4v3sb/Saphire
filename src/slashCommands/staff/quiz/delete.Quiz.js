const Database = require('../../../../modules/classes/Database')
const { Quiz } = Database
const { e } = require('../../../../JSON/emojis.json')

module.exports = async (interaction) => {

    const { options } = interaction
    const questionIndex = options.getString('quiz_question')
    const quizData = Quiz.get('quiz')
    const question = quizData[questionIndex]

    if (!question)
        return await interaction.reply({
            content: `${e.Deny} | Nenhuma pergunta foi encontrada.`,
            ephemeral: true
        })

    quizData.splice(questionIndex, 1)
    Quiz.set('quiz', [...quizData])
    return await interaction.reply({ content: `${e.Check} | Pergunta deletada com sucesso!` })
}