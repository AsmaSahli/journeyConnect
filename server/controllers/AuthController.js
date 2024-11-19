const User = require("../models/User");
const bcrypt = require("bcrypt");
const e = require("../utils/error");
const jwt=require("jsonwebtoken")
module.exports = {
    signup: async (req, res, next) => {
        const {firstName ,dateOfBirth,lastName, email, password ,confirmPassword} = req.body;

        if (
        !firstName ||
        !lastName ||
        !email ||
        !password ||
        !dateOfBirth ||
        firstName === "" ||
        lastName === "" ||
        dateOfBirth === "" ||
        email === "" ||
        password === "" ||
        confirmPassword === ""
        ) {
        next(e.errorHandler(400, 'All Fields Are Required'));
        }
        if (req.body.password) {
            if (req.body.password.length < 6) {
                return next(e.errorHandler(400, 'Password must be at least 6 characters'));
            }}
        const potentialUser=await User.findOne({email:req.body.email})
        if(potentialUser){
            return next(e.errorHandler(400, 'User already registered'))
        }
        if (
            password !==confirmPassword
        ){
            next(e.errorHandler(400, 'Password and Confirm Password must match !'))
        }
        const hashedPassword = bcrypt.hashSync(password, 10);
        const newUser = new User({
            username :username,
            email: email,
            password: hashedPassword,
        });
    
        try {
        await newUser.save();
        res.json("Signup successful");
        } catch (error) {
        next(error);
        }
    },

    signin: async (req, res, next) => {
        const { email, password } = req.body;
        if (!email || !password || email === '' || password === '') {
        next(e.errorHandler(400, 'All fields are required'));
        }
        
        try {
        const validUser = await User.findOne({ email });
        if (!validUser) {
            return next(e.errorHandler(404, 'User not found'));
        }
        const validPassword = bcrypt.compareSync(password, validUser.password);
        if (!validPassword) {
            return next(e.errorHandler(400, 'Invalid password'));
        }
        const token = jwt.sign(
            { id: validUser._id,  },
            process.env.JWT_SECRET
        );
        const { password: pass, ...rest } = validUser._doc;
        res
        .status(200)
        .cookie('access_token', token, {
            httpOnly: true,
        })
        .json(rest);
        } catch (error) {
        next(error);
        }
    },



    
    };
