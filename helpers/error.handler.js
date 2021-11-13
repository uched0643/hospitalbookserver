
const ErrorMessagesHandler = (statusCode, message, res) => {
    res.status(statusCode).json({
        "statusCode":statusCode,
        "message":message,
    })
}

const AsyncErrorHandler = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)
