const Database = require('../../../classes/Database')
const flags = Database.Flags.get('Flags') || []

async function generateButtons(control, formatString) {

    for (let i = 0; i < 5; i++)
    await randomizeFlags(i, control)

    let answersArray = [...control.wrongAnswers, control.atualFlag],
        buttons = [{ type: 1, components: [] }]

    answersArray.sort(() => Math.random() - Math.random())

    for (let flag of answersArray)
        buttons[0].components.push({
            type: 2,
            label: formatString(flag.country[0]),
            custom_id: flag.country[0],
            style: 'PRIMARY'
        })

    control.buttons = buttons
    return
}

function randomizeFlags(wrongAnswer = 0, control) {

    let flag = flags.random()

    if (wrongAnswer > 0) {

        return control?.atualFlag?.country?.includes(flag.country[0]) || control?.wrongAnswers.some(f => f.country[0] === flag.country[0])
            ? randomizeFlags(1)
            : control?.wrongAnswers.push(flag)
    }

    if (control?.atualFlag?.country?.includes(flag.country[0])) return randomizeFlags(0)
    control.atualFlag = flag
    return
}

module.exports = generateButtons