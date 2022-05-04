const router = require("express").Router();
const User = require("../modals/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

// Register User 
router.post ("/register", async (req,res) => {
    const newUser = new User({
        username : req.body.username,
        email : req.body.email,
        password : CryptoJS.AES.encrypt(req.body.password, process.env.SEC_KEY).toString(),
    });
    try {
        const saveUser =  await newUser.save();
        res.status(201).json(saveUser)
    } catch (error) {
        res.status(500).json(error)
    }
});

// Login User
router.post("/login", async (req,res) => {
    try {
        const user =  await User.findOne({ email:req.body.email });
        !user && res.status(401).json("Wrong Credentials")

        const pass = await CryptoJS.AES.decrypt(user.password, process.env.SEC_KEY);
        const orignalPassword = pass.toString(CryptoJS.enc.Utf8);

        orignalPassword !== req.body.password && res.status(401).json("Wrong Credentials!")

        const accessToken = await jwt.sign({id:user._id , isAdmin: user.isAdmin},process.env.SEC_KEY, { expiresIn:"5d"})


        const { password , ...info } = user._doc;
        res.status(200).json( {...info , accessToken})
        
    } catch (error) {
        res.status(500).json(error)
    }
})

module.exports = router;