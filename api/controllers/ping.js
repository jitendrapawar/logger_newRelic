let getPingResponse = function (req, res) {
  let response = {}
  response.message = '3.Welcome to Partner Portal'
  response.code = 200
  res.send(response)
}
module.exports.getPingResponse = getPingResponse
