const { url, dbName } = require('../config');
const MongoClient = require('mongodb').MongoClient;
const multer  = require('multer')
const path = require('path')
const storage = multer.diskStorage({
    destination: './public/images/',
    filename: function ( req, file, cb ) {
      cb( null, path.basename(file.originalname, path.extname(file.originalname))+ '-' + Date.now()+ path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

const uploadImage = upload.single('ilustrasi');

function connect() {
  MongoClient.connect(url, { useNewUrlParser: true }, function(err, client) {
      if (err) return console.log(err)
      console.log("Connected successfully to server");
      const db = client.db(dbName);
      client.close();
  });
}

function getData(label, error, callback) {
  MongoClient.connect(url, {useNewUrlParser:true}, function(err, client) {
    if (err) return error(err);
    if (label == null || label == '' || typeof label == undefined) return error({ msg : "label required" })
    const db = client.db(dbName);
    const collectionName = label;
    const collection = db.collection(collectionName);
    // Read documents
    collection.find({}).toArray(function (err, r) {
      client.close();
      if (err) return error(err);
      return callback(r);
    })
  })
}

// data = { nama : padding, pengertian : ...., gambarIlustrasi : url, penggunaan : ...., label: CSS/HTML/PHP, tags : [CSS/HTML/PHP, Arkademy, dll] }
function insertData (data, error, callback) {
  MongoClient.connect(url, {useNewUrlParser:true}, function(err, client) {
    if (err) return error(err);
    if (data.label == null || data.label == '' || typeof data.label == undefined) return error({ msg : "label required" })
    const db = client.db(dbName);
    const collectionName = data.label;
    const collection = db.collection(collectionName);
    // Insert one documents
    collection.insertOne(data, function(err, r) {
      client.close();
      if (err) return error(err);
      return callback(r);
    });
  }); 
}

function getDataAll(error, callback) {
  const data = []
  MongoClient.connect(url, {useNewUrlParser:true}, function(err, client) {
    if (err) return error(err);
    const db = client.db(dbName);
    db.listCollections().toArray(function (err, r) {
      client.close();
      if (err) return error(err);
      if (r) {
        r.map(res => data.push(res.name))
      }
      return callback(data);
    })
  })
}

module.exports = { connect, insertData, getData, uploadImage, getDataAll }