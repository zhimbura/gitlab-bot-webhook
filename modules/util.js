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

function createPipelineResponse(
    status,
    textStatus,
    project,
    branch,
    userName,
    commitMessage,
    urlPipeline,
    projectUrl,
    id
) {
    return `Status: ${status} (${textStatus})
Project: ${project}
Branch: ${branch}
User(s): ${userName}
Commit message: ${commitMessage}
URL Pipeline: ${projectUrl}/pipelines/${id}`
}

function createMergeResponse (data) {

}

module.exports = {
    getStatus,
    createPipelineResponse,
    createMergeResponse
}
