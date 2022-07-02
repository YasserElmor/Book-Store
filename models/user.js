const {getDb} = require("../util/database");
const {ObjectId} = require('mongodb');

class User{
    constructor(username, email, cart, id){
        [this.username, this.email, this.cart, this._id] = [username, email, cart, id];
    }

    save(){
        const db = getDb();
        const users = db.collection('users');
        return users.insertOne(this);
    }

    //This is a practical example of when we might embed a model into another (Cart into User)
    //we'll deal with cart as a property of the user since it's a one-to-one relationship between the user and the cart
    //cart is embedded in user, and product is referenced by ID by the cart object
    addToCart(product){
        let updatedCart;
        const prodId = new ObjectId(product._id);
        if(!this.cart){
            updatedCart = { items: [ {productId: prodId, quantity: 1}, ] };
        }
        else{
            const existingId = this.cart.items.findIndex(item => JSON.stringify(new ObjectId(item.productId)) === JSON.stringify(prodId) );
            updatedCart = JSON.parse(JSON.stringify(this.cart));
            if(existingId!== -1){
                    updatedCart.items[existingId].quantity += 1;
                }
            else{
                updatedCart.items.push({productId: prodId, quantity: 1});
            }

        }
        const db = getDb();
        const users = db.collection('users');
        return users.updateOne({_id: new ObjectId(this._id)}, {$set: {cart: updatedCart}});
    }
    //returns a populated array of objects of all products in the cart and their respective quantities
    async getCart() {
        const db = getDb();
        const productsCollection = db.collection('products');
        if (!this.cart) {
            return [];
        }
        const productsIds = this.cart.items.map(obj => new ObjectId(obj.productId));
        return productsCollection.find({
            _id: {
                $in: productsIds
            }
        }).toArray()
        .then(prodsArr => {
            return prodsArr.map(e => ({
                ...e,
                quantity: this.cart.items.find(item => item.productId.toString() === e._id.toString()).quantity
            }));
        });
    }

    deleteProduct(prodId){
        let updatedCartItems = JSON.parse(JSON.stringify(this.cart.items));
        updatedCartItems = updatedCartItems.filter(obj => obj.productId !== prodId);
        const db = getDb();
        const users = db.collection('users');
        return users.updateOne({_id: new ObjectId(this._id)}, {$set: {cart: {items: updatedCartItems}}});
    }

    addOrder() {
        const db = getDb();
        const ordersCollection = db.collection('orders');
        return this.getCart()
        .then(products => {
            const order = {
                items: products,
                user:{
                    _id: new ObjectId(this._id),
                    username: this.username
                }
            };
            return ordersCollection.insertOne(order);
        })
        .then( () => {
            this.cart = {items: []};
            return db.collection('users').updateOne({_id: new ObjectId(this._id)}, {$set: {cart: {items: [] }}});
        });
    }

    getUserOrders(){
        const db = getDb();
        const ordersCollection = db.collection('orders');
        return ordersCollection.find({'user._id': new ObjectId(this._id)}).toArray();
    }

    static findById(userId){
        const db = getDb();
        const users = db.collection('users');
        return users.find({_id: new ObjectId(userId)}).next();
    }
}


module.exports = User;