const Sequelize = require("sequelize");
let table = null
function create (sequelize, chat, project) {
  let chatProject = sequelize.define("chatProject", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    }
  })

  chat.belongsToMany(project, {through: chatProject, onDelete: "cascade"});
  project.belongsToMany(chat, {through: chatProject, onDelete: "cascade"});
  if (table === null) table = chatProject
  else throw new Error('Таблица chatProject уже создана')
  return chatProject
}

async function add (chat, project) {
  if (!chat || !project) return null
  return await chat.addProject(project, {through: table})
}

async function remove (chat, Project) {
  if (!chat || !Project) return null
  return await chat.removeProject(Project, {through: table})
}

async function getChatsId (project) {
  let rels = await table.findAll({
    where: { projectId: project.id }
  })
  if (rels) {
    let result = []
    for (let rel of rels) {
      if (!~result.indexOf(rel.chatId)) {
        result.push(rel.chatId)
      }
    }
    return result
  }
  return []
}

async function getProjectsId (chat) {
  let rels = await table.findAll({
    where: { chatId: chat.id }
  })
  if (rels) {
    let result = []
    for (let rel of rels) {
      if (!~result.indexOf(rel.projectId)) {
        result.push(rel.projectId)
      }
    }
    return result
  }
  return []
}

module.exports = {
  create,
  remove,
  add,
  getChatsId,
  getProjectsId
}
