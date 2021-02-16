const fs = require('fs');
const path = require('path');


const file_path = path.join(path.dirname(process.mainModule.filename), 'data', 'cart.json');
const fetch_items_from_file = require('../utils/fetch-items-from-file');
const getCartFromFile = fetch_items_from_file.getCartFromFile.bind(this, file_path);

class Cart {

  static addProduct(id, productPrice) {
    //fetch the previous cart
    //check whether the passed id exists in it
    //add the new product if it's new or increment the quantity by one if it exists
    getCartFromFile(cart => {
      const existingProductIndex = cart.products.findIndex(product => product.id === id);
      const existingProduct = cart.products[existingProductIndex];
      let updatedProduct;

      if (existingProduct) {
        updatedProduct = {
          ...existingProduct
        };
        updatedProduct.quantity += 1;
        cart.products[existingProductIndex] = updatedProduct;
      } else {
        updatedProduct = {
          id: id,
          quantity: 1
        };
        cart.products = [...cart.products, updatedProduct];
      }

      cart.totalPrice += parseFloat(productPrice);
      cart.totalPrice = parseFloat(cart.totalPrice.toFixed(2));
      fs.writeFile(file_path, JSON.stringify(cart), err => {
        console.log(err);
      });
    });
  }

  static getCart(cb) {
    getCartFromFile(cart => {
      cb(cart);
    });
  }

}



module.exports = Cart;