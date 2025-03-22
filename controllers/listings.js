
const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
    let allListings = await Listing.find({});
    res.render("./listings/index.ejs", { allListings });
}

module.exports.filter = async (req, res) => {
    console.log(req.body);
    let allListings = await Listing.find({});
    let category = req.body.listing.category; 

    if (!category) {
        return res.status(400).send("Category not provided.");
    }
    console.log(category);
    res.render("./listings/filter.ejs", { allListings, category });
};

module.exports.searchListing = async (req, res) => {
    let allListings = await Listing.find({});
    let search_obj = req.body;
    let search = search_obj.search;
    console.log(search_obj);
    if (search) {
        for (let listing of allListings) {
            if (search.toLowerCase() == (listing.title).toLowerCase()) {
                return res.render("./listings/show.ejs", { listing });
            }
        }
        req.flash("error", "No such listing!");
        res.redirect("/listings");
    }
    // res.send(search_obj);
}

module.exports.renderNewForm = (req, res) => {
    res.render("./listings/new.ejs");
}

module.exports.createListing = wrapAsync(async (req, res) => {
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
    })
        .send();
    let url = req.file.path;
    let filename = req.file.filename;
    let newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image.url = url;
    newListing.image.filename = filename;
    newListing.geometry = response.body.features[0].geometry;
    await newListing.save();
    req.flash("success", "New listing created!");
    res.redirect("/listings");
});

module.exports.showListing = wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate(
        {
            path: "reviews",
            populate: {
                path: "author",
            }
        }).populate("owner");
    if (!listing) {
        req.flash("error", "Listing does not exist!");
        res.redirect("/listings");
    }
    res.render("./listings/show.ejs", { listing });
})

module.exports.editListing = wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing does not exist!");
        res.redirect("/listings");
    }
    let originalUrl = listing.image.url;
    originalUrl = originalUrl.replace("/upload", "/upload/w_250,e_blur:100");
    res.render("./listings/edit.ejs", { listing, originalUrl });
})

module.exports.updateListing = wrapAsync(async (req, res) => {
    const { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image.url = url;
        listing.image.filename = filename;
        await listing.save();
    }

    req.flash("success", "Listing updated!");
    res.redirect(`/listings/${id}`);
})

module.exports.deleteListing = wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deleted_list = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted!");
    res.redirect("/listings");
})