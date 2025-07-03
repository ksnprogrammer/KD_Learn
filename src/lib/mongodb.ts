import { MongoClient, ServerApiVersion } from 'mongodb';

const uri = process.env.MONGODB_URI;
let client: MongoClient | null = null; // Allow client to be null
let clientPromise: Promise<MongoClient>;

if (!uri) {
  // If MONGODB_URI is not set (e.g., during build or if MongoDB is not intended to be used)
  console.warn(
    'MONGODB_URI is not set. MongoDB features will be disabled. ' +
    'If this is a production deployment requiring MongoDB, ensure MONGODB_URI is configured in the environment.'
  );
  // Create a dummy clientPromise that will reject immediately.
  // Code using `await clientPromise` will then go into a catch block.
  clientPromise = Promise.reject(new Error('MongoDB URI not configured.'));
  // 'client' remains null, no MongoClient instance is created.
} else {
  // Original logic for when MONGODB_URI is present
  if (process.env.NODE_ENV === 'development') {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    if (!(global as any)._mongoClientPromise) {
      client = new MongoClient(uri, {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        },
      });
      (global as any)._mongoClientPromise = client.connect();
    }
    clientPromise = (global as any)._mongoClientPromise;
  } else {
    // In production mode, it's best to not use a global variable.
    client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });
    clientPromise = client.connect();
  }
}

// Export a module-scoped MongoClient promise.
export default clientPromise;
