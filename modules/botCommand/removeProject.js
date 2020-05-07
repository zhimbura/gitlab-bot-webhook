const stickers = require('../consts').stickers

module.exports = async (ctx) => {
  const db = global.DB
  let chat = await ctx.getChat()
  let projects = ctx.update.message.text.replace('/removeproject', '')
    .replace('@oss_bss_wc_bot', '')
    .split(' ')
    .map(pName => pName.trim())
    .filter(i => i && i.length)
  let addProjects = []
  if (projects.length > 0) {
    for (let i = 0; i < projects.length; i++) {
      let projectDetails = projects[i].split('/')
      if (projectDetails.length === 2) {
        addProjects.push(projects[i])
        let from = projectDetails[0]
        let name = projectDetails[1]
        let db_project = await db.Project.get(name, from)
        let db_chat = await db.Chat.getChat(chat.id)
        await db.ChatProject.remove(db_chat, db_project)
      }
    }
  }
  if (addProjects.length === 0) {
    await ctx.telegram.sendSticker(chat.id, stickers.archi.empty)
  } else {
    await ctx.reply('Удалены проекты:\n' + addProjects.join('\n'))
  }
}
