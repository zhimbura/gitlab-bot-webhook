const Sequelize = require("sequelize");
let table = null
function create (sequelize, branch) {
  let project = sequelize.define("project", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    from: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  })
  if (table === null) table = project
  else throw new Error('Таблица project уже создана')
  project.hasMany(branch)
  return project
}

async function get (name, from) {
  let project = await table.findOne({
    where: { name, from }
  })
  if (!project) {
    project = await table.create({ name, from })
  }
  return project
}

async function getById (id) {
  let project = await table.findOne({
    where: { id }
  })
  return project
}

async function remove (name, from) {
  let project = await table.findOne({
    where: { name, from }
  })
  if (project) {
    return project.destroy()
  }
  return false
}

async function getChats (project) {
  return await project.getChats()
}

module.exports = {
  create,
  get,
  remove,
  getChats,
  getById
}
