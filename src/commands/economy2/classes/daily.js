const { DatabaseObj: { config } } = require('../../../../modules/functions/plugins/database')
const Moeda = require('../../../../modules/functions/public/moeda')
const Vip = require('../../../../modules/functions/public/vip')
const Database = require('../../../../modules/classes/Database')
const e = Database.Emojis
const dailyPrizes = require('../../../../modules/functions/plugins/dailyPrizes')
const Reminder = require('../../../../modules/classes/Reminder')

class Daily {

    async execute(client, message, args, prefix, MessageEmbed, Database) {

        let authorData = await Database.User.findOne({ id: message.author.id }, 'Timeouts DailyCount')
        let clientData = await Database.Client.findOne({ id: client.user.id }, 'Titles.BugHunter PremiumServers')
        let bugHunters = clientData?.Titles.BugHunter || []
        let dailyTimeout = authorData?.Timeouts?.Daily || 0
        let count = authorData?.DailyCount || 0

        if (['status', 's', 'stats'].includes(args[0]?.toLowerCase())) return dailyUserInfo()

        if (count > 0 && dailyTimeout > 0 && !client.Timeout(172800000, dailyTimeout)) {
            resetSequence()
            return message.reply(`${e.SaphireCry} | Você perdeu a sequência do prêmio diário.`)
        }

        if (client.Timeout(86400000, dailyTimeout))
            return message.reply(`${e.Deny} | Calma calma, ainda falta **${client.GetTimeout(86400000, authorData?.Timeouts?.Daily)}** para você coletar o próximo prêmio.\n${e.Info} | Se você quiser ver os seus status, use \`${prefix}daily status\``)

        let data = { fields: [] }
        let prize = dailyPrizes[count]
        let over30 = { day: count, money: parseInt(Math.floor(Math.random() * 10000)), xp: parseInt(Math.floor(Math.random() * 10000)) }
        let isVip = await Vip(message.author.id)
        let moeda = await Moeda(message)

        if (count > 30) {
            if (over30.money < 1000) over30.money = 1000
            if (over30.xp < 500) over30.xp = 500
            prize = over30
        }

        let money = prize.money
        let xp = prize.xp

        if (message.guild.id === config.guildId) {
            let moneyBonus = bonusCalculate(money, 0.5)
            let xpBonus = bonusCalculate(xp, 0.5)
            prize.money += moneyBonus
            prize.xp += xpBonus
            data.fields.push({ name: '🏡 Servidor Principal', value: `+${moneyBonus} ${moeda} | +${xpBonus} ${e.RedStar} Experiência` })
        }

        if (bugHunters.includes(message.author.id)) {

            let moneyBonus = bonusCalculate(money, 0.3)
            let xpBonus = bonusCalculate(xp, 0.3)
            prize.money += moneyBonus
            prize.xp += xpBonus
            data.fields.push({ name: `${e.Gear} Bug Hunter`, value: `+${moneyBonus} ${moeda} | +${xpBonus} ${e.RedStar} Experiência` })
        }

        if (clientData?.PremiumServers?.includes(message.guild.id)) {

            let moneyBonus = bonusCalculate(money, 0.6)
            let xpBonus = bonusCalculate(xp, 0.6)
            prize.money += moneyBonus
            prize.xp += xpBonus
            data.fields.push({ name: `${e.Star} Servidor Premium`, value: `+${moneyBonus} ${moeda} | +${xpBonus} ${e.RedStar} Experiência` })
        }

        if (isVip) {
            let moneyBonus = bonusCalculate(money, 0.7)
            let xpBonus = bonusCalculate(xp, 0.7)
            prize.money += moneyBonus
            prize.xp += xpBonus
            data.fields.push({ name: `${e.VipStar} Adicional Vip`, value: `+${moneyBonus} ${moeda} | +${xpBonus} ${e.RedStar} Experiência` })
        }

        if (message.member.premiumSinceTimestamp) {
            let moneyBonus = bonusCalculate(money, 0.35)
            let xpBonus = bonusCalculate(xp, 0.35)
            prize.money += moneyBonus
            prize.xp += xpBonus
            data.fields.push({ name: `${e.Boost} Server Booster`, value: `+${moneyBonus} ${moeda} | +${xpBonus} ${e.RedStar} Experiência` })
        }

        let days = dailyPrizes.map(data => data.day),
            daysCountFormat = prize.day <= 31 ? days.map((num, i) => formatCalendar(num, i)).join('') : 'Um calendário comum não cabe a você.'

        data.fields.unshift({
            name: `${e.MoneyWings} Dinheiro e Experiências Adquiridas ${isVip || message.guild.id === config.guildId ? '*(total)*' : ''}`,
            value: `${prize.money} ${moeda} | ${prize.xp} ${e.RedStar} Experiência`
        })

        data.fields.push({ name: '📆 Calendário', value: `\`\`\`txt\n${daysCountFormat}\n\`\`\`` })
        setNewDaily()

        let msg = await message.reply({
            embeds: [
                new MessageEmbed()
                    .setColor(client.green)
                    .setTitle(`${e.SaphireLove} ${client.user.username} Daily Rewards`)
                    .setDescription(`Parabéns! Você está no **${prize.day}º** dia do daily rewards.`)
                    .addFields(...data.fields)
            ]
        })

        const dateNow = Date.now()

        return new Reminder(msg, {
            time: 86400000, // 24 hours
            user: message.author,
            client: client,
            confirmationMessage: `⏰ | Beleza, ${message.author}! Eu vou te lembrar do daily daqui \`ReplaceTIMER\``,
            reminderData: {
                userId: message.author.id,
                RemindMessage: 'AUTOMATIC REMINDER | Daily Disponível',
                Time: 86400000,
                DateNow: dateNow,
                isAutomatic: true,
                ChannelId: message.channel.id
            }
        }).showButton()

        function bonusCalculate(amount, porcent) {
            let bonus = parseInt(Math.floor(amount * porcent).toFixed(0))
            if (bonus <= 0) bonus++
            return bonus
        }

        async function setNewDaily() {

            await Database.User.updateOne(
                { id: message.author.id },
                {
                    'Timeouts.Daily': Date.now(),
                    $inc: {
                        DailyCount: 1,
                        Balance: prize.money,
                        Xp: prize.xp,
                    }
                },
                { upsert: true }
            )

            if (prize.money > 0) Database.PushTransaction(message.author.id, `${e.gain} Ganhou ${prize.money} Safiras no ${prize.day}º dia do *daily*.`)
            return
        }

        async function resetSequence() {

            await Database.User.updateOne(
                { id: message.author.id },
                {
                    $unset: {
                        'Timeouts.Daily': 1,
                        DailyCount: 1
                    }
                },
                { upsert: true }
            )
            return
        }

        function formatCalendar(num, i) {

            let breakLine = [7, 14, 21, 28].includes(i + 1) ? ' \n' : ' '

            if (num <= 9) num = `0${num}`

            return num <= prize.day ? `${num}${breakLine}` : `XX${breakLine}`
        }

        function dailyUserInfo() {

            if (count === 0)
                return message.reply(`${e.Info} | Você não tem nenhum dia consecutivo contabilizado.`)

            return message.reply(`${e.Info} | Atualmente, você resgatou **${count - 1}** prêmios diários consecutivos.`)
        }

    }

}

module.exports = Daily