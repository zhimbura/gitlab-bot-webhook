function getStatus(status) {
    let text = ''
    //, pending, , , , skipped, created
    switch (status) {
        case 'running':
            text = '▶'
            break
        case 'canceled':
            text = '❕'
            break
        case 'success':
            text = '✅'
            break
        case 'failed':
            text = '❗'
            break
    }
    return text
}

async function createPipelineResponse(webhookInfo) {
    let text = ''
    webhookInfo.builds.sort((a, b) => {
      if (a.id > b.id) return -1
      if (a.id < b.id) return 1
      return 0
    })
    let db = global.DB
    let gitLabUser = webhookInfo.builds[0].user.username
    let userName = '@' + (await db.Alias.getTelegramName(gitLabUser) || gitLabUser)
    if (gitLabUser !== webhookInfo.user.username) {
        userName += ', @' + (await db.Alias.getTelegramName(webhookInfo.user.username) || webhookInfo.user.username)
    }
    let attr = webhookInfo.object_attributes
    let status = getStatus(attr.status)
    if (status.length) {
        text = `Status: ${status} (${attr.status})
Project: ${webhookInfo.project.name}
Branch: ${attr.ref}
User(s): ${userName}
Commit message: ${webhookInfo.commit.message}
URL Pipeline: ${webhookInfo.project.web_url}/pipelines/${attr.id}`
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
    return text
}

module.exports = {
    getStatus,
    createPipelineResponse
}
