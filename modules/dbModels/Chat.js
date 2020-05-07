const Sequelize = require("sequelize");

let table = null

function create (sequelize) {
  let chat = sequelize.define("chat", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    telegramChatId: {
      type: Sequelize.BIGINT,
      allowNull: false,
    },
    stepsIncluded: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    }
  })
  if (table === null) table = chat
  else throw new Error('Таблица chat уже создана')
  return chat
}

async function getChat (telegramChatId) {
  let chat = await table.findOne({
    where: { telegramChatId }
  })
  if (!chat) {
    chat = await table.create({ telegramChatId })
  }
  return chat
}

async function removeChatById (id) {
  try {
   await table.destroy({
     where: { id }
   })
   return true
  } catch (e) {
    console.log(e)
    return false
  }
}

async function getChatById (id) {
  let chat = await table.findOne({
    where: { id }
  })
  return chat
}

async function getChatByProjectId (projectId) {
  let chats = await table.findAll({
    where: { projectId }
  })
  if (!chats) return []
  return chats
}



// async function getProjectsToString (telegramChatId) {
//   let projects = await getProjects(telegramChatId)
//   if (projects) {
//     return projects.map(project => `${project.id}) ${project.from}/${project.name}`)
//   }
//   return []
// }

module.exports = {
  create,
  getChat,
  // getProjectsToString,
  getChatByProjectId,
  getChatById,
  removeChatById
}
