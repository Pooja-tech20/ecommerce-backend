const mongoose = require("mongoose");
require("dotenv").config();

console.log("🔧 Fixing review collection...");

const fixCollection = async () => {
  try {
    const mongoURI = "mongodb://127.0.0.1:27017/e_commerce";
    await mongoose.connect(mongoURI);
    console.log("✅ Connected to MongoDB!");

    const db = mongoose.connection.db;

    // 1. Check if review exists in reviews collection
    const reviewId = new mongoose.Types.ObjectId("6a75c8f554c08e3cd6e5f618");
    const reviewInReviews = await db.collection('reviews').findOne({ _id: reviewId });
    
    console.log(`\n🔍 Review in reviews: ${reviewInReviews ? '✅ YES' : '❌ NO'}`);
    
    if (reviewInReviews) {
      console.log("📝 Review found in reviews collection");
      
      // 2. Check if it exists in sellerreviews
      const reviewInSellerReviews = await db.collection('sellerreviews').findOne({ _id: reviewId });
      
      if (!reviewInSellerReviews) {
        console.log("📝 Copying review to sellerreviews collection...");
        // Copy the review
        reviewInReviews.sellerId = new mongoose.Types.ObjectId("6a759f31b01c1b2a5926ee0");
        reviewInReviews.status = "approved";
        reviewInReviews.sellerVisibility = "Published";
        
        await db.collection('sellerreviews').insertOne(reviewInReviews);
        console.log("✅ Review copied to sellerreviews");
      } else {
        console.log("✅ Review already exists in sellerreviews");
        // Update it
        await db.collection('sellerreviews').updateOne(
          { _id: reviewId },
          { 
            $set: { 
              sellerId: new mongoose.Types.ObjectId("6a759f31b01c1b2a5926ee0"),
              status: "approved",
              sellerVisibility: "Published"
            } 
          }
        );
        console.log("✅ Review updated with correct sellerId");
      }
    } else {
      console.log("❌ Review not found in reviews collection!");
      
      // Check all reviews
      const allReviews = await db.collection('reviews').find({}).toArray();
      console.log(`📝 Found ${allReviews.length} reviews in reviews collection`);
      
      if (allReviews.length > 0) {
        console.log("📝 Copying all reviews to sellerreviews...");
        for (const review of allReviews) {
          review.sellerId = new mongoose.Types.ObjectId("6a759f31b01c1b2a5926ee0");
          review.status = "approved";
          review.sellerVisibility = "Published";
          await db.collection('sellerreviews').insertOne(review);
        }
        console.log(`✅ Copied ${allReviews.length} reviews to sellerreviews`);
      }
    }

    // 3. Final stats
    const sellerReviewsCount = await db.collection('sellerreviews').countDocuments({});
    const reviewsCount = await db.collection('reviews').countDocuments({});
    
    console.log(`\n📊 FINAL STATS:`);
    console.log(`   sellerreviews: ${sellerReviewsCount}`);
    console.log(`   reviews: ${reviewsCount}`);

    await mongoose.disconnect();
    console.log("\n✅ Script completed successfully!");
    process.exit(0);

  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

fixCollection();