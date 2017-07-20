const express = require('express');
const router = express.Router();
const CamelModel = require('../models/camel-model.js');

//---------------CREATE A NEW CAMEL----------------------
router.post('/new-camel', (req, res, next) => {
  const theCamel = new CamelModel({
    name: req.body.camelName,
    color: req.body.camelColor,
    humps: req.body.camelHumps
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
        humpError: theCamel.errors.humps
      });
      return;
    }
    //Created a camel succesfully
    res.status(200).json(theCamel);
  });
});


module.exports = router;
