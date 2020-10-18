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

const handleRegister = (req, res, db, bcrypt) => {
  const { email, name, password } = req.body;
  
  if(!email || !name || !password) {
    return res.status(400).json('Incorrect Form submission!');
  }
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
};




module.exports = {
  handleRegister: handleRegister
};