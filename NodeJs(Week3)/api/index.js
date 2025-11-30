import express from 'express';

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Health check endpoint (register first, no imports, no DB)
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Lazy load routes and DB (only when needed, not during module load)
let appInitialized = false;
let initializationPromise = null;

const initializeApp = async () => {
  if (appInitialized) {
    return;
  }

  if (initializationPromise) {
    return initializationPromise;
  }

  initializationPromise = (async () => {
    try {
      // Dynamically import routes and DB config
      const route = (await import('../src/routes/index.js')).default;
      const { initDb } = await import('../src/config/dbConfig.js');

      // Initialize database connection
      try {
        await initDb();
        console.log('Database connection established');
      } catch (dbError) {
        console.error('Database connection failed:', dbError);
        // Don't throw - app can still work for some endpoints
      }

      // Register routes
      route(app);
      appInitialized = true;
    } catch (error) {
      console.error('App initialization error:', error);
      // Add error route
      app.use((req, res) => {
        res.status(500).json({ 
          message: 'Application initialization failed',
          error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
      });
      throw error;
    }
  })();

  return initializationPromise;
};

// Initialize app before handling requests (except health check)
app.use(async (req, res, next) => {
  // Skip initialization for health check
  if (req.path === '/health') {
    return next();
  }
  
  try {
    await initializeApp();
    next();
  } catch (error) {
    console.error('Initialization error:', error);
    res.status(500).json({ 
      message: 'Application failed to initialize',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Export the Express app as a serverless function
export default app;
