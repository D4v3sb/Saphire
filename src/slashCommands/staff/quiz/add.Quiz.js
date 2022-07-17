const Database = require('../../../../modules/classes/Database')
const { Quiz } = Database
const { e } = require('../../../../JSON/emojis.json')

module.exports = async (interaction) => {

    const { options } = interaction
    const question = options.getString('question')
    const answer = options.getString('answer')
    const answer2 = options.getString('answer2')
    const answer3 = options.getString('answer3')

    if (question.length > 1500 || answer.length > 1500 || answer2?.length > 1500 || answer3?.length > 1500)
        return await interaction.reply({
            content: `${e.Deny} | O limite máximo de caracteres em perguntas e respostas são de 1500.`,
            ephemeral: true
        })

    const newQuestion = { question: question, answers: [answer] }

    if (answer2) newQuestion.answers.push(answer2)
    if (answer3) newQuestion.answers.push(answer3)

    Quiz.push('quiz', newQuestion)

    return await interaction.reply({ content: `${e.Check} | Pergunta adicionada com sucesso!` })
}