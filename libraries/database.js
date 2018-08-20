const { url, dbName } = require('../config');
const MongoClient = require('mongodb').MongoClient;
const OID = require('mongodb').ObjectId;
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
    client.close();
    if (err) return console.log(err)
    console.log("Connected successfully to server");
    const db = client.db(dbName);
  });
}

function getData(label, search = '', error, callback) {
  MongoClient.connect(url, {useNewUrlParser:true}, function(err, client) {
    if (err) return error(err);
    if (label == null || label == '' || typeof label == undefined) return error({ msg : "label required" })
    var filter = {};
    if (search != '') {
      filter = {"nama": { $regex : search }}
    } else {
      filter = {}
    }
    const db = client.db(dbName);
    const collectionName = label;
    const collection = db.collection(collectionName);
    // Read documents
    collection.find(filter).toArray(function (err, r) {
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

function getDataAll(search, error, callback) {
  const dataHandler = []
  const colName = []
  const dataCb = []
  var filter = {};
  if (search != '') {
    filter = {"nama": { $regex : search }}
  } else {
    filter = {}
  }
  MongoClient.connect(url, {useNewUrlParser:true}, function(err, client) {
    if (err) return error(err);
    const db = client.db(dbName);
    db.listCollections().toArray(function (err, r) {
      if (err) return error(err);
      if (r) r.map(res => colName.push(res.name))
      if (colName) {
        colName.map(col => {
          const collection = db.collection(col);
          collection.find(filter).toArray(function (err, r) {
            client.close();
            if (err) return error(err);
            if (r) {
              dataHandler.push(r);
              r.map(res => {
                dataCb.push(res)
              })
            }
            if (dataHandler.length == colName.length) return callback(dataCb)
          })
        })
      }
    })
  })
}

function getCollection(cb) {
  MongoClient.connect(url, {useNewUrlParser:true}, function(err, client) {
    if (err) return error(err);
    const db = client.db(dbName);
    db.listCollections().toArray(function (err, r) {
      client.close();
      if (err) return error(err, null);
      if (r) return cb(null, r);
    })
  })
}

function updateData(id, data, cb) {
  MongoClient.connect(url, {useNewUrlParser:true}, function(err, client) {
    if (err) return cb(err, null);
    const db = client.db(dbName);
    const ObID = new OID(id);
    db.listCollections().toArray(function (err, colList) {
      if (err) return cb(err, null)
      colList.map(col => {
        const collection = db.collection(col.name);
        collection.find({_id : ObID}).toArray(function (err, result) {
          if (err) return cb(err, null)
          if (result.length === 1) {
            collection.findOneAndUpdate({_id: ObID}, {$set: data}, {upsert: true}, function(err, r) {
              client.close();
              if (err) return cb(err, null);
              return cb(null, r);
            })
          }
        })
      })
    })
  }) 
}

function deleteData(data, cb) {
  MongoClient.connect(url, {useNewUrlParser:true}, function(err, client) {
    if (err) return cb(err, null);
    if (data.label == null || data.label == '' || typeof data.label == undefined) return cb({ msg : "label required" }, null)
    if (data.id == null || data.id == '' || typeof data.id == undefined) return cb({ msg : "id required" }, null)
    const db = client.db(dbName);
    const collection = db.collection(data.label)
    const ObID = new OID(data.id)
    
    collection.findOneAndDelete({_id:ObID}, function(err, r) {
      client.close();
      if (err) return cb(err, null);
      return cb(null, r);
    })
  })
}
module.exports = { connect, insertData, getData, uploadImage, getDataAll, getCollection, updateData, deleteData }