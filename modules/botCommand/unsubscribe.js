const stickers = require('../consts').stickers
module.exports = async (ctx) => {
  const db = global.DB
  let update = ctx.update
  let userId = ctx.update.message.from.id
  let chat = await ctx.getChat()
  let db_chat_group = await db.Chat.getChat(chat.id)
  let branches = update.message.text.replace('/unsubscribe', '')
    .replace('@oss_bss_wc_bot', '')
    .trim()
    .split(' ')
    .filter(i => i && i.length)
    .map(b => b.trim())
  let addedBranch = []
  let projectsFromChat = []
  if (branches.length) {
    let projectsId = await db.ChatProject.getProjectsId(db_chat_group)
    for (let id of projectsId) {
      let project = await db.Project.getById(id)
      if (project) {
        projectsFromChat.push(project)
      }
    }
    if (projectsFromChat.length) {
      let db_chat = await db.Chat.getChat(userId)
      for (let i = 0; i < branches.length; i++) {
        let branchDetails =  branches[i].split(':')
        if (branchDetails.length === 2) {
          let project = projectsFromChat.find(p => p.id === parseInt(branchDetails[0]))
          if (project) {
            let branch = await db.Branch.getByProject(branchDetails[1], project)
            await db.Subscribe.remove(db_chat, branch)
            addedBranch.push(`${project.from}/${project.name}/${branchDetails[1]}`)
          }
        } else if (branches.length === 1) {
          for (let project of projectsFromChat) {
            let branch = await db.Branch.getByProject(branches[i], project)
            await db.Subscribe.remove(db_chat, branch)
            addedBranch.push(`${project.from}/${project.name}/${branches[i]}`)
          }
        }
      }
    }
  }
  if (addedBranch.length) {
    await ctx.reply(update.message.from.first_name + ' Вы отписались от веток:\n ' + addedBranch.join('\n '))
  } else {
    await ctx.telegram.sendSticker(chat.id, stickers.archi.empty)
  }
}
