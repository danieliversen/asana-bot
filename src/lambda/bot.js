const axios = require('axios')
const qs = require('querystring')
const { TOKEN } = process.env

// Assigns a task to a user
function assignTask (task) {
  let url = 'https://app.asana.com/api/1.0/tasks/' + task.id
  axios.put(url, qs.stringify({
    assignee: 'me'
  }), {
    headers: {
      'Authorization': TOKEN
    }
  }).then(res => {
    console.log('Task %d assigned', task.id)
  }).catch(error => {
    console.log('Task %d failed', task.id)
    console.log(error)
  })
}

// Iterates through events, looking for new tasks to assign
exports.handler = function (event, context, callback) {
  let body = JSON.parse(event.body)
  body.events.map((event) => {
    console.log(event)
    if ((event.type === 'task') && (event.action === 'added')) {
      // assignTask(event)
      let url = 'https://app.asana.com/api/1.0/tasks/' + event.resource
      axios.get(url, {
        headers: {
          'Authorization': TOKEN
        }
      }).then(res => {
        let task = res.data.data
        if (!task.assignee) {
          assignTask(task)
        }
        if (!task.due_on) {
          console.log('NO DUE DATE')
        }
      }).catch(error => {
        console.log('Retrieving task %d failed', event.resource)
        console.log(error)
      })
    }
  })

  // Release webhook
  callback(null, {
    statusCode: 200,
    body: 'work done *beep*'
  })
}
