const Product = require('../models/product');

const shopData = async (pageNo, ITEMS_PER_PAGE) => {
    //sets the default page value to 1 if a value is not passed through a query parameter
    const page = parseInt(pageNo) || 1;
    //productsToSkip holds the number of products that were displayed in precedent pages
    const productsToSkip = (page - 1) * ITEMS_PER_PAGE;
    //fetching all products
    const totalNumOfProducts = await Product.find().countDocuments();
    //setting the number of pages based on the full number of products
    const numberOfPages = Math.ceil(totalNumOfProducts / ITEMS_PER_PAGE);
    //skip takes the cursor returned by find and skips the first n products (where n = productsToSkip)
    //limit takes the cursor returned by skip and returns the initial n products (where n = ITEMS_PER_PAGE)
    //filtering products as to the page's capacity using skip and limit
    const filteredProds = await Product.find().skip(productsToSkip).limit(ITEMS_PER_PAGE);
    return {
        prods: filteredProds,
        hasNextPage: ITEMS_PER_PAGE * page < totalNumOfProducts,
        hasPrevPage: page > 1,
        currentPage: page,
        nextPage: page + 1,
        prevPage: page - 1,
        lastPage: numberOfPages
    };
};

module.exports = shopData;