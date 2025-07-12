# Online Judge Server

## MongoDB Setup and Troubleshooting

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)

### Installation

1. Install dependencies:

```bash
npm install
```

2. Create environment file:

```bash
# Copy the .env.example or create .env manually
```

3. Start the server:

```bash
npm run dev
```

### MongoDB Connection Issues

#### Common Problems and Solutions

1. **Connection Refused Error**

   - **Problem**: `ECONNREFUSED` or `HostUnreachable`
   - **Solution**: Ensure MongoDB is running

   ```bash
   # Windows
   net start MongoDB

   # macOS
   brew services start mongodb-community

   # Linux
   sudo systemctl start mongod
   ```

2. **Authentication Issues**

   - **Problem**: Authentication failed
   - **Solution**: Check MongoDB credentials in `.env` file

   ```env
   MONGODB_URI=mongodb://username:password@localhost:27017/online-judge
   ```

3. **Network Timeout Issues**

   - **Problem**: Connection timeouts in logs
   - **Solution**: The server now includes improved timeout handling and retry logic

4. **NamespaceNotFound Error**
   - **Problem**: `config.system.sessions does not exist`
   - **Solution**: This is a warning that can be ignored, but ensure proper database initialization

### Health Check

Check MongoDB status:

```bash
npm run check-mongodb
```

Or visit the health endpoint:

```
GET http://localhost:5000/api/health
```

### Environment Variables

Create a `.env` file in the server directory:

```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration (for future use)
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d
```

### Database Management

The server now includes:

- ✅ Automatic retry logic (up to 5 attempts)
- ✅ Connection pooling optimization
- ✅ Graceful shutdown handling
- ✅ Real-time connection monitoring
- ✅ Health check endpoints
- ✅ Improved error logging

### Troubleshooting Steps

1. **Check if MongoDB is running**:

   ```bash
   # Windows
   sc query MongoDB

   # macOS/Linux
   ps aux | grep mongod
   ```

2. **Test MongoDB connection**:

   ```bash
   npm run check-mongodb
   ```

3. **Check server logs**:

   ```bash
   npm run dev
   ```

4. **Verify port availability**:
   ```bash
   # Check if port 27017 is in use
   netstat -an | findstr 27017
   ```

### Performance Optimizations

The server now includes:

- Connection pooling (max 10, min 2 connections)
- Socket timeout management (45s)
- Server selection timeout (5s)
- Automatic reconnection
- Buffer management

### Monitoring

Monitor the database connection status:

```javascript
// In your application
const databaseManager = require("./config/database");
const status = databaseManager.getStatus();
console.log(status);
```

### Log Files

MongoDB logs are stored in:

- Windows: `C:\Program Files\MongoDB\Server\[version]\log\mongod.log`
- Linux/macOS: `/var/log/mongodb/mongod.log`

Check for specific errors:

```bash
# Search for errors in MongoDB log
grep -i "error\|failed\|exception" mongod.log
```
