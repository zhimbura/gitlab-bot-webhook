const express = require('express');
const router = express.Router();
const util = require('../../modules/util')
const consts = require('../../modules/consts')

router.post('/', async function (req, res, next) {
    if (!req[consts.PROP_MESSAGE] || req.body.object_kind !== 'pipeline' || req.body.merge_request) {
        next()
        return
    }
    let webhookInfo = req.body
    let attr = webhookInfo.object_attributes
    await req[consts.PROP_MESSAGE].addBranch(attr.ref)
    let db = global.DB
    let text = ''
    webhookInfo.builds.sort((a, b) => {
        if (a.id > b.id) return -1
        if (a.id < b.id) return 1
        return 0
    })
    let gitLabUser = webhookInfo.builds[0].user.username
    let userName = '@' + (await db.Alias.getTelegramName(gitLabUser) || gitLabUser)
    if (gitLabUser !== webhookInfo.user.username) {
        userName += ', @' + (await db.Alias.getTelegramName(webhookInfo.user.username) || webhookInfo.user.username)
    }
    let status = util.getStatus(attr.status)
    if (status.length) {
        text = util.createPipelineResponse(
            status,
            attr.status,
            webhookInfo.project.name,
            attr.ref,
            userName,
            webhookInfo.commit.message,
            webhookInfo.project.web_url,
            attr.id
        )
        if (attr.status === 'failed') {
            let errors = webhookInfo.builds.filter(build => build.status === 'failed')
            if (errors.length) {
                for (let err of errors) {
                    text += `\nJob: ${err.name}`
                    text += `\nError url: ${webhookInfo.project.web_url}/-/jobs/${err.id}`
                }
            }
        }
    }
    req[consts.PROP_MESSAGE].addMessage(text)
    next()
});

module.exports = router;


