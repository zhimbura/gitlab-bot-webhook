module.exports = async (ctx) => {
    const db = global.DB
    let chat = await ctx.getChat()
    let message = ctx.update.message.text.replace('/message', '')
        .replace('@oss_bss_wc_bot', '')
    if (chat.username === process.env.ADMIN_USERNAME && message.length) {
        let chats = await db.Chat.getChats()
        for (let chatId of chats) {
            await ctx.telegram.sendMessage(chatId, message)
        }
        await ctx.reply(`Отправлено в ${chats.length} чатов`)
    }

}
