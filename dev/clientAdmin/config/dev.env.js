'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

const config = require('../client_config')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_ENDPOINT: config.axios_api_endpoint,
  CONFIG: {
  	common_photo_url: config.common_photo_url,
  	common_files_url: config.common_files_url,
  	web_smartchat_url: config.web_smartchat_url,
  	cabinet_smartchat_url: config.cabinet_smartchat_url,
  	production: config.production
  }
})
