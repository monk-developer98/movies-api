const router = require("express").Router();
const Movie = require("../modals/Movie");
const verify = require("./verifyToken");

// Add Movie only Admin
router.post("/", verify , async(req,res) => {
    if(req.user.isAdmin){
        const newMovie = await Movie(req.body);
        try {
            const saveMovie = await newMovie.save();
            res.status(201).json(saveMovie)
        } catch (error) {
            res.status(500).json(error)
        }
    }else{
        res.status(403).json("you are not admin")
    }
})

// Update Movie only Admin can do
router.put("/:id", verify , async(req,res) => {
    if(req.user.isAdmin){
        try {
            const updateMovie = await Movie.findByIdAndUpdate(req.params.id,{
                $set: req.body,
            },
            { new: true }
            );
            res.status(200).json(updateMovie)
        } catch (error) {
            res.status(500).json(error)
        }
    }else{
        res.status(403).json("you are not admin")
    }
})

// Delete Movie only Admin can do
router.delete("/:id", verify , async(req,res) => {
    if(req.user.isAdmin){
        try {
            await Movie.findByIdAndDelete(req.params.id);
            res.status(200).json("The Movie Has Been Deleted...")
        } catch (error) {
            res.status(500).json(error)
        }
    }else{
        res.status(403).json(" You Cannot Delete Movie ...")
    }
})

//  Get Movie only Admin 
router.get("/find/:id", async(req,res) => {
    
        try {
            const movie =  await Movie.findById(req.params.id);
            res.status(200).json(movie)
        } catch (error) {
            res.status(500).json(error)
        }
})

// Get Random Movie only Admin 
router.get("/random", verify , async(req,res) => {
    const type = req.query.type
    let movie;
    try {
       if(type=== "series"){
           movie = await Movie.aggregate([
                { $match: { isSeries: true }},
                { $sample: { size: 1 } },
           ]);
       }else{
        movie = await Movie.aggregate([
            { $match: { isSeries: false }},
            { $sample: { size: 1 } },
       ]);
       }
       res.status(200).json(movie)
    } catch (error) {
        res.status(500).json(error)
    }
});

/Get All movies/ 
router.get("/", verify, async(req,res) => {
    if(req.user.isAdmin){
        try {
            const movie = await Movie.find();
            res.status(200).json(movie.reverse());
        } catch (error) {
            res.status(500).json(error)
        }
    }else{
        res.status(403).json(" You Cannot Delete Movie ...")
    }
});

module.exports = router;