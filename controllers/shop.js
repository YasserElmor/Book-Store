const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const Product = require('../models/product');
const Order = require('../models/order');
const catchError500 = require('../util/catchError500');
const shopData = require('../util/shopData');
const ITEMS_PER_PAGE = 1; //number of items displayed on a single page
exports.getHomePage = async (req, res, next) => {
  try {
    const props = await shopData(req.query.page, ITEMS_PER_PAGE);
    res.render('shop/index', {
      pageTitle: 'Home Page',
      path: '/',
      ...props
    });
  } catch (err) {
    return next(catchError500(err));
  }
};

exports.getProducts = async (req, res, next) => {
  try {
    const props = await shopData(req.query.page, ITEMS_PER_PAGE);
    res.render("shop/product-list", {
      pageTitle: "Products",
      path: '/products',
      ...props
    });
  } catch (err) {
    return next(catchError500(err));
  }
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;

  Product.findById(prodId)
    .then(product => {
      res.render('shop/product-details', {
        pageTitle: product.title,
        path: '/products',
        product: product,
      });
    })
    .catch(err => {
      return next(catchError500(err));
    });
};

exports.getCart = ((req, res, next) => {
  return req.user.getCart()
    .then(products => {
      res.render('shop/cart', {
        pageTitle: 'Cart',
        path: '/cart',
        products: products,
      });
    })
    .catch(err => {
      return next(catchError500(err));
    });
});


exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then(product => {
      return req.user.addToCart(product);
    })
    .then(() => {
      res.redirect('/cart');
    })
    .catch(err => {
      return next(catchError500(err));
    });
};

exports.deleteCartProduct = (req, res, next) => {
  const prodId = req.body.productId;
  return req.user.deleteProduct(prodId)
    .then(() => {
      res.redirect('/cart');
    })
    .catch(err => {
      return next(catchError500(err));
    });
};

exports.postAddOrder = (req, res, next) => {
  return req.user.addOrder()
    .then(() => {
      res.redirect('/orders');
    })
    .catch(err => {
      return next(catchError500(err));
    });
};


exports.getOrders = (req, res, next) => {
  return Order.find({
      'user.userId': req.user._id
    })
    .then(orders => {
      res.render('shop/orders', {
        pageTitle: 'Orders',
        path: '/orders',
        orders: orders,
      });
    })
    .catch(err => {
      return next(catchError500(err));
    });
};

exports.getCheckout = (req, res, next) => {
  try {
    res.render('shop/checkout', {
      pageTitle: 'Checkout',
      path: '/checkout',
    });
  } catch (err) {
    return next(catchError500(err));
  }
};

exports.getInvoice = async (req, res, next) => {
  try {
    const orderId = req.params.orderId;
    const order = await Order.findOne({
      '_id': req.params.orderId,
      'user.userId': req.user._id
    });
    if (order.length === 0) {
      throw new Error('Unauthorized attempt at downloading order invoice!');
    }
    const invoiceName = `invoice-${orderId}.pdf`;
    const invoicePath = path.join('data', 'invoices', invoiceName);
    const pdfDoc = new PDFDocument();
    //we're using streams instead of reading the file directly
    //to stream the file data instead of buffering it
    //the pdfDoc instance is a readStream that could be piped to a writeStream
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${invoiceName}"`);
    pdfDoc.pipe(fs.createWriteStream(invoicePath));
    pdfDoc.pipe(res); //note that the response object is also a writeStream
    // #region order's invoice pdf file structure
    pdfDoc.fontSize(26).text('Invoice', {
      underline: true
    });
    pdfDoc.fontSize(6).text('\n');
    let product;
    let totalPrice = 0;
    for (let prod of order.products) {
      product = prod.product;
      totalPrice += product.price * prod.quantity;
      pdfDoc.fontSize(14).text(`${product.title}: ${prod.quantity} × $${product.price}`);
    }
    pdfDoc.text('\n');
    pdfDoc.text('---------------------------');
    pdfDoc.fontSize(20).text(`Total Price: $${totalPrice}`);
    //#endregion
    pdfDoc.end();
  } catch (err) {
    return next(catchError500(err));
  }

};