const mongoose = require("mongoose");
require("dotenv").config();

console.log("🔧 Testing controller logic...");

const testController = async () => {
  try {
    const mongoURI = "mongodb://127.0.0.1:27017/e_commerce";
    await mongoose.connect(mongoURI);
    console.log("✅ Connected to MongoDB!");

    // Load the SellerReview model
    const SellerReview = require("./models/seller/Review");
    console.log(`\n📦 Model: ${SellerReview.modelName}`);
    console.log(`   Collection: ${SellerReview.collection.name}`);

    // The seller ID from your login
    const sellerId = new mongoose.Types.ObjectId("6a759f310b1c01b28a5026e0");
    console.log(`\n🔍 Looking for reviews with sellerId: ${sellerId}`);

    // 1. Find reviews with this sellerId
    const reviews = await SellerReview.find({ sellerId: sellerId });
    console.log(`\n📝 Found ${reviews.length} reviews with this sellerId`);

    if (reviews.length > 0) {
      reviews.forEach((r, i) => {
        console.log(`   ${i+1}. _id: ${r._id}`);
        console.log(`      sellerId: ${r.sellerId}`);
        console.log(`      comment: ${r.comment}`);
      });
    } else {
      console.log("\n❌ No reviews found with this sellerId!");
      
      // Check what sellerIds exist in the collection
      console.log("\n🔍 Checking all sellerIds in collection:");
      const allReviews = await SellerReview.find({});
      console.log(`   Total reviews: ${allReviews.length}`);
      
      allReviews.forEach((r, i) => {
        console.log(`   ${i+1}. _id: ${r._id}`);
        console.log(`      sellerId: ${r.sellerId}`);
        console.log(`      sellerId type: ${typeof r.sellerId}`);
        console.log(`      sellerId string: ${r.sellerId ? r.sellerId.toString() : 'null'}`);
      });
    }

    // 2. Try to find specific review
    const reviewId = "6a76c2a7c6aa1a15a4a678eb";
    console.log(`\n🔍 Looking for specific review: ${reviewId}`);
    
    const specificReview = await SellerReview.findById(reviewId);
    if (specificReview) {
      console.log(`✅ Found review:`);
      console.log(`   sellerId: ${specificReview.sellerId}`);
      console.log(`   comment: ${specificReview.comment}`);
    } else {
      console.log("❌ Review not found by ID");
    }

    // 3. Try to find without sellerId filter
    console.log("\n🔍 Finding all reviews without filter:");
    const allReviews2 = await SellerReview.find({});
    console.log(`   Total: ${allReviews2.length}`);

    await mongoose.disconnect();
    process.exit(0);

  } catch (error) {
    console.error("❌ Error:", error.message);
    console.error(error.stack);
    process.exit(1);
  }
};

testController();