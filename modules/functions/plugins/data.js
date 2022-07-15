function Data(DateInMs = 0, Shorted = false, withDateNow = true) {

    if (Shorted)
        return new Date(DateInMs + Date.now()).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })

    const date = withDateNow ? new Date(DateInMs + Date.now()) : new Date(DateInMs)
    date.setHours(date.getHours() - 3)

    const Mes = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"][date.getMonth()]
    const DiaDaSemana = ["Domingo", "Segunda-Feira", "Terça-Feira", "Quarta-Feira", "Quinta-Feira", "Sexta-Feira", "Sábado"][date.getDay()]
    const Dia = FormatNumber(date.getDate())
    const Hora = FormatNumber(date.getHours())
    const Seconds = FormatNumber(date.getSeconds())
    const Minutes = FormatNumber(date.getMinutes())
    const Ano = date.getFullYear()

    return `${DiaDaSemana}, ${Dia} de ${Mes} de ${Ano} ás ${Hora}:${Minutes}${Seconds > 0 ? `:${Seconds}` : ''}`
}

function FormatNumber(data) {
    return data < 10 ? `0${data}` : data
}

module.exports = Data