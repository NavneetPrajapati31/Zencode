const { MongoClient } = require("mongodb");

/**
 * MongoDB Health Check Script
 * This script checks if MongoDB is running and accessible
 */

async function checkMongoDB() {
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/";

  console.log("🔍 Checking MongoDB connection...");
  console.log(`📊 URI: ${uri}`);

  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    maxPoolSize: 1,
  });

  try {
    await client.connect();
    console.log("✅ MongoDB is running and accessible");

    // Test database operations
    const db = client.db();
    const collections = await db.listCollections().toArray();
    console.log(`📁 Database: ${db.databaseName}`);
    console.log(`📂 Collections: ${collections.length}`);

    if (collections.length > 0) {
      console.log("📋 Available collections:");
      collections.forEach((collection) => {
        console.log(`   - ${collection.name}`);
      });
    }

    // Test basic operations
    const testCollection = db.collection("test_connection");
    await testCollection.insertOne({ test: true, timestamp: new Date() });
    console.log("✅ Write operation successful");

    const result = await testCollection.findOne({ test: true });
    console.log("✅ Read operation successful");

    // Clean up test data
    await testCollection.deleteOne({ test: true });
    console.log("✅ Delete operation successful");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);

    if (error.message.includes("ECONNREFUSED")) {
      console.log("\n💡 Possible solutions:");
      console.log("1. Make sure MongoDB is installed and running");
      console.log("2. Start MongoDB service:");
      console.log("   - Windows: net start MongoDB");
      console.log("   - macOS: brew services start mongodb-community");
      console.log("   - Linux: sudo systemctl start mongod");
      console.log("3. Check if MongoDB is running on the correct port (27017)");
      console.log("4. Verify firewall settings");
    }

    process.exit(1);
  } finally {
    await client.close();
    console.log("🔌 Connection closed");
  }
}

// Run the check
checkMongoDB().catch(console.error);
