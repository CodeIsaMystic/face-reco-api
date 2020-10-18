const Clarifai = require('clarifai');



const app = new Clarifai.App({
  apiKey: 'c80497c3d8c84120944582b5eeb5f7ae',
});

/**
 * Handling API 
 *  => on the backend to be more secure 
 * 
 * Like this, the user can not access the API KEY 
 * on a put image request      */
const handleApiCall = (req, res) => {
  
/** You may have to do this:
* .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)  **/
app.models  
      .predict('c0c0ac362b03416da06ab3fa36fb58e3', req.body.input)
      .then(data => {
        res.json(data);
      })
      .catch(error => res.status(400).json('Unable to work with the API!'));
};

/**
 * In that case,
 *  we update from the image section url
 *  cos' we want to increment entries
 *  to have a "Rank number" to display
 *
 * Notice, here we want
 *  to check on the body of the req
 */


const handleUpdateEntries = (req, res, db ) => {  
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

};



module.exports = {
  handleUpdateEntries: handleUpdateEntries,
  handleApiCall: handleApiCall
};