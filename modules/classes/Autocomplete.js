class Autocomplete {
    constructor(data = {}) {
        this.interaction = interaction
        this.user = data.user
        this.member = data.member
        this.guild = data.guild
        this.channel = data.channel
        this.client = data.client
        this.error = require('../functions/config/interactionError')
        this.Database = require('./Database')
        this.e = this.Database.Emojis
    }

}

module.exports = Autocomplete