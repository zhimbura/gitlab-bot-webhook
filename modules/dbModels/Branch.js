const Sequelize = require("sequelize");

let table = null

function create (sequelize) {
  let branch = sequelize.define("branch", {
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
  })
  if (table === null) table = branch
  else throw new Error('Таблица branch уже создана')
  return branch
}

async function getByProject (name, project) {
  let branche = await table.findOne({
    where: { name, projectId: project.id }
  })
  if (!branche) {
    branche = await project.createBranch({ name })
  }
  return branche
}

async function removeByProject (branch, project) {
  if (!branch || !project) return false
  return await project.removeBranch(branch)
}

async function getById (id) {
  let branch = await table.findOne({
    where: { id }
  })
  return branch
}

module.exports = {
  create,
  getByProject,
  removeByProject,
  getById
}
