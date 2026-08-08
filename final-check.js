const mongoose = require("mongoose");
require("dotenv").config();

console.log("🔧 FINAL CHECK...");

const finalCheck = async () => {
  try {
    const mongoURI = "mongodb://127.0.0.1:27017/e_commerce";
    await mongoose.connect(mongoURI);
    console.log("✅ Connected to MongoDB!");

    const db = mongoose.connection.db;

    // 1. Check all collections
    const collections = await db.listCollections().toArray();
    console.log("\n📂 Collections:", collections.map(c => c.name));

    // 2. Check sellerreviews collection
    const sellerReviews = await db.collection('sellerreviews').find({}).toArray();
    console.log(`\n📝 sellerreviews count: ${sellerReviews.length}`);
    sellerReviews.forEach((r, i) => {
      console.log(`   ${i+1}. _id: ${r._id}, sellerId: ${r.sellerId}, product: ${r.product}`);
    });

    // 3. Load SellerReview model
    console.log("\n📦 Loading SellerReview model...");
    const SellerReview = require("./models/seller/Review");
    console.log(`   Model name: ${SellerReview.modelName}`);
    console.log(`   Collection: ${SellerReview.collection.name}`);

    // 4. Try to find reviews using the model
    console.log("\n🔍 Querying with SellerReview model...");
    const allReviews = await SellerReview.find({});
    console.log(`   Found ${allReviews.length} reviews`);

    if (allReviews.length > 0) {
      allReviews.forEach((r, i) => {
        console.log(`   ${i+1}. _id: ${r._id}, sellerId: ${r.sellerId}`);
      });
    } else {
      console.log("   ❌ No reviews found!");
      
      // Try with the specific sellerId
      const sellerId = new mongoose.Types.ObjectId("6a759f31b01c1b2a5926ee0");
      console.log(`\n🔍 Querying with sellerId: ${sellerId}`);
      const reviewsBySeller = await SellerReview.find({ sellerId: sellerId });
      console.log(`   Found ${reviewsBySeller.length} reviews with this sellerId`);
    }

    // 5. Try to find the specific review
    const reviewId = "6a75c8f554c08e3cd6e5f618";
    console.log(`\n🔍 Looking for specific review: ${reviewId}`);
    try {
      const specificReview = await SellerReview.findById(reviewId);
      console.log(`   Found: ${specificReview ? '✅ YES' : '❌ NO'}`);
      if (specificReview) {
        console.log(`   sellerId: ${specificReview.sellerId}`);
        console.log(`   comment: ${specificReview.comment}`);
      }
    } catch (err) {
      console.log(`   Error: ${err.message}`);
    }

    await mongoose.disconnect();
    process.exit(0);

  } catch (error) {
    console.error("❌ Error:", error.message);
    console.error(error.stack);
    process.exit(1);
  }
};

finalCheck();