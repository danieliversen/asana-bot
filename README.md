# 🤖 Asana Bot --- WIP

This is a custom bot that connects to your Asana via API web-hooks and performs specific actions on your tasks. It should be deployed in [Netlify](https://netlify.com)'s Lambda functions.

## Configuration

Add the following [Netlify's environment variables](https://www.netlify.com/docs/continuous-deployment/#build-environment-variables):

- **TOKEN**: your personal Asana TOKEN (format _Bearer XXX_)
- **PROJECT**: the Asana project this bot should be actively listening to events

## Functions

- **Hello** - Dummy function to validate's bot availability
- **Setup** - Code to configure [Asana's webhook](https://asana.com/developers/api-reference/webhooks)
- **Assign** - Assigns all new tasks created that have no assignee to you.


## References

If you have troubles setting things up, [this blog post](https://travishorn.com/netlify-lambda-functions-from-scratch-1186f61c659e) is a great starting point.
