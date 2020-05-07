const Sequelize = require("sequelize");
let table = null
function create (sequelize, chat, branch) {
  let subscribe = sequelize.define("subscribe", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    }
  })

  chat.belongsToMany(branch, {through: subscribe, onDelete: "cascade"});
  branch.belongsToMany(chat, {through: subscribe, onDelete: "cascade"});
  if (table === null) table = subscribe
  else throw new Error('Таблица subscribe уже создана')
  return subscribe
}

async function add (chat, branch) {
  if (!chat || !branch) return null
  return await chat.addBranch(branch, {through: table})
}

async function remove (chat, branch) {
  if (!chat || !branch) return null
  return await chat.removeBranch(branch, {through: table})
}

async function getAllSubscribe (chat) {
  return table.findAll({
    where: {chatId: chat.id}
  })
}

async function getAllByBranchId (branchId) {
  let subscribes = await table.findAll({
    where: { branchId }
  })
  if (!subscribes) return []
  return subscribes
}

module.exports = {
  create,
  remove,
  add,
  getAllSubscribe,
  getAllByBranchId
}
