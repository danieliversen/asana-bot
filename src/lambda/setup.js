const axios = require('axios')
const qs = require('querystring')
const { TOKEN, BOT_URL } = process.env

exports.handler = function (event, context, callback) {
  // Adding a new webhook
  if (event.httpMethod == "POST"){
      console.log(event)
      let body = JSON.parse(event.body)

      let url = "https://app.asana.com/api/1.0/webhooks"
      let content = {
        target: BOT_URL,
        resource: body.project
  }
      axios.post(url, qs.stringify(content), {
        headers: {
          'Authorization': TOKEN
        }
      }).then(res => {
        callback(null, {
          statusCode: 200,
          body: 'Project added'
        })
      }).catch(error => {
        console.log(error.response.data.errors)
        callback(null, {
          statusCode: 200,
          body: 'Adding project failed'
        })
      })
      return
  }
  // Deleting webhook
  if (event.httpMethod == "DELETE"){
      console.log(event)
      let body = JSON.parse(event.body)
      console.log(event)
  //     let url = "https://app.asana.com/api/1.0/webhooks"
  //     let content = {
  //       target: BOT_URL,
  //       resource: body.project
  // }
  //     axios.post(url, qs.stringify(content), {
  //       headers: {
  //         'Authorization': TOKEN
  //       }
  //     }).then(res => {
  //       callback(null, {
  //         statusCode: 200,
  //         body: 'Project added'
  //       })
  //     }).catch(error => {
  //       console.log(error.response.data.errors)
  //       callback(null, {
  //         statusCode: 200,
  //         body: 'Adding project failed'
  //       })
  //     })
      return
  }
  callback(null, {
    statusCode: 200,
    body: 'Nothing to do'
  })
}
