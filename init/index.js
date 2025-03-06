const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

main().then((res)=>{
    console.log("Connection successful");
}) .catch((err)=>{
    console.log(err);
})

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

const initDB = async ()=>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({...obj,owner:'6792ea3ea1941c534845860a'}));
    await Listing.insertMany(initData.data);
    console.log("Data was initialized");
}
initDB();



// const mongoose = require("mongoose");
// const initData = require("./data.js"); // Ensure this file exports an object with a 'data' property
// const Listing = require("../models/listing.js");

// async function main() {
//     try {
//         // Connect to MongoDB
//         await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust", {
//             useNewUrlParser: true,
//             useUnifiedTopology: true,
//         });
//         console.log("Connection successful");

//         // Initialize the database
//         await initDB();
//     } catch (err) {
//         console.error("Database connection error:", err);
//     } finally {
//         // Close the connection after the operation
//         mongoose.connection.close();
//     }
// }

// const initDB = async () => {
//     try {
//         // Delete existing listings
//         await Listing.deleteMany({});
//         console.log("Existing data deleted");

//         // Insert sample data
//         await Listing.insertMany(initData.data);
//         console.log("Data was initialized");
//     } catch (error) {
//         console.error("Error initializing data:", error);
//     }
// };

// // Run the main function
// main();