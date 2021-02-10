const path = require('path');
const fs = require('fs');

const file_path = path.join(path.dirname(process.mainModule.filename), 'data', 'products.json');

const getProductsFromFile = cb => {
  fs.readFile(file_path, (err, fileContent) => {
    if (err || JSON.parse(JSON.stringify(fileContent)).data.length === 0) {
      cb([]);
    } else {
      cb(JSON.parse(fileContent));
    }
  });
};

class Product {
  constructor(title, imageurl, description, price) {
    this.title = title;
    this.imageUrl = imageurl;
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
  static fetchAll(cb) {
    getProductsFromFile(cb);
  }
}

module.exports = Product;