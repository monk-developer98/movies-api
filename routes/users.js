const router = require("express").Router();
const User = require("../modals/User");
const CryptoJS = require("crypto-js");
const verify = require("./verifyToken");

// UPDATE
router.put("/:id", verify ,async(req,res)=>{
    if(req.user.id === req.params.id || req.user.isAdmin){
        if(req.body.password){
            req.body.password = CryptoJS.AES.encrypt(
                req.body.password,
                process.env.SEC_KEY
            ).toString();
        }
        try {
            const updateUser = await User.findByIdAndUpdate(req.params.id,{
                $set: req.body,
            },{new:true})
            res.status(200).json(updateUser)
        } catch (error) {
            res.status(500).json(error)
        }
    }else{
        res.status(403).json("you can update only your Account!")
    }
})

// Delete User
router.delete("/:id", verify ,async (req,res) => {
    if(req.user.id === req.params.id || req.user.isAdmin){
        try {
            await User.findByIdAndDelete(req.params.id);
            req.status(200).json("User has been deleted")
        } catch (error) {
            res.status(500).json(error)
        }
    }else{
        res.status(403).json("you can delete only your Account!")
    }
})

// get User
router.get("/find/:id", async (req,res) => {
        try {
            const user = await User.findById(req.params.id)
            const { password , ...info } = user._doc
            res.status(200).json(info)
        } catch (error) {
            res.status(500).json(error)
        }
})

router.get("/", verify ,async (req,res) => {
    const query = req.query.new;

    if(req.user.isAdmin){
        try {
            const users = query ? await User.find().sort({_id:-1}).limit(10) : await User.find()
            req.status(200).json(users)
        } catch (error) {
            res.status(500).json(error)
        }
    }else{
        res.status(403).json("you are not allowed to see all users!")
    }
});

module.exports = router;