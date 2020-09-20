const express = require('express');
const router = express.Router();
const Telegram = require('telegraf/telegram')
const telegram = new Telegram(process.env.BOT_TOKEN)
const util = require('../../modules/util')
const consts = require('../../modules/consts')
const GitResponse = require('../../modules/classes/gitResponse')

const mergeRequest = require('./mergeRequest')
const pipeline = require('./pipeline')

router.post('/', async function (req, res, next) {
    if (req.body.object_attributes) {
        req[consts.PROP_MESSAGE] = new GitResponse(global.DB)
        await req[consts.PROP_MESSAGE].createData(req.body.project.name, req.body.project.namespace)
        next()
    } else {
        res.status(404).send('notFound')
    }
})

router.post('/', pipeline)
router.post('/', mergeRequest)


/* GET users listing. */
router.post('/', async function (req, res, next) {
    if (req[consts.PROP_MESSAGE] && req[consts.PROP_MESSAGE] instanceof GitResponse) {
        let gitResponse = req[consts.PROP_MESSAGE]
        let message = gitResponse.getMessage()
        if (!message.length || gitResponse.hasCash(message + gitResponse.projectName)) {
            return res.send('ok')
        }
        gitResponse.addCash(message + gitResponse.projectName, 2 * 60 * 100)
        let chatsIds = gitResponse.getChats()
        for (let chat of chatsIds) {
            try {
                await telegram.sendMessage(chat.id, message)
            } catch (e) {
                if (e.code === 400) {
                    await global.DB.Chat.removeChatById(chat.id)
                } else {
                    console.log(e.message)
                }
            }
        }
    }
    res.send('ok');
});

module.exports = router;


