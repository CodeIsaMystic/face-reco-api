const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');



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
 *   --> res = GET req OK
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
 */

app.get('/', (req, res) => {
  res.send('success');
});

/**
 * On our case,
 *  we focus on the Body
 *  then select the raw & JSON on postman.co
 * 
 *  ==> testing the bcrypt npm package 
 * 
 * 
 *  bcrypt-nodejs => npm package
 *                
 *   => look at the notice on "bcrypt-vs-bcrypt.js"
 *   => https://github.com/kelektiv/node.bcrypt.js/wiki/bcrypt-vs-bcrypt.js
 * 
 * 
**/
app.post('/signin', (req, res) => {
  
  /**   
   *  ======> No transaction here , Not needed
  *     because we just checking and 
  *        NOT modifying any data 
  **/

  db
    .select('email', 'hash')
    .from('login')
    .where('email', '=', req.body.email)
    .then(data => {
      const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
      //console.log(isValid);

      if(isValid) {
        return db
          .select('*')
          .from('users')
          .where('email', '=', req.body.email)
          .then(user => {
            //console.log(user);
            res.json(user[0]);
          })
          .catch(error => res.status(400).json('unable to get user'));
      } else {

        res.status(400).json('wrong credentials');

      }

    })
    .catch(error => res.status(400).json('wrong credentials'));

});

/**
 * Starting with
 *  the new user inputs (name, email, pass)
 *  we want to  push another one
 *  new user in the database variable (object)
 * 
 *  TRANSACTIONS CONCEPT:
 * => join code blocks on db 
 * => for multiples operations on db
 *     if one fail , then all fail 
 * ===> joining login and users
 * 
 **/

app.post('/register', (req, res) => {
  const { email, name, password } = req.body;
  
  /* ====> transaction from knex package   */
  const hash = bcrypt.hashSync(password);
  db.transaction(trx => {

    trx.insert({
      hash: hash,
      email: email
    })
    .into('login')
    .returning('email')
    .then(loginEmail => {

      return trx('users')
        .returning('*')
        .insert({
          email: loginEmail[0],
          name: name,
          joined: new Date()
        })
        .then(user => {
          res.json(user[0]);
        });
    })
    .then(trx.commit)
    .catch(trx.rollback);
  })
  .catch(error => res.status(400).json("unable to register"));
});



app.get('/profile/:id', (req, res) => {
  const { id } = req.params;

  db
    .select('*')
    .from('users')
    .where(
      {
        id: id
      })
    .then(user => 
      {
        if(user.length) {
          res.json(user[0]);
        } else {
          res.status(400).json('Profile Not Found!');
        }
      })
    .catch(error => res.status(400).json('Error getting profile.'));

});

/**
 * In that case,
 *  we update from the image section url
 *  cos' we want to increment entries
 *  to have a "Rank number" to display
 *
 * Notice, here we want
 *  to check on the body of the req
 */
app.put('/image', (req, res) => {
  const { id } = req.body;

  db('users')
  
    .where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => 
      {
        res.json(entries[0]);
      })
    .catch(error => res.status(400).json('unable to get entries'));

});












/**
 *  .listen on port 3000
 *  & confirm with console.log
 */
app.listen(3000, () => {
  console.log('app is running on port 3000');
});


/**    on terminal :
 * 
 * run => 'npm start' command
 * 
 * will launch the command set on package.json
 *     => 'node server.js'
**/
