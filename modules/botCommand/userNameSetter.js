const stickers = require('../consts').stickers

module.exports = async (ctx) => {
    const db = global.DB
    let chat = await ctx.getChat()
    let gitlabName = ctx.update.message.text.replace('/aliasme', '')
        .replace('@oss_bss_wc_bot', '')
        .split(' ')
        .map(pName => pName.trim())
        .filter(i => i && i.length)
    if (gitlabName.length === 0) {
        await ctx.telegram.sendSticker(chat.id, stickers.archi.empty)
    } else {
        if (db.Alias.addAlias(chat.username, gitlabName[0])) {
            await ctx.reply(`Пара ${gitlabName[0]}(GitLab)-${chat.username}(telegram) создана`)
            await ctx.telegram.sendSticker(chat.id, stickers.archi.success)
        } else {
            await ctx.reply(`Произошла какая-то ошибка`)
            await ctx.telegram.sendSticker(chat.id, stickers.rabbit.error)
        }
    }
}
