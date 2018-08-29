const DBLoc = process.env.DATABASE_HOST
const DB = process.env.DATABASE_NAME
const dns = require('dns');

function getHostname(){
    return new Promise((resolve, reject) => {
        console.log(DB)
        dns.lookup(DBLoc, (err, address, family) => {
            let urls = 'mongodb://' + address + ':27017'
            resolve(urls)
           });
    })
}
const url = 'mongodb://' + DBLoc + ':27017';
const dbName = DB;

module.exports = {url, dbName, getHostname}