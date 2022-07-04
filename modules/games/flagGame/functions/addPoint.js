const Database = require('../../../classes/Database')

function addPoint(User, control) {

    let data = control.usersPoints.find(data => data.name === User.username)

    data?.name
        ? data.points++
        : control.usersPoints.push({ name: User.username, points: 1 })

    Database.addGamingPoint(User.id, 'FlagCount', 1)
    return
}

module.exports = addPoint