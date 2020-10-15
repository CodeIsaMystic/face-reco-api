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
  },
});
/*
db.select('*').from('users')
  .then(data => {

  });
*/
const app = express();

app.use(bodyParser.json());
app.use(cors());

const database = {
  users: [
    {
      id: '123',
      name: 'john',
      password: 'apple',
      email: 'john@gmail.com',
      entries: 0,
      joined: new Date(),
    },
    {
      id: '124',
      name: 'sally',
      password: 'ananas',
      email: 'sally@gmail.com',
      entries: 0,
      joined: new Date(),
    },
  ],
  /*,
  login: [
    {
      id: '',
      hash: '',
      email: 'john@gmail.com'
    }
  ]*/
};











/**
 * Giving an idea....
 *
 *
 * CHECK TEST:
 *   --> res = GET req OK
 *
 * SIGNIN:
 *    --> POST = success OR fail
 * REGISTER:
 *    -->  POST = user object
 * /PROFILE/:userId
 *    --> GET = user
 *
 * /IMAGE:
 *    --> PUT return user object
 */

app.get('/', (req, res) => {
  res.send(database.users);
});

/**
 * On our case,
 *  we focus on the Body
 *  then select the raw & JSON on postman.co
 * 
 *  ==> testing the bcrypt npm package  
**/
app.post('/signin', (req, res) => {
  bcrypt.compare('annanas', '$2a$10$4qFPQyxl74THxsCDw9WeAeT1mI4Z7ECBrmTEgdIqGccS.npKIHznW', function (err, res) {
    console.log('first guess', res);
  });
  bcrypt.compare('veggies', '$2a$10$4qFPQyxl74THxsCDw9WeAeT1mI4Z7ECBrmTEgdIqGccS.npKIHznW', function (err, res) {
    console.log('scd guess', res);
  });

  if (req.body.email === database.users[0].email && req.body.password === database.users[0].password) {
    res.json(database.users[0]); 
  } else {
    res.status(400).json('We ve got an error, pass do not match!???');
  }
});

/**
 * Starting with
 *  the new user inputs (name, email, pass)
 *  we want to  push another one
 *  new user in the database variable (object)
 *
 *  (start first the "static" way to do)
 */

app.post('/register', (req, res) => {
  const { email, name } = req.body;

  db('users')
    .returning('*')
    .insert({
      email: email,
      name: name,
      joined: new Date()
    })
  .then(user => {
    res.json(user[0]);
  })
  .catch(error => res.status(400).json("unable to register"));
});



app.get('/profile/:id', (req, res) => {
  const { id } = req.params;

  db
    .select('*')
    .from('users')
    .where({
      id: id
    })
    .then(user => {
      if(user.length) {
        res.json(user[0]);
      } else {
        res.status(400).json('Profile Not Found!');
      }
    })
    .catch(error => res.status(400).json('Error getting profile.'));

});

/**
 *
 * In that case,
 *  we update from the image section url
 *  cos' we want to increment entries
 *  to have a "Rank number" to display
 *
 * Notice, here we want
 *  to check on the body of the req
 *
 */
app.put('/image', (req, res) => {
  const { id } = req.body;

  db('users')
    .where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
      res.json(entries[0]);
    })
    .catch(error => res.status(400).json('unable to get entries'));



});



/*
  let found = false;

  database.users.forEach(user => {
    if (user.id === id) {
      found = true;
      user.entries++;
      return res.json(user.entries);
    }
  });

  if (!found) {
    res.status(404).json('There are no such user with that name. Impossible to count.');
  }*/



/**
 *  bcrypt-nodejs => npm package
 *                
 *   => look at the notice on "bcrypt-vs-bcrypt.js"
 *   => https://github.com/kelektiv/node.bcrypt.js/wiki/bcrypt-vs-bcrypt.js
 * 
 */
// Load hash from your password DB.

//bcrypt.hash(password, null, null, function(err, hash) {
// console.log(hash);
//});
//bcrypt.compare("bacon", hash, function(err, res) {
// res == true
//});
//bcrypt.compare("veggies", hash, function(err, res) {
// res = false
//});





/**
 *  .listen on prot 3000
 *  & confirm with console.log
 */
app.listen(3000, () => {
  console.log('app is running on port 3000');
});


/**
 * 
 * on terminal :
 * 
 * run => 'npm run start' command
 * 
 * will launch the command set on package.json
 *     => 'node server.js'
 * 
 */
