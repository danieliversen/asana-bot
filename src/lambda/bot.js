const axios = require('axios')
const qs = require('querystring')

// Assigns a task to a user
function assignTask (task) {
  const { TOKEN } = process.env
  let url = 'https://app.asana.com/api/1.0/tasks/' + task.resource
  console.log(url)
  axios.put(url, qs.stringify({
    assignee: 'me'
  }), {
    headers: {
      'Authorization': TOKEN
    }
  }).then(res => {
    console.log('Task %d assigned', task.resource)
  }).catch(error => {
    console.log(error)
    console.log('Task %d faild', task.resource)
  })
}

// Iterates through events, looking for new tasks to assign
exports.handler = function (event, context, callback) {
  // console.log('Listening to events in %d', config.PROJECT)
  let body = JSON.parse(event.body)
  // console.log(body.events)
  body.events.map((event) => {
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
