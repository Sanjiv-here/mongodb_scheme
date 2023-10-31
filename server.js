const express = require('express');
const cookieParser = require('cookie-parser');
const emailValidator=require('email-validator');
const mongoose = require('mongoose');
const bcrypt=require('bcrypt')
const app = express();
const port = 3000;
const router = express.Router();

const userRouter=express.Router();
const authRouter=express.Router();

app.use(express.json());
app.use("/auth",authRouter);

authRouter
.route("/signup")
.get(getSignup)
.post(postSignup);

function getSignup(req,res){
  res.sendFile('page.html',{root:__dirname} )
}

async function postSignup(req, res) {
  try {
    let obj = req.body;
    let salt = await bcrypt.genSalt();
    let hashedString = await bcrypt.hash(obj.password, salt);
    let hashedString2 = await bcrypt.hash(obj.confirmPassword, salt);
    obj.password = hashedString;
    obj.confirmPassword=hashedString2;
    let user = await userModel.create(obj);

    res.json({
      message: "User signed up",
      data: user
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "An error occurred during signup"
    });
  }
}

const db_link="mongodb+srv://sknaik1202:YyiE10decbcmzgDQ@cluster0.ulzij52.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(db_link)
.then(function(db){
  console.log('db connected');
})
.catch(function(err){
  console.log(err);
})

const UserSchema=mongoose.Schema({
  name:{
    type:String,
    required:true
  },
  email:{
    type:String,
    required:true,
    unique:true,
    validate:function(){
      return emailValidator.validate(this.email);
    }
  },
  password:{
    type:String,
    required:true,
    minLength:8
  },
  confirmPassword:{
    type:String,
    required:true,
    minLength:8,
    validate:async function(){
      return this.password==this.confirmPassword
    }
  },
  
})

const userModel=mongoose.model('userModel',UserSchema);

// UserSchema.pre('save', function (next) {
//   this.confirmPassword = undefined;
//   console.log(this.confirmPassword);
//   next();
// });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});