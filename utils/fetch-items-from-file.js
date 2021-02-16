const fs = require('fs');


const getProductsFromFile = (file_path, cb) => {
  fs.readFile(file_path, (err, fileContent) => {
    if (err || JSON.parse(JSON.stringify(fileContent)).data.length === 0) {
      cb([]);
    } else {
      cb(JSON.parse(fileContent));
    }
  });
};

const getCartFromFile = (file_path, cb) => {
  fs.readFile(file_path, (err, fileContent) => {
    if (err || JSON.parse(JSON.stringify(fileContent)).data.length === 0) {
      cb({
        products: [],
        totalPrice: 0.00
      });
    } else {
      cb(JSON.parse(fileContent));
    }
  });
};


exports.getProductsFromFile = getProductsFromFile;
exports.getCartFromFile = getCartFromFile;