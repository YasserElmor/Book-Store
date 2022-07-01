const {getDb} = require("../util/database");
const {ObjectId} = require('mongodb');
class Product{
    constructor(title, price, description, imageUrl){
        [this.title, this.price, this.description, this.imageUrl] = [title, price, description, imageUrl];
    }
    
    save(){
        //gaining access to the connected database
        const db = getDb();
        //accessing an existing collection named products or creating it if it doesn't exist
        const products = db.collection('products');
        return products.insertOne(this);
    }
    static fetchAll(){
        const db = getDb();
        const products = db.collection('products');
        return products.find().toArray();
    }

    static findById(prodId){
        const db = getDb();
        const products = db.collection('products');
        return products.find({_id: new ObjectId(prodId)}).next();
    }
}


module.exports = Product;