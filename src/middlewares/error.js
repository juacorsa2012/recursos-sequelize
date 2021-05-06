const { StatusCodes }  = require('http-status-codes')
const ErrorResponse = require('../utils/errorResponse')
const Message = require('../utils/message')

const errorHandler = (err, req, res, next) => {
  let error = { ...err }

  error.message = err.message   

  // Duplicate key
  if (err.name === 'SequelizeUniqueConstraintError') {    
    error = new ErrorResponse(Message.VALOR_DUPLICADO, StatusCodes.BAD_REQUEST)
  }

  // Validation error
  if (err.name === 'SequelizeValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error = new ErrorResponse(message, StatusCodes.BAD_REQUEST)
  }

  res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
    status: Message.ERROR,
    error: error.message || Message.INTERNAL_SERVER_ERROR  
  })
}

module.exports = errorHandler