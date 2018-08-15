var express = require('express');
var router = express.Router();
const { insertData, getData, uploadImage, getDataAll } = require('../libraries/database');

router.get('/', function(req, res) {
  getData(
      req.query.label, req.query.komponen,
      function(err) {
          res.status(500).json(err)
      },
      function(r) {
          res.status(200).json(r);
      }
    )
});

router.post('/', uploadImage, function(req, res) {
    const data = req.body
    const msg;
    if (req.file) {
        data.gambarIlustrasi = `http://localhost:7000/images/${req.file.filename}`
        msg = { msg : "data inserted"}
    } else {
        data.gambarIlustrasi = '';
        msg = { msg : "data inserted without image"}
    }
    insertData(
      data, 
      function(err) {
          res.status(500).json(err)
      },
      function(r) {
          console.log(data)
          res.status(201).json(msg);
      }
    )
})

router.get('/all', function(req, res) {
    getDataAll( 
      function(err) {
          res.status(500).json(err)
      },
      function(r) {
          res.status(200).json(r);
      }
    )
})

module.exports = router;
