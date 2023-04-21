const express = require("express");
const db = require("../db");
const User = require("../models/user");

const {ensureLoggedIn, ensureCorrectUser } = require("../middleware/auth")

const router = new express.Router();

/** GET / - get list of users.
 *
 * => {users: [{username, first_name, last_name, phone}, ...]}
 *
 **/

router.get('/', async (req,res,next) => {
  const users = await User.all()
  return res.json({users})
})

/** GET /:username - get detail of users.
 *
 * => {user: {username, first_name, last_name, phone, join_at, last_login_at}}
 *
 **/

router.get('/:username', ensureCorrectUser, async(req,res,next) => {
  const user = await User.get(req.params.username)
  return res.json({user})
})

/** GET /:username/to - get messages to user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 from_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/
router.get('/:username/to', ensureCorrectUser, async(req,res,next) => {
  const messages = await User.messagesTo(req.params.username)
  if(messages.length === 0){
    return res.send(`${req.params.username} has no messages`)
  }else{
    return res.json({messages})
  }
})

/** GET /:username/from - get messages from user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 to_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/
router.get('/:username/from', ensureCorrectUser, async(req,res,next) => {
  const messages = await User.messagesFrom(req.params.username)
  if(messages.length === 0){
    return res.send(`${req.params.username} has not sent any messages`)
  }else{
    return res.json({messages})
  }
})

module.exports = router;
