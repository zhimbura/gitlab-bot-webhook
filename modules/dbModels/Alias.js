const Sequelize = require("sequelize");

let table = null

function create(sequelize) {
    let chat = sequelize.define("alias", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        gitlabUserName: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        telegramUserName: {
            type: Sequelize.STRING,
            allowNull: false,
        },
    })
    if (table === null) table = chat
    else throw new Error('Таблица chat уже создана')
    return chat
}

async function getTelegramName(gitlabUserName) {
    let info = await table.findOne({
        where: {gitlabUserName}
    })
    return info ? info.telegramUserName : null
}

async function addAlias(telegramUserName, gitlabUserName) {
    let info = await getTelegramName(gitlabUserName)
    if (!info) {
        info = table.create({gitlabUserName, telegramUserName})
    }
    return info
}

async function getGitLabName(telegramUserName) {
    let info = await table.findOne({
        where: {telegramUserName}
    })
    return info ? info.gitlabUserName : null
}


module.exports = {
    create,
    getTelegramName,
    getGitLabName,
    addAlias
}
