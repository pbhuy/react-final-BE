const jwt = require('jsonwebtoken');

const refreshToken = (payload) => {
    const token = jwt.sign(payload, process.env.REFRESH_SECRET, {
        expiresIn: '24h'
    });
    return token;
};

const accessToken = (payload) => {
    const token = jwt.sign(payload, process.env.ACCESS_SECRET, {
        expiresIn: '1h'
    });
    return token;
};

const activationToken = (payload) => {
    const token = jwt.sign(payload, process.env.ACTIVATION_SECRET, {
        expiresIn: '5m'
    });
    return token;
};

module.exports = { accessToken, activationToken, refreshToken };
