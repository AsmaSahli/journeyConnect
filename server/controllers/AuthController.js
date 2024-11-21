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
            firstName :firstName,
            lastName :lastName,
            dateOfBirth :dateOfBirth,
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
            return next(e.errorHandler(400, 'All fields are required'));
        }
    
        try {
            const validUser = await User.findOne({ email });
    
            // If user doesn't exist
            if (!validUser) {
                return next(e.errorHandler(404, 'User not found'));
            }
    
            // Check if user is locked out
            const currentTime = Date.now();
            if (
                validUser.failedLoginAttempts >= 3 &&
                validUser.lockUntil &&
                currentTime < validUser.lockUntil
            ) {
                const timeLeft = Math.ceil((validUser.lockUntil - currentTime) / 1000);
                return next(
                    e.errorHandler(
                        403,
                        `Account locked. Try again in ${timeLeft} seconds.`
                    )
                );
            }
    
            // Validate password
            const validPassword = bcrypt.compareSync(password, validUser.password);
    
            if (!validPassword) {
                // Increment failed login attempts
                validUser.failedLoginAttempts = (validUser.failedLoginAttempts || 0) + 1;
    
                // Lock the user if they have reached 3 failed attempts
                if (validUser.failedLoginAttempts >= 3) {
                    validUser.lockUntil = Date.now() + 2 * 60 * 1000; // Lock for 2 minutes
                }
    
                await validUser.save();
                return next(e.errorHandler(400, 'Invalid password'));
            }
    
            // Reset failed login attempts and lockUntil on successful login
            validUser.failedLoginAttempts = 0;
            validUser.lockUntil = undefined;
            await validUser.save();
    
            // Generate JWT token
            const token = jwt.sign(
                { id: validUser._id },
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
    
    google: async (req, res, next) => {
        const { email, name, googlePhotoUrl, dateOfBirth } = req.body;
      
        try {
          const user = await User.findOne({ email });
          if (user) {
            const token = jwt.sign(
              { id: user._id, isAdmin: user.isAdmin },
              process.env.JWT_SECRET
            );
            const { password, ...rest } = user._doc;
            res
              .status(200)
              .cookie('access_token', token, {
                httpOnly: true,
              })
              .json(rest);
          } else {
            // Generate password
            const generatedPassword =
              Math.random().toString(36).slice(-8) +
              Math.random().toString(36).slice(-8);
            const hashedPassword = bcrypt.hashSync(generatedPassword, 10);
      
            // Split name into firstName and lastName
            const [firstName, ...lastNameParts] = name?.split(' ') || [];
            const lastName = lastNameParts.join(' ');
      
            // Validate name fields
            if (!firstName || !lastName) {
              return res
                .status(400)
                .json({ message: 'Invalid name provided from Google.' });
            }
      
            // Validate and parse dateOfBirth
            const parsedDateOfBirth = dateOfBirth ? new Date(dateOfBirth) : null;
            if (dateOfBirth && isNaN(parsedDateOfBirth.getTime())) {
              return res
                .status(400)
                .json({ message: 'Invalid dateOfBirth format.' });
            }
      
            const newUser = new User({
              firstName,
              lastName,
              email,
              password: hashedPassword,
              profilePicture: googlePhotoUrl,
              dateOfBirth: parsedDateOfBirth || undefined, // Pass undefined if no DOB
            });
      
            await newUser.save();
      
            const token = jwt.sign(
              { id: newUser._id, isAdmin: newUser.isAdmin },
              process.env.JWT_SECRET
            );
            const { password, ...rest } = newUser._doc;
            res
              .status(200)
              .cookie('access_token', token, {
                httpOnly: true,
              })
              .json(rest);
          }
        } catch (error) {
          next(error);
        }
      }
      
      



    
    };
