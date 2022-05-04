const router = require("express").Router();
const List = require("../modals/List");
const verify = require("./verifyToken");

// Add Movie lists 
router.post("/",verify ,async(req,res) => {
    if(req.user.isAdmin){
        const newList = await List(req.body);
        try {
            const saveList = await newList.save();
            res.status(201).json(saveList) 
        } catch (error) {
            res.status(500).json(error)
        } 
    }else{
        res.status(403).json("you are not Allowed")
    }
})

// Delete Movie lists  
router.delete("/:id",verify ,async(req,res) => {
    if(req.user.isAdmin){
        try {
            await List.findByIdAndDelete(req.params.id);
            res.status(201).json("The List Has Been Deleted") 
        } catch (error) {
            res.status(500).json(error)
        } 
    }else{
        res.status(403).json("you are not Allowed")
    }
})

// Get Movie lists
router.get("/",verify ,async(req,res) => {
        const typeQuery = req.query.type;
        const genreQuery = req.query.genre;
        let list = [];
        try {
            if(typeQuery){
                if(genreQuery){
                    list = await List.aggregate([{$sample: {size : 10}},
                        {$match: {type: typeQuery , genre:genreQuery}}
                        ]);
                }else{
                    list = await List.aggregate([{$sample: {size : 10}},
                        {$match: {type: typeQuery }}
                        ]);
                }
            }else{
                list = await List.aggregate([{$sample: {size: 10}}]);
            }
            res.status(200).json(list);
        } catch (error) {
            res.status(500).json(error)
        }
})
module.exports = router;