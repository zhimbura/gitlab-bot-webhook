const Telegraf = require('telegraf')
const consts = require('./consts')

const bot = new Telegraf(process.env.BOT_TOKEN)

const subscribe = require('./botCommand/subscribe')
const unsubscribe = require('./botCommand/unsubscribe')
const addProject = require('./botCommand/addProject')
const removeProject = require('./botCommand/removeProject')
const showProjects = require('./botCommand/showProjects')
const showSubscribe = require('./botCommand/showSubscribe')
const userNameSetter = require('./botCommand/userNameSetter')

bot.command('help', (ctx) => {
  ctx.reply(consts.helpText)
})

bot.command('subscribe', subscribe)
bot.command('subscribe@oss_bss_wc_bot', subscribe)

bot.command('unsubscribe', unsubscribe)
bot.command('unsubscribe@oss_bss_wc_bot', unsubscribe)

// telegraf-inline-menu
bot.command('addproject', addProject)
bot.command('addproject@oss_bss_wc_bot', addProject)

bot.command('removeproject', removeProject)
bot.command('removeproject@oss_bss_wc_bot', removeProject)

bot.command('showprojects', showProjects)
bot.command('showprojects@oss_bss_wc_bot', showProjects)

bot.command('showsubscribe', showSubscribe)
bot.command('showsubscribe@oss_bss_wc_bot', showSubscribe)

bot.command('aliasme', userNameSetter)
bot.command('aliasme@oss_bss_wc_bot', userNameSetter)


global.bot = bot
