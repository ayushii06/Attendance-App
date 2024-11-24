const mongoose = require("mongoose");
const { sendVerificationEmail } = require("./emailService"); 

const OTPSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v); // Regex for valid email
            },
            message: (props) => `${props.value} is not a valid email!`,
        },
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 300, // Automatically deletes after 5 minutes
    },
});

OTPSchema.index({ email: 1 }); // Index for faster queries

// Pre-save middleware to send OTP email
OTPSchema.pre("save", async function (next) {
    try {
        await sendVerificationEmail(this.email, this.otp);
        next();
    } catch (error) {
        console.error("Error sending OTP email:", error);
        next(error); // Prevent saving if email fails
    }
});

module.exports = mongoose.model("OTP", OTPSchema);
