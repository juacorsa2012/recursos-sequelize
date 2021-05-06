const Message = require('./message')

const ok = (res, statusCode, message, data) => {   
    res.status(statusCode).json({
      status: Message.SUCCESS,
      message,
      data,
      result: data == undefined ? null : data.length
    })
}
  
  module.exports = ok  