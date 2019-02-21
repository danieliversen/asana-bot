const axios = require('axios')
const qs = require('querystring')
const { TOKEN } = process.env

// Updates contents of the new task
function newTask (task) {
  let update = {}
  if (!task.assignee) {
    update.assignee = 'me'
  }
  if (!task.due_on && !task.due_at) {
    let dueDate = new Date(Date.now() + 12096e5) // two weeks from now
    update.due_on = dueDate.toISOString().slice(0, 10) // format YYY-MM-DD
  }
  if (update === {}) {
    return
  }
  let url = 'https://app.asana.com/api/1.0/tasks/' + task.id
  axios.put(url, qs.stringify(update), {
    headers: {
      'Authorization': TOKEN
    }
  }).then(res => {
    console.log('Task %d updated', task.id)
  }).catch(error => {
    console.log('Task %d failed', task.id)
    console.log(error)
  })
}

function editedTask (task) {
  let update = {}
  if (!task.completed && (task.memberships[0].section.name === 'Done')) {
    update.completed = true
  }
  if (task.completed && (task.memberships[0].section.name !== 'Done')) {
    update.memberships = task.memberships
    update.memberships[0].section = {
      id: 1110079029864564,
      gid: '1110079029864564',
      name: 'Done',
      resource_type: 'section'
    }
  }
  if (update === {}) {
    return
  }
  let url = 'https://app.asana.com/api/1.0/tasks/' + task.id
  axios.put(url, qs.stringify(update), {
    headers: {
      'Authorization': TOKEN
    }
  }).then(res => {
    console.log('Task %d updated', task.id)
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
    if ((event.type === 'task') && ((event.action === 'added') || (event.action === 'changed'))) {
      // assignTask(event)
      let url = 'https://app.asana.com/api/1.0/tasks/' + event.resource
      axios.get(url, {
        headers: {
          'Authorization': TOKEN
        }
      }).then(res => {
        let task = res.data.data
        if (event.action === 'added') {
          newTask(task)
        } else {
          editedTask(task)
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
