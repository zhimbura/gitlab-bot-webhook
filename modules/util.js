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
function createPipelineResponse (webhookInfo) {
  let text = ''
  if (webhookInfo.object_kind === 'pipeline' ) {
    let attr = webhookInfo.object_attributes
    let status = getStatus(attr.status)
    if (status.length) {
      text = `Status: ${status} (${attr.status})
Branch: ${attr.ref}
User: @${webhookInfo.user.username}
Commit message: ${webhookInfo.commit.message}
URL Pipeline: ${webhookInfo.project.web_url}/pipelines/${attr.id}`
      if (attr.status === 'failed') {
        let errors = webhookInfo.builds.filter(build => {
          return build.status === 'failed'
        })
        if (errors.length) {
          for (let err of errors) {
            text += `\nJob: ${err.name}`
            text += `\nError url: ${webhookInfo.project.web_url}/-/jobs/${err.id}`
          }
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
