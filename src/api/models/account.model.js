const mongoose = require('mongoose');

const { Schema } = mongoose;

const accountSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            unique: true,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            default: '',
        },
        address: { type: String, default: '' },
        avatar: {
            type: String,
            default:
                'https://res.cloudinary.com/dqtcvuae8/image/upload/v1700311688/avatar/ttlmi6rg8pu4m7d4ao6o.png',
        },
        role: {
            type: String,
            enum: ['student', 'teacher', 'admin'],
            default: 'student',
        },
    },
    { timestamps: true }
);

const Account = mongoose.model('Account', accountSchema);
module.exports = Account;
