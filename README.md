# 🤖 Asana Bot --- WIP

This is a custom bot that connects to your Asana via API web-hooks and performs specific actions on your tasks. It should be deployed in [Netlify](https://netlify.com)'s Lambda functions.

## Configuration

Add the following [Netlify's environment variables](https://www.netlify.com/docs/continuous-deployment/#build-environment-variables):

- **TOKEN**: your personal Asana TOKEN (format _Bearer XXX_)
- **PROJECT**: the Asana project this bot should be actively listening to events (_id_)
- **SECTION_DONE**: the kanban board section where finished tasks should go (_id_)

## Functionality

- Assigns a task to you (default user) if the task was created without an assignee
- Assigns a default due date (2 weeks from creation date) if the task had not a due date or date-time
- Marks a task as completed when moved to the _Done_ board
- Moves the task to the _Done_ board when marked as completed

## References

If you have troubles setting things up, [this blog post](https://travishorn.com/netlify-lambda-functions-from-scratch-1186f61c659e) is a great starting point.
