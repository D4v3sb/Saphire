const Database = require('../../../../modules/classes/Database')
const { Quiz } = Database
const { e } = require('../../../../JSON/emojis.json')

module.exports = async (interaction) => {

    const { options } = interaction
    const questionIndex = options.getInteger('quiz_question')
    const quizData = Quiz.get('quiz')
    const question = quizData[questionIndex]
    const answer = options.getString('new_answer')
    const answer2 = options.getString('new_answer2')
    const answer3 = options.getString('new_answer3')
    const answer4 = options.getString('new_answer4')

    if (answer.length > 1500 || answer2?.length > 1500 || answer3?.length > 1500 || answer4?.length > 1500)
        return await interaction.reply({
            content: `${e.Deny} | O limite máximo de caracteres em respostas são de 1500.`,
            ephemeral: true
        })

    if (!question)
        return await interaction.reply({
            content: `${e.Deny} | Nenhuma pergunta foi encontrada.`,
            ephemeral: true
        })

    const answersData = [answer]

    if (answer2) answersData.push(answer2)
    if (answer3) answersData.push(answer3)
    if (answer4) answersData.push(answer4)

    quizData[questionIndex].answers.push(...answersData)
    Quiz.set('quiz', [...quizData])
    return await interaction.reply({ content: `${e.Check} | Respostas adicionas com sucesso!` })
}