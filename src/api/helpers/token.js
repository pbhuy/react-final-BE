const jwt = require('jsonwebtoken');

const refreshToken = (account) => {
    const token = jwt.sign(
        { id: account._id, role: account.role },
        process.env.REFRESH_SECRET,
        {
            expiresIn: '24h'
        }
    );
    return token;
};
const accessToken = (account) => {
    const token = jwt.sign(
        { id: account.id, role: account.role },
        process.env.ACCESS_SECRET,
        {
            expiresIn: '1h'
        }
    );
    return token;
};
const activationToken = (account) => {
    const token = jwt.sign(account, process.env.ACTIVATION_SECRET, {
        expiresIn: '5m'
    });
    return token;
};

module.exports = { accessToken, activationToken, refreshToken };
