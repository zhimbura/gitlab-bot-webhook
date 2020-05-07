const stickers = require('../consts').stickers

module.exports = async (ctx) => {
  const db = global.DB
  let chat = await ctx.getChat()
  let userId = ctx.update.message.from.id
  let db_chat = await db.Chat.getChat(userId)
  let subscribes = await db.Subscribe.getAllSubscribe(db_chat)
  let branches = []
  for (let subscribe of subscribes) {
    let branch = await db.Branch.getById(subscribe.branchId)
    let project = await db.Project.getById(branch.projectId)
    branches.push(`${project.from}/${project.name}/${branch.name}`)
  }
  if (branches.length) {
    await ctx.reply('Текущие ветки:\n' + branches.join('\n'))
  } else {
    await ctx.telegram.sendSticker(chat.id, stickers.archi.empty)
  }
}
