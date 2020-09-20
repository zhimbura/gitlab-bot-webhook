const express = require('express');
const router = express.Router();
const util = require('../../modules/util')
const consts = require('../../modules/consts')


router.post('/', async function (req, res, next) {
    let data = req.body
    if (!req[consts.PROP_MESSAGE] || data.object_kind !== 'merge_request') {
        next()
        return
    }
    let db = global.DB
    let attr = data.object_attributes
    await req[consts.PROP_MESSAGE].addBranch(attr.source_branch)
    await req[consts.PROP_MESSAGE].addBranch(attr.target_branch)
    let authorName = await db.Alias.getTelegramName(data.user.username) || data.user.username
    let assignees = []
    for (let assignee of data.assignees) {
        let telegramName = await db.Alias.getTelegramName(assignee.username)
        assignees.push(telegramName || assignee.username)
    }
    let message = ''
    message += `❗❗❗ Merge request ${attr.source_branch} => ${attr.target_branch}`
    message += `\nTitle: ${attr.title}`
    message += `\nStatus: ${attr.merge_status}`
    message += `\nState: ${attr.state}`
    message += `\nAction: ${attr.action}`
    message += `\nAuthor: @${authorName}`
    if (attr.merge_status === 'can_be_merged') {
        message += `\nAssignee: @${assignees.join(', @')}`
    }
    message += `\nURL: ${attr.url}`
    if (data.labels.length) {
        message += `\nLabels:\n\t${data.labels.map(l => l.title).join('\n\t')}`
    }
    await req[consts.PROP_MESSAGE].addMessage(message)
    next()
});

module.exports = router;


