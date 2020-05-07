const stickers = require('../consts').stickers

module.exports = async (ctx) => {
  const db = global.DB
  let chat = await ctx.getChat()
  let db_chat = await db.Chat.getChat(chat.id)
  let projectsId = await db.ChatProject.getProjectsId(db_chat)
  let projects = []
  for (let id of projectsId) {
    let project = await db.Project.getById(id)
    if (project) {
      projects.push(`${project.id}) ${project.from}/${project.name}`)
    }
  }
  if (projects.length === 0) {
    await ctx.telegram.sendSticker(chat.id, stickers.archi.empty)
  } else {
    await ctx.reply('Текущие проекты:\n' + projects.join('\n'))
  }
}
