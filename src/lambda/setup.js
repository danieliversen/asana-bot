exports.handler = function (event, context, callback) {
  callback(null, {
    statusCode: 200,
    headers: {
      'X-Hook-Secret': event.headers['x-hook-secret']
    },
    body: null
  })
}
