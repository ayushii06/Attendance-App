const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        validate: {
            validator: function (value) {
                return value.endsWith("@gmail.com") || value.endsWith("@rgipt.ac.in");
            },
            message: "Email must end with @rgipt.ac.in",
        },
    },
    password: {
        type: String,
        required: true,
    },
    rollNo: {
        type: String,
        required: function () {
            return this.accountType === "Student";
        },
    },
    year: {
        type: Number,
        required: function () {
            return this.accountType === "Student";
        },
    },
    branch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Branch",
        required: function () {
            return this.accountType === "Student";
        },
    },
    accountType: {
        type: String,
        enum: ["Admin", "Student", "Instructor"],
        required: true,
    },
    additionalDetails: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Profile",
    },
    courses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        validate: {
            validator: function () {
                return this.accountType === "Student" || this.accountType === "Instructor";
            },
            message: "Courses are only applicable for students and instructor.",
        },
    }],
    
    image: {
        type: String,
        required: true,
    },
    token: {
        type: String,
    },
    resetPasswordExpires: {
        type: Date,
    },
});

// Pre-save validation to enforce conditional logic
userSchema.pre("save", function (next) {
    // Roll number, year, and branch must be provided for students
    if (this.accountType === "Student") {
        if (!this.rollNo || !this.year || !this.branch) {
            return next(
                new Error("Roll number, year, and branch are required for students.")
            );
        }
    }

    // Courses must not exist for admins
    if (this.accountType === "Admin" && this.courses && this.courses.length > 0) {
        return next(new Error("Courses are not applicable for admins."));
    }

    next();
});

module.exports = mongoose.model("User", userSchema);
