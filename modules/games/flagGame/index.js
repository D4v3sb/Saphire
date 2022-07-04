const plugins = require('../plugins')
const init = require('./functions/init')
const generateButtons = require('./functions/generateButtons')
const addPoint = require('./functions/addPoint')
const randomizeFlags = require('./withoutOptions/randomize')

module.exports = {
    plugins,
    init,
    generateButtons,
    addPoint,
    randomizeFlags
}