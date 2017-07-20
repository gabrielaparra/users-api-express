const express = require('express');
const router = express.Router();
const CamelModel = require('../models/camel-model.js');

//---------------CREATE A NEW CAMEL----------------------
router.post('/new-camel', (req, res, next) => {
  if (!req.user) {
    res.status(401).json({message: 'Log in to make camels'});
    return;
  } //checking if the user is actually logged in

  const theCamel = new CamelModel({
    name: req.body.camelName,
    color: req.body.camelColor,
    humps: req.body.camelHumps,
    owner: req.user._id
  });

  theCamel.save((err) => {
    if (err && theCamel.errors === undefined) {
      res.status(500).json({message: 'Camel save failed'});
      return;
    }
    if(err && theCamel.errors) {
      res.status(400).json({
        nameError: theCamel.errors.name,
        colorError: theCamel.errors.color,
        humpError: theCamel.errors.humps,
      });
      return;
    }
    //Created a camel succesfully
    res.status(200).json(theCamel);
  });
});

//-----------------LIST ALL CAMELS----------------------
router.get('/camels', (req, res, next) => {
  if (!req.user) {
    res.status(401).json({message: 'Log in to see all camels'});
    return;
  } //checking if the user is logged in

  CamelModel
    .find()
    //find all the camels -- we could also do a projection here and find
    //camels by an specific category 
    .populate('owner', {fullName: 1})
    //retrieve info of the owner, just the name
    .exec((err, camels) => {
    if (err) {
      res.status(500).json({message: 'Couldn\'t retrieve the camels.'});
      return;
    }

    res.status(200).json(camels);
  });
});

//--------------------------------------------------------

module.exports = router;
