module.exports = (wrongAnswer = 0, flags, control) => {

    if (wrongAnswer > 0) {
        let flag = flags?.random()

        if (flag.country === control.atualFlag.country || control.wrongAnswers.some(f => f.country === flag.country)) return randomizeFlags(1)
        else control.wrongAnswers.push(flag)
        return
    }

    let flag = flags?.random()
    if (flag.country === control.atualFlag.country) return randomizeFlags(0)
    control.atualFlag = flag
    return
}