const express = require('express');
const asyncHandler = require('express-async-handler');
const router = express.Router();
const MessReg = require('../modelSchema/messageModel')


//@desc      add message
//@route      POST '/api/message/addmsg'
//@access    public
router.post('/addmsg', asyncHandler(async (req, res) => {
   const {from, to } = req.body;

   const messages = await MessReg.find({
       users: {
           $all: [from, to],
       },
   }).sort({updateAt: 1});

   const projectedMessages = messages.map((msg)=>{
       return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text, 
       }
   })
   res.json(projectedMessages);
}));



//@desc       get message
//@route      POST '/api/message/getmsg'
//@access    public
router.post('/getmsg', asyncHandler(async (req, res) => {
   const {from, to, message } = req.body;
   const data = await MessReg.create({
       message: {text: message},
       users: [from, to],
       sender: from,
   });

   if(data) return res.json({msg: "message added successfully"});
   else return res.json({msd: 'failed to add message to the database'})
}));















module.exports = router;