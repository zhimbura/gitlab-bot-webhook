const express = require('express');
const router = express.Router();
const store = require('../modules/store')
const Telegram = require('telegraf/telegram')
const telegram = new Telegram(process.env.BOT_TOKEN)
const util = require('../modules/util')

const fakeCash = new Set()

/* GET users listing. */
router.post('/', async function(req, res) {
  let message = await util.createPipelineResponse(req.body)
  let db = global.DB
  let project = req.body.project
  let attr = req.body.object_attributes
  if (!message.length || fakeCash.has(message + project)) {
    return res.send('ok')
  }
  fakeCash.add(message + project)
  setTimeout(() => {
    fakeCash.delete(message + project)
  }, 60000)
  let db_project = await db.Project.get(project.name, project.namespace)
  let db_branch = await db.Branch.getByProject(attr.ref, db_project)
  let db_chats_id = await db.ChatProject.getChatsId(db_project)
  let chatsIds = []
  for (let id of db_chats_id) {
    let chat = await db.Chat.getChatById(id)
    if (chat) {
      chatsIds.push({
        id: chat.telegramChatId,
        stepsIncluded: chat.stepsIncluded
      })
    }
  }
  let db_subscribes = await db.Subscribe.getAllByBranchId(db_branch.id)
  for (let subscribe of db_subscribes) {
    let chat = await db.Chat.getChatById(subscribe.chatId)
    if (chat) {
      let index = chatsIds.findIndex(c => c.id === chat.id)
      if (index) {
        chatsIds.push({
          id: chat.telegramChatId,
          stepsIncluded: chat.stepsIncluded
        })
      }
    }
  }
  for (let chat of chatsIds) {
    try {
      await telegram.sendMessage(chat.id, message)
    } catch (e) {
      if (e.code === 400) {
        await db.Chat.removeChatById(chat.id)
      } else {
        console.log(e.message)
      }
    }
  }
  res.send('ok');
});

module.exports = router;


