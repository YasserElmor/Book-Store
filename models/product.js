const {getDb} = require("../util/database");
const {ObjectId} = require('mongodb');
class Product{
    //the id parameter is optional, and is only used when updating since the _id property is automatically generated by mongodb
    constructor(title, price, description, imageUrl, id, userId){
        [this.title, this.price, this.description, this.imageUrl, this._id, this.userId] = [
            title, price, description, imageUrl, id?new ObjectId(id):null, userId
        ];
    }
    
    save(){
        //gaining access to the connected database
        const db = getDb();
        //accessing an existing collection named products or creating it if it doesn't exist
        const products = db.collection('products');
        // a database operation variable holding either the saved or updated operation based on the following conditional statements
        let dbOp;
        //check if this._id exists (meaning it was assigned by mongodb), then we'll update the product
        if(this._id){
            dbOp = products.updateOne({_id: this._id}, {$set: this} );
        }
        //else if it doesn't exist, then we'll create the product
        else{
            dbOp = products.insertOne(this);
        }
        return dbOp;
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

    static deleteById(prodId){
        const db = getDb();
        const products = db.collection('products');
        return products.deleteOne({_id: new ObjectId(prodId)});
    }
}


module.exports = Product;