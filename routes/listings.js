const express = require("express");
const router = express.Router();
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });
// const upload = multer({dest: 'uploads/'});

router.route("/")
    .get(listingController.index)

router.route("/listings")
    .get(listingController.index)  // View all listings (index route)
    .post(isLoggedIn, upload.single('listing[image]'), validateListing, listingController.createListing);  // create route

router.route("/listings/filter")
    .post(listingController.filter)

router.route("/listings/search")
    .post(listingController.searchListing);


// New listing form (new route)
router.get("/listings/new", isLoggedIn, listingController.renderNewForm)

router.route("/listings/:id")
    .get(listingController.showListing)  // show particular listing (show route)
    .put(isOwner, upload.single('listing[image]'), validateListing, listingController.updateListing)  //update route
    .delete(isLoggedIn, isOwner, listingController.deleteListing)  //delete route


// edit route
router.get("/listings/:id/edit", isLoggedIn, listingController.editListing);



module.exports = router;
