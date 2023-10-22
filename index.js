//jshint esversion:6
import 'dotenv/config'
import express from 'express';
import bodyParser from 'body-parser';
import ejs from 'ejs';
import mongoose from 'mongoose';
import md5 from 'md5';
import path from 'path'; 
import { Console } from 'console';
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const port = 1234;
const app = express();
console.log(process.env.SECRET);
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

   const connectionString = process.env.MONGODB_CONNECT_URI;

   mongoose.connect(connectionString, { useNewUrlParser: true })
    .then(() => {
        console.log("Connected to the database");
    })
    .catch((error) => {
        console.error("Error connecting to the database: ", error);
    });
    const userSchema = new mongoose.Schema({
        email:String,
        password:String,
    });
  

    const User = new mongoose.model("User",userSchema)

app.get("/", (req,res)=>{
    res.render("home");

});
app.get("/login", (req,res)=>{
    res.render("login");

});
app.get("/register", (req,res)=>{
    res.render("register");

});
app.post("/register", async(req,res)=>{

    const newUser = new User({
        email:req.body.email,
        password:md5(req.body.password)
    });

    newUser.save()
    .then(usernew =>{
res.render("secrets");
    })
    .catch(error =>{
        res.status(500).json({error:'error'});
    });
   

});
app.post("/login", async(req,res)=>{
    const email = req.body.email;
    const password=md5(req.body.password);
  await User.findOne({email:email})
  .then(loginUser =>{
        if(loginUser.password === password){
            res.render("secrets");

        }
})
        .catch(error =>{
          console.log(error);
            // res.status(500).json({error:'incorrect password'});
        });

});
app.listen(port, ()=>{
    console.log(`server is up and running on ${port}`)
});
