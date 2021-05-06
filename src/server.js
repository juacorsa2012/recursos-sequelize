require('dotenv').config()
const app = require('./app')
const PORT = process.env.PORT || 3000

const server = app.listen(PORT, () => {   
    console.info(`Environment: ${process.env.NODE_ENV}`)
    console.info(`Server is running at http://localhost:${PORT}`)
})

process.on('unhandledRejection', (err, promise) => {
    console.error(`Error: ${err.message}`)
    server.close(() => process.exit(1))
});

module.exports = server