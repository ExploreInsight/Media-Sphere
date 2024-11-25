export const errorHandler = (err, req, res, next) => {
    console.log(err);

    const statusCode = err.status || 500 || "Internal Server Error Found!";

    const message = err. message || "An unexpected Error occured!"

    const stack = err.stack || "Extra Errors Caught !"

    res.status(statusCode).json({
        message:message,
        stack:stack
    })
    
}