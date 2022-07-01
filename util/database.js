const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const url = 'mongodb+srv://admin:01065651408@learningcluster.5febr.mongodb.net/shop?retryWrites=true&w=majority';
let _db;


const mongoConnect = (cb) => {
    MongoClient.connect(url)
        .then(client => {
            _db = client.db();
            cb();
        })
        .catch(err => {
            console.log(err);
            throw err;
        });
};

const getDb = () => {
    if(_db){
        return _db;
    }
    else{
        throw 'No database found!';
    }
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;