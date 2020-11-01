const express = require('express'),
			router  = express.Router();

router.get('/', (req, res, next) => {
	res.render("shop");
})


module.exports = {
  router : router
}
