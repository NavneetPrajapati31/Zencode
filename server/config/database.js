const mongoose = require("mongoose");

/**
 * Database configuration and connection management
 */
class DatabaseManager {
  constructor() {
    this.isConnected = false;
    this.connectionRetries = 0;
    this.maxRetries = 5;
  }

  /**
   * Connect to MongoDB with retry logic
   */
  async connect() {
    try {
      const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017/";
      console.log("MongoDB URI:", mongoURI); // Debug log

      const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        maxPoolSize: 10,
        minPoolSize: 2,
        maxIdleTimeMS: 30000,
        retryWrites: true,
        w: "majority",
        // Add connection event handlers
        bufferCommands: false,
        autoIndex: true,
      };

      await mongoose.connect(mongoURI, options);

      this.isConnected = true;
      this.connectionRetries = 0;

      console.log("✅ Connected to MongoDB successfully");
      console.log(`📊 Database: ${mongoURI}`);

      this.setupEventHandlers();
    } catch (error) {
      this.connectionRetries++;
      console.error(
        `❌ MongoDB connection failed (attempt ${this.connectionRetries}/${this.maxRetries}):`,
        error.message
      );

      if (this.connectionRetries < this.maxRetries) {
        console.log(`🔄 Retrying connection in 5 seconds...`);
        setTimeout(() => this.connect(), 5000);
      } else {
        console.error("❌ Max retry attempts reached. Exiting...");
        process.exit(1);
      }
    }
  }

  /**
   * Setup MongoDB connection event handlers
   */
  setupEventHandlers() {
    mongoose.connection.on("error", (err) => {
      console.error("❌ MongoDB connection error:", err);
      this.isConnected = false;
    });

    mongoose.connection.on("disconnected", () => {
      console.log("⚠️ MongoDB disconnected");
      this.isConnected = false;
    });

    mongoose.connection.on("reconnected", () => {
      console.log("🔄 MongoDB reconnected");
      this.isConnected = true;
    });

    mongoose.connection.on("connected", () => {
      console.log("✅ MongoDB connected");
      this.isConnected = true;
    });

    // Graceful shutdown
    process.on("SIGINT", async () => {
      await this.disconnect();
    });

    process.on("SIGTERM", async () => {
      await this.disconnect();
    });
  }

  /**
   * Disconnect from MongoDB
   */
  async disconnect() {
    try {
      if (mongoose.connection.readyState !== 0) {
        await mongoose.connection.close();
        console.log("🔌 MongoDB connection closed");
      }
      process.exit(0);
    } catch (err) {
      console.error("Error during shutdown:", err);
      process.exit(1);
    }
  }

  /**
   * Get connection status
   */
  getStatus() {
    return {
      isConnected: this.isConnected,
      readyState: mongoose.connection.readyState,
      host: mongoose.connection.host,
      port: mongoose.connection.port,
      name: mongoose.connection.name,
    };
  }

  /**
   * Check if database is ready
   */
  isReady() {
    return mongoose.connection.readyState === 1;
  }
}

// Create singleton instance
const databaseManager = new DatabaseManager();

module.exports = databaseManager;
