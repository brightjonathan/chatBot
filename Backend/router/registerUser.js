const express = require('express');
const asyncHandler = require('express-async-handler');
const router = express.Router()
const UserReg = require('../modelSchema/UserModel');
const bcrypt = require('bcrypt'); 


//@desc      user registration
//@route    POST '/api/auth/register'
//@access    public
router.post('/register', asyncHandler(async (req, res)=>{
    
    const {username, email, password} = req.body;

    //if the input is empty
    if(!username || !email || !password ){
      res.status(400)
      throw new Error('please enter the input fields')
  }

  const userExist = await UserReg.findOne({email});
  if(userExist){
      res.status(400)
      throw new Error('user already Exist')
  }

    //Hashing the password
    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(req.body.password, salt);

  //registering new user
  const newUser = await UserReg.create({
      username,
      email,
      password: hashedpassword,
  });
     
  //if its the newUser 
  if(newUser){
      res.status(200).json({
          _id: newUser.id,
          username: newUser.username,
          email: newUser.email,
      })
  }else{
      res.status(400)
      throw new Error('invalid user data')
  }

}))     


//@desc      user Login
//@route      POST '/api/auth/login'
//@access    public
router.post('/login', asyncHandler(async (req, res) => {
   
    const {email, password} = req.body;
    //checking for the  email
    const loginUser = await UserReg.findOne({email})
    
    //return true if both operand are true or otherwise that is false
    if(loginUser && (await bcrypt.compare(password, loginUser.password))){
        res.status(200).json({
            _id: loginUser.id,
            username: loginUser.username,
            email:loginUser.email,
            isAvaterImageSet:loginUser.isAvaterImageSet,
            avaterImage:loginUser.avaterImage,
        })
    }else{
        res.status(400)
        throw new Error('invalid credential')
    }
    
}));

//@desc      user avatar
//@route      POST '/api/auth/setAvatar'
//@access    public
router.post('/setAvatar/:id', asyncHandler(async (req, res) => {
    
   const userId = req.params.id;
   const avaterImage = req.body.image;
   const userData = await UserReg.findByIdAndUpdate(userId, {
    isAvaterImageSet: true,
    avaterImage,
   });
   return res.json({
       isSet:userData.isAvaterImageSet, 
       image:userData.avaterImage
    })   
}));



//@desc      getting all users
//@route      GET '/api/auth/contact'
//@access    public
router.get('/contact/:id', asyncHandler(async (req, res) => {
    
    //getting all the Id except the current Id 
    const users = await UserReg.find({_id: {$ne: req.params.id}}).select([
        "email",
        "username",
        " avaterImage",
        "_id",
    ])
    return res.json(users)
 }));


 //@desc      logout
//@route      GET '/api/auth/logout'
//@access    public
router.get('/logout/:id', asyncHandler(async (req, res) => {
    if (!req.params.id) return res.json({ msg: "User id is required " });
    onlineUsers.delete(req.params.id);
    return res.status(200).send();
 }));



module.exports = router;