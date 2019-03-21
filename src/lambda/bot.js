const axios = require('axios')
const qs = require('querystring')
const { TOKEN, PROJECT, SECTION_DONE } = process.env

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

function completeTask (task) {
  let update = {
    completed: true
  }
  let url = 'https://app.asana.com/api/1.0/tasks/' + task.id
  axios.put(url, qs.stringify(update), {
    headers: {
      'Authorization': TOKEN
    }
  }).then(res => {
    console.log('Task %d completed', task.id)
  }).catch(error => {
    console.log('Task %d failed', task.id)
    console.log(error)
  })
}

function moveToSectionDone (task) {
  let update = {
    project: PROJECT,
    section: SECTION_DONE,
    insert_after: null
  }
  let url = 'https://app.asana.com/api/1.0/tasks/' + task.id + '/addProject'
  axios.post(url, qs.stringify(update), {
    headers: {
      'Authorization': TOKEN
    }
  }).then(res => {
    console.log('Task %d completed', task.id)
  }).catch(error => {
    console.log('Task %d failed', task.id)
    console.log(error)
  })
}

function editedTask (task) {
  if (!task.completed && (task.memberships[0].section.id === SECTION_DONE)) {
    completeTask()
    return
  }

  if (task.completed && (task.memberships[0].section.id !== SECTION_DONE)) {
    moveToSectionDone(task)
  }
}

// Iterates through events, looking for new tasks to assign
exports.handler = function (event, context, callback) {
  // Validate if this is Setup phase
  let xHook = event.headers['x-hook-secret'] {
  if xHook != null {
    callback(null, {
      statusCode: 200,
      headers: {
        'X-Hook-Secret': xHook
      },
      body: null
    })
    return
  }
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
