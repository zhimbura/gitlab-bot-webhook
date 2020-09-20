module.exports = async (ctx) => {
    const db = global.DB
    let chat = await ctx.getChat()
    let message = ctx.update.message.text.replace('/message', '')
        .replace('@oss_bss_wc_bot', '')
    if (chat.username === process.env.ADMIN_USERNAME && message.length) {
        let success = []
        let errors = []
        let chats = await db.Chat.getChats()
        for (let chatId of chats) {
            try {
                await ctx.telegram.sendMessage(chatId, message)
                success.push(chatId)
            } catch (err) {
                console.log(err)
                errors.push(`${chatId}: ${err.message}`)
            }
        }
        let result = 'Отправлено'
        result += `\nУспешно: ${success.length}`
        result += `\nОшибки: ${errors.length}`
        result += errors.join('\n\n')
        await ctx.reply(result)
    }

}
