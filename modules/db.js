const auth = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
}
const Sequelize = require("sequelize");
const sequelize = new Sequelize(auth.database, auth.user, auth.password, {
  dialect: "postgres",
  host: auth.host,
  port: auth.port,
  dialectOptions: {
    ssl: true
  }
})

const Branch = require('./dbModels/Branch')
const Project = require('./dbModels/Project')
const Chat = require('./dbModels/Chat')
const Subscribe = require('./dbModels/Subscribe')
const ChatProject = require('./dbModels/ChatProject')

const branch = Branch.create(sequelize)
const project = Project.create(sequelize, branch)
const chat = Chat.create(sequelize)
const subscribe = Subscribe.create(sequelize, chat, branch)
const chatToProject = ChatProject.create(sequelize, chat, project)

module.exports = {
  connect: async () => {
    try {
      return await sequelize.sync() // {force:true}
    } catch (e) {
      return false
    }
  },
  Branch,
  Project,
  Chat,
  Subscribe,
  ChatProject
}
