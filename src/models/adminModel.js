const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Schema = mongoose.Schema;


const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        required: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("email is invalid")
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value) {
            if (value.includes("password")) {
                throw new Error("password cannont contains the word 'Password'")
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    books: [{
        type: Schema.Types.ObjectId, ref: 'Book'
    }]
}, {
    timestamps: true
})

//Hash the text of password before saving
adminSchema.pre('save', async function (next) {
    const admin = this
    if (admin.isModified('password')) {
        admin.password = await bcrypt.hash(admin.password, 8)
    }
    next()
})


//When new admin created or login we generate him new token
adminSchema.methods.generateAuthToken = async function () {
    const admin = this  //the admin from the route "login" or new admin
    const token = jwt.sign({ _id: admin._id.toString() }, process.env.JWT_SECRET)
    admin.tokens = admin.tokens.concat(({ token }))
    admin.save()
    return token
}


// When admin login we find him with this function
adminSchema.statics.findByCredentials = async (email, password) => {
    const admin = await Admin.findOne({ email })
    if (!admin) {
        throw new Error("Email is unknown to the system")
    }
    const isMatch = await bcrypt.compare(password, admin.password)
    if (!isMatch) {
        throw new Error("Unable to login")
    }
    return admin
}

//toJSON get called when json.stringifiy get called,whice happend when we send back the admin.
//so before we send the admin info we REMOVE the password and tokens
adminSchema.methods.toJSON = function () {
    const admin = this
    const adminObj = admin.toObject()

    delete adminObj.password
    delete adminObj.tokens

    return adminObj
}

const Admin = mongoose.model('Admin', adminSchema)

module.exports = Admin

