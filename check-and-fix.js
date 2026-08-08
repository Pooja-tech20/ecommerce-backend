const mongoose = require("mongoose");
require("dotenv").config();

console.log("🔧 Checking sellerreviews collection...");

const checkAndFix = async () => {
  try {
    const mongoURI = "mongodb://127.0.0.1:27017/e_commerce";
    await mongoose.connect(mongoURI);
    console.log("✅ Connected to MongoDB!");

    const db = mongoose.connection.db;

    // 1. Get all reviews from sellerreviews
    const allReviews = await db.collection('sellerreviews').find({}).toArray();
    console.log(`\n📝 Total reviews in sellerreviews: ${allReviews.length}`);

    // 2. Show each review
    allReviews.forEach((review, index) => {
      console.log(`\n📋 Review ${index + 1}:`);
      console.log(`   _id: ${review._id}`);
      console.log(`   product: ${review.product}`);
      console.log(`   sellerId: ${review.sellerId || 'MISSING'}`);
      console.log(`   rating: ${review.rating}`);
      console.log(`   comment: ${review.comment}`);
      console.log(`   status: ${review.status || 'MISSING'}`);
    });

    // 3. Update ALL reviews with the correct seller ID
    const sellerId = new mongoose.Types.ObjectId("6a759f31b01c1b2a5926ee0");
    console.log(`\n🔧 Updating all reviews with sellerId: ${sellerId}`);
    
    const result = await db.collection('sellerreviews').updateMany(
      {},
      { 
        $set: { 
          sellerId: sellerId,
          status: "approved",
          sellerVisibility: "Published"
        } 
      }
    );
    
    console.log(`✅ Updated ${result.modifiedCount} reviews`);

    // 4. Verify the update
    const updatedReviews = await db.collection('sellerreviews').find({}).toArray();
    console.log(`\n📊 After update:`);
    updatedReviews.forEach((review, index) => {
      console.log(`   Review ${index + 1}: sellerId = ${review.sellerId}`);
    });

    // 5. Count reviews with correct sellerId
    const correctCount = await db.collection('sellerreviews').countDocuments({ 
      sellerId: sellerId 
    });
    console.log(`\n✅ Reviews with correct sellerId: ${correctCount}`);

    await mongoose.disconnect();
    process.exit(0);

  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

checkAndFix();