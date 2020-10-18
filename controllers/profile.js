

const handleGetProfile = (req, res, db ) => {
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

};



module.exports = {
  handleGetProfile: handleGetProfile
};