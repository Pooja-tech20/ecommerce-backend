// // // fix-reviews.js
// // const mongoose = require("mongoose");
// // require("dotenv").config();

// // // Import models - FIXED PATHS
// // const Product = require("./models/Product");
// // const Review = require("./models/seller/Review");

// // const fixReviews = async () => {
// //   try {
// //     // Connect to MongoDB
// //     await mongoose.connect(process.env.MONGODB_URI || "mongodb://192.168.1.24:27017/e_commerce");
// //     console.log("✅ Connected to MongoDB");

// //     // Get all products
// //     const products = await Product.find({});
// //     console.log(`📦 Found ${products.length} products`);

// //     let updatedCount = 0;
// //     let totalReviews = 0;

// //     // Update reviews for each product
// //     for (const product of products) {
// //       // Find reviews for this product without sellerId
// //       const reviews = await Review.find({ 
// //         product: product._id,
// //         sellerId: { $exists: false } 
// //       });

// //       if (reviews.length > 0) {
// //         const result = await Review.updateMany(
// //           { 
// //             product: product._id,
// //             sellerId: { $exists: false } 
// //           },
// //           { 
// //             $set: { 
// //               sellerId: product.sellerId,
// //               status: "approved",
// //               sellerVisibility: "Published"
// //             } 
// //           }
// //         );
// //         updatedCount += result.modifiedCount;
// //         totalReviews += reviews.length;
// //         console.log(`✅ Updated ${result.modifiedCount} reviews for product: ${product.name}`);
// //       }
// //     }

// //     console.log(`\n📊 Summary:`);
// //     console.log(`   Total reviews updated: ${updatedCount}`);
// //     console.log(`   Total reviews processed: ${totalReviews}`);

// //     // Verify
// //     const allReviews = await Review.countDocuments({});
// //     const withSellerId = await Review.countDocuments({ sellerId: { $exists: true } });
// //     const withoutSellerId = await Review.countDocuments({ sellerId: { $exists: false } });

// //     console.log(`\n📊 Final Review Stats:`);
// //     console.log(`   Total reviews: ${allReviews}`);
// //     console.log(`   With sellerId: ${withSellerId}`);
// //     console.log(`   Without sellerId: ${withoutSellerId}`);

// //     // Show some sample reviews
// //     const sampleReviews = await Review.find({ sellerId: { $exists: true } }).limit(3);
// //     console.log(`\n📝 Sample reviews with sellerId:`);
// //     sampleReviews.forEach(r => {
// //       console.log(`   - Review ${r._id}: sellerId = ${r.sellerId}`);
// //     });

// //     process.exit(0);
// //   } catch (error) {
// //     console.error("❌ Error:", error.message);
// //     process.exit(1);
// //   }
// // };

// // fixReviews();

// const mongoose = require("mongoose");
// require("dotenv").config();

// console.log("🔧 Starting review fix script...");
// console.log("📦 Connecting to MongoDB...");

// const fixReviews = async () => {
//   try {
//     // ✅ FIX: Use localhost instead of 192.168.1.24
//     const mongoURI = "mongodb://127.0.0.1:27017/e_commerce";
//     console.log(`🔗 Connecting to: ${mongoURI}`);
    
//     await mongoose.connect(mongoURI);
//     console.log("✅ Connected to MongoDB successfully!");
    
//     // Import models AFTER connection
//     const Product = require("./models/Product");
//     const Review = require("./models/seller/Review");
    
//     // Get all products
//     const products = await Product.find({});
//     console.log(`📦 Found ${products.length} products`);

//     if (products.length === 0) {
//       console.log("⚠️ No products found in database!");
//       await mongoose.disconnect();
//       process.exit(0);
//     }

//     // Show products
//     products.forEach((p, i) => {
//       console.log(`   ${i+1}. ${p.name} (${p._id}) - sellerId: ${p.sellerId}`);
//     });

//     let updatedCount = 0;
//     let totalReviews = 0;

//     // Update reviews for each product
//     for (const product of products) {
//       const reviewsWithoutId = await Review.find({ 
//         product: product._id,
//         sellerId: { $exists: false } 
//       });

//       console.log(`\n📝 Product: ${product.name}`);
//       console.log(`   Found ${reviewsWithoutId.length} reviews without sellerId`);

//       if (reviewsWithoutId.length > 0) {
//         const result = await Review.updateMany(
//           { 
//             product: product._id,
//             sellerId: { $exists: false } 
//           },
//           { 
//             $set: { 
//               sellerId: product.sellerId,
//               status: "approved",
//               sellerVisibility: "Published"
//             } 
//           }
//         );
//         updatedCount += result.modifiedCount;
//         totalReviews += reviewsWithoutId.length;
//         console.log(`   ✅ Updated ${result.modifiedCount} reviews`);
//       }
//     }

//     console.log(`\n📊 SUMMARY:`);
//     console.log(`   Total reviews updated: ${updatedCount}`);
//     console.log(`   Total reviews processed: ${totalReviews}`);

//     // Verify
//     const allReviews = await Review.countDocuments({});
//     const withSellerId = await Review.countDocuments({ sellerId: { $exists: true } });
//     const withoutSellerId = await Review.countDocuments({ sellerId: { $exists: false } });

//     console.log(`\n📊 FINAL REVIEW STATS:`);
//     console.log(`   Total reviews: ${allReviews}`);
//     console.log(`   With sellerId: ${withSellerId}`);
//     console.log(`   Without sellerId: ${withoutSellerId}`);

//     if (allReviews > 0) {
//       console.log(`\n📝 SAMPLE REVIEWS:`);
//       const sampleReviews = await Review.find({}).limit(3);
//       sampleReviews.forEach((r, i) => {
//         console.log(`   ${i+1}. Review ${r._id}: sellerId = ${r.sellerId || 'MISSING'}`);
//       });
//     }

//     console.log("\n✅ Script completed successfully!");
//     await mongoose.disconnect();
//     process.exit(0);
    
//   } catch (error) {
//     console.error("❌ Error:", error.message);
//     process.exit(1);
//   }
// };

// fixReviews();

const mongoose = require("mongoose");
require("dotenv").config();

console.log("🔧 Starting complete fix script...");

const fixComplete = async () => {
  try {
    const mongoURI = "mongodb://127.0.0.1:27017/e_commerce";
    console.log(`🔗 Connecting to: ${mongoURI}`);
    
    await mongoose.connect(mongoURI);
    console.log("✅ Connected to MongoDB!");
    
    // Your seller ID
    const sellerId = new mongoose.Types.ObjectId("6a759f310b1c01b28a5026e0");
    console.log(`✅ Using seller ID: ${sellerId}`);
    
    // Import models
    const Product = require("./models/Product");
    const Review = require("./models/seller/Review");
    const User = require("./models/User");
    
    // 1. Update all products without sellerId
    console.log("\n📦 Updating products...");
    const productResult = await Product.updateMany(
      { sellerId: { $exists: false } },
      { $set: { sellerId: sellerId } }
    );
    console.log(`✅ Updated ${productResult.modifiedCount} products`);
    
    // 2. Check if reviews exist
    let reviewCount = await Review.countDocuments({});
    console.log(`\n📝 Reviews in database: ${reviewCount}`);
    
    if (reviewCount === 0) {
      console.log("⚠️ No reviews found. Creating test reviews...");
      
      // Find a product
      const product = await Product.findOne({});
      
      if (product) {
        // Find a user
        const user = await User.findOne({});
        
        if (user) {
          // Create multiple test reviews
          const testReviews = [
            {
              user: user._id,
              product: product._id,
              sellerId: sellerId,
              rating: 5,
              comment: "Excellent product! Highly recommended! ⭐⭐⭐⭐⭐",
              reviewerType: "user",
              status: "approved",
              sellerVisibility: "Published",
              helpfulCount: 10,
              helpfulUsers: [],
              verifiedPurchase: true,
              createdAt: new Date(),
              updatedAt: new Date()
            },
            {
              user: user._id,
              product: product._id,
              sellerId: sellerId,
              rating: 4,
              comment: "Good product, but could be better.",
              reviewerType: "user",
              status: "approved",
              sellerVisibility: "Published",
              helpfulCount: 5,
              helpfulUsers: [],
              verifiedPurchase: true,
              createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
              updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
            }
          ];
          
          const created = await Review.insertMany(testReviews);
          console.log(`✅ Created ${created.length} test reviews`);
        } else {
          console.log("⚠️ No user found. Creating a test user first...");
          // You would need to create a user here or use an existing one
        }
      } else {
        console.log("⚠️ No product found to create reviews");
      }
    } else {
      // Update existing reviews without sellerId
      console.log("\n📝 Updating existing reviews...");
      const reviewResult = await Review.updateMany(
        { sellerId: { $exists: false } },
        { $set: { sellerId: sellerId } }
      );
      console.log(`✅ Updated ${reviewResult.modifiedCount} reviews`);
    }
    
    // 3. Final stats
    const finalProducts = await Product.countDocuments({});
    const finalReviews = await Review.countDocuments({});
    const reviewsWithSellerId = await Review.countDocuments({ sellerId: { $exists: true } });
    
    console.log(`\n📊 FINAL STATS:`);
    console.log(`   Products: ${finalProducts}`);
    console.log(`   Reviews: ${finalReviews}`);
    console.log(`   Reviews with sellerId: ${reviewsWithSellerId}`);
    
    if (finalReviews > 0) {
      console.log(`\n📝 Sample reviews:`);
      const sample = await Review.find({}).limit(3);
      sample.forEach((r, i) => {
        console.log(`   ${i+1}. Review ${r._id}: sellerId = ${r.sellerId}`);
        console.log(`      Rating: ${r.rating}, Comment: ${r.comment.substring(0, 30)}...`);
      });
    }
    
    console.log("\n✅ Script completed successfully!");
    await mongoose.disconnect();
    process.exit(0);
    
  } catch (error) {
    console.error("❌ Error:", error.message);
    console.error(error.stack);
    process.exit(1);
  }
};

fixComplete();