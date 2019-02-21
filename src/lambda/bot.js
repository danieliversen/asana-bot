const axios = require('axios')
const qs = require('querystring')

// Assigns a task to a user
function assignTask (task) {
  const { TOKEN } = process.env
  let url = 'https://app.asana.com/api/1.0/tasks/' + task.resource
  axios.put(url, qs.stringify({
    assignee: 'me'
  }), {
    headers: {
      'Authorization': TOKEN
    }
  }).then(res => {
    console.log('Task %d assigned', task.resource)
  }).catch(error => {
    console.log('Task %d failed', task.resource)
    console.log(error)
  })
}

// Iterates through events, looking for new tasks to assign
exports.handler = function (event, context, callback) {
  // console.log('Listening to events in %d', config.PROJECT)
  let body = JSON.parse(event.body)
  body.events.map((event) => {
    console.log(event)
    if ((event.type === 'task') && (event.action === 'added')) {
      assignTask(event)
    }
  })

  // Release webhook
  callback(null, {
    statusCode: 200,
    body: 'work done *beep*'
  })
}
