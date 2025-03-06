const express = require("express");
const router = express.Router({mergeParams:true});
const {validateReview,isLoggedIn,isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");

// reviews
// Post review route
router.post("/",validateReview,reviewController.postReview);

// delete review route
router.delete("/:reviewId",isReviewAuthor,reviewController.deleteReview);

module.exports = router;
