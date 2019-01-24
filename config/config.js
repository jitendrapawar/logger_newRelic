const CONSTS = require('./constants.json')

module.exports = {
  'BASE_URL': CONSTS.BASE_URL,
  'Default': CONSTS.BASE_URL,
  'serverUrl': process.env.SERVER_URL,
  'whitelist': process.env.WHITELIST
}
