const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');


const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');



const db = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: 'postgres',
    password: '1gb78AK74-',
    database: 'smart-brain'
  }
});



const app = express();



app.use(bodyParser.json());
app.use(cors());





/**  Giving an idea....
 *
 * CHECK TEST:
 *   --> res = GET req Success
 *
 * SIGN IN:
 *    --> POST = success OR fail
 * REGISTER:
 *    -->  POST = user object
 * 
 *   /PROFILE/:userId
 *    --> GET = user
 *   /IMAGE:
 *    --> PUT return user object
 * 
 * 
 * 
 *   on terminal :
 * 
 * run => 'npm start' command
 * 
 * will launch the command set on package.json
 *     => 'node server.js'
 */





app.get('/', (req, res) => {
  res.send('success');
});

/**
 *  handleSignin function with dependencies injections as params db & bcrypt
 */
app.post('/signin', (req, res) => { signin.handleSignin(req, res, db, bcrypt); });


/**
 *  handleRegister function with dependencies injections as params db & bcrypt
 */
app.post('/register', (req, res) =>  { register.handleRegister(req, res, db, bcrypt); });


/**
 *  handleProfile function with dependency injection as param db 
 */
app.get('/profile/:id', (req, res) => { profile.handleGetProfile(req, res, db);});



/**
 *  handleUpdateEntries function with dependency injection as param db 
 */
app.put('/image', (req, res) => {image.handleUpdateEntries(req, res, db);});

/**
 *  handleApiCall function with dependency injection as param db 
 */
app.post('/imageurl', (req, res) => {image.handleApiCall(req, res);});















/**
 *  .listen on port 3000
 *  & confirm with console.log
 */
app.listen(3000, () => {
  console.log('app is running on port 3000');
});