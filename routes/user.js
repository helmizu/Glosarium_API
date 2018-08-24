var express = require('express');
var router = express.Router();

/* GET home page. */
router.post('/', function(req, res, next) {
    const { email, password } = req.body
    if(email === 'h@h.h' && password === 'helmi') {
        // req.session.user = req.body
        res.status(200).json(req.body)
    } else {
        res.status(404).send(false)
    }
});

module.exports = router;
