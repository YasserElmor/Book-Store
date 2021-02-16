const path = require('path');
const fs = require('fs');


const file_path = path.join(path.dirname(process.mainModule.filename), 'data', 'products.json');
const fetch_items_from_file = require('../utils/fetch-items-from-file');
const getProductsFromFile = fetch_items_from_file.getProductsFromFile.bind(this, file_path);


class Product {
  constructor(title, imageUrl, description, price) {
    this.id = Math.random().toString();
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    getProductsFromFile(products => {
      products.push(this);
      fs.writeFile(file_path, JSON.stringify(products), err => {
        console.log(err);
      });
    });
  }

  static update(id, title, imageUrl, description, price) {
    getProductsFromFile(products => {
      const productIndex = products.findIndex(p => p.id === id);
      const product = products[productIndex];
      [product.title, product.imageUrl, product.description, product.price] = [title, imageUrl, description, price];
      fs.writeFile(file_path, JSON.stringify(products), err => {
        console.log(err);
      });
    });
  }

  static delete(id) {
    getProductsFromFile(products => {
      const productIndex = products.findIndex(p => p.id === id);
      products.splice(productIndex, 1);
      fs.writeFile(file_path, JSON.stringify(products), err => {
        console.log(err);
      });
    });
  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }

  static findByID(id, cb) {
    getProductsFromFile(products => {
      const product = products.find(p => p.id === id);
      cb(product);
    });
  }
}

module.exports = Product;