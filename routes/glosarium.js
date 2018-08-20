const express = require('express');
const router = express.Router();
const { 
    insertData, 
    getData, 
    uploadImage, 
    getDataAll, 
    getCollection, 
    updateData, 
    deleteData 
} = require('../libraries/database');

router.get('/', function(req, res) {
    getData(
        req.query.label, req.query.komponen,
        function(err) {
            return res.status(500).json(err)
        },
        function(r) {
            return res.status(200).json(r);
        }
    )
});

router.post('/', uploadImage, function(req, res) {
    const data = req.body
    var msg = '';
    if(req.file) {
        data.ilustrasi = `http://localhost:7000/images/${req.file.filename}`
        msg = 'Data Inserted with Image'
    } else {
        msg = 'Data Inserted without Image'
    }
    insertData(
        data, 
        function(err) {
            return res.status(500).json(err)
        },
        function(r) {
            console.log(data)
            return res.status(201).json({ msg : msg });
        }
    )
})

router.get('/all', function(req, res) {
    const search = req.query.search || ""
    getDataAll(
        search, 
        function(err) {
            return res.status(500).json(err)
        },
        function(r) {
            return res.status(200).json(r);
        }
    )
})

router.get('/collection', function(req, res) {
    getCollection(function(err, result) {
        if (err) return res.status(500).json(err)
        return res.json(result)
    })
})

router.put('/', function(req, res) {
    console.log(req.body)
    const id = req.query.id
    updateData(id, req.body, function(err, result) {
        if (err) return res.status(500).json(err)
        return res.json(result)
    })
})

router.delete('/', function(req, res) {
    const { label, id } = req.query
    deleteData({ label, id }, function(err, result) {
        if (err) return res.status(500).json(err)
        return res.json(result)
    })
})

module.exports = router;
