'use strict'

const client_config = require('../client_config')

module.exports = {
  NODE_ENV: '"production"',
  API_ENDPOINT: client_config.axios_api_endpoint,
  PHOTO_URL: client_config.photo_url,
  FILE_URL: client_config.file_url,
  TUTORIAL_URL: client_config.tutorial_url,
  AUDIO_URL: client_config.audio_url
}
