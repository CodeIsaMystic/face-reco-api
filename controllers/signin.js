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

const handleSignin = (req, res, db, bcrypt ) => {
  const { email , password } = req.body;
  

  if(!email || !password) {
    return res.status(400).json('Incorrect Form submission!');
  }
  /**   
   *  ======> No transaction here , Not needed
  *     because we just checking and 
  *        NOT modifying any data              **/
  db
    .select('email', 'hash')
    .from('login')
    .where('email', '=', email)
    .then(data => {
      const isValid = bcrypt.compareSync(password, data[0].hash);
      //console.log(isValid);

      if(isValid) {
        return db
          .select('*')
          .from('users')
          .where('email', '=', email)
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

};




module.exports = {
  handleSignin: handleSignin
};