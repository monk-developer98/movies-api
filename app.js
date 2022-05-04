const express = require("express");
const app = express();
const mongoose  = require("mongoose");
const dotenv = require("dotenv");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const movieRoute = require("./routes/movies");
const listRoute = require("./routes/lists");


dotenv.config();

mongoose.connect(process.env.MONGO_URL,{useNewUrlParser: true})
.then(()=>{
    console.log("Database connect Successfull");
}).catch((err)=>{
    console.log(err);
});

app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/movie", movieRoute);
app.use("/api/list", listRoute);

app.listen(8000, ()=>{
    console.log("server running on Port 8000 ");
})