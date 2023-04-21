const express = require("express");
const router = new express.Router();
const ExpressError = require("../expressError");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const User = require("../models/user");

const db = require("../db");



/** POST /login - login: {username, password} => {token}
 *
 * Make sure to update their last-login!
 *
 **/
router.post("/login", async function(req, res, next){
  try{
    let { username, password } = req.body;
    if (!username || !password ){
      throw new ExpressError("Username and password required", 404);
    }
    const result = await db.query(`
    SELECT username, password
    FROM users
    WHERE username = $1`,
    [username])
    const user = result.rows[0]
    if(user) {
      if (await bcrypt.compare(password, user.password)){
        const token = jwt.sign({username}, SECRET_KEY);
        User.updateLoginTimestamp(username);
        return res.json({ message: `Welcome ${username}`, token })
      } else {
        throw new ExpressError("Invalid username/password", 404)
      }
    }
  } catch(e) {
    return next(e)
  }
})

/** POST /register - register user: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 *
 *  Make sure to update their last-login!
 */

router.post("/register", async function (req, res, next) {
  try {
    let {username} = await User.register(req.body);
    let token = jwt.sign({username}, SECRET_KEY);
    User.updateLoginTimestamp(username);
    return res.json({token});
  } catch (e) {
    return next(e);
  }
});

module.exports = router;