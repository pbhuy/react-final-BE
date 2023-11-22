const sendRes = (res, status, data, message) => {
    return res.status(status).json({
        success: true,
        message,
        data
    });
};

const sendErr = (res, err) => {
    return res.status(err.status).json({
        success: false,
        error: {
            message: err.message
        }
    });
};

module.exports = { sendRes, sendErr };
