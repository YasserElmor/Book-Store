const mongoose = require('mongoose');
const {
    Schema
} = mongoose;
const Order = require('./order');

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    cart: {
        items: [{
            productId: {
                type: Schema.Types.ObjectId,
                ref: 'Product',
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
        }],
    },
});

userSchema.methods.addToCart = function (product) {
    let updatedCart;
    //returning the id if the input id already exists in the cart
    const existingId = this.cart.items.findIndex(item => JSON.stringify(item.productId) === JSON.stringify(product._id));
    //deep cloning the cart array into our temp updatedCart variable
    updatedCart = JSON.parse(JSON.stringify(this.cart));
    if (existingId !== -1) {
        //if such item exists, the quantity is increased by 1
        updatedCart.items[existingId].quantity += 1;
    } else {
        //if it doesn't exist, then we push another object(productId, quantity) into the this.cart.items array
        updatedCart.items.push({
            productId: product._id,
            quantity: 1
        });
    }
    this.cart = updatedCart;
    return this.save();
};

userSchema.methods.deleteProduct = function (prodId) {
    let updatedCartItems = JSON.parse(JSON.stringify(this.cart.items));
    updatedCartItems = updatedCartItems.filter(obj => obj.productId !== prodId);
    this.cart.items = updatedCartItems;
    return this.save();
};

userSchema.methods.getCart = async function () {
    const user = await this.populate('cart.items.productId');
    return user.cart.items;
};

userSchema.methods.addOrder = function () {
    return this.getCart()
        .then(products => {
            const order = new Order({
                products: products.map(obj => ({
                    product: {...obj.productId._doc},
                    quantity: obj.quantity
                })),
                user: {
                    userId: this._id,
                    name: this.name
                }
            });
            return order.save();
        })
        .then(() => {
            this.cart = {
                items: []
            };
            return this.save();
        });
};

module.exports = mongoose.model('User', userSchema);