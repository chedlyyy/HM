import mongoose from "mongoose";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var _mongooseCache: MongooseCache | undefined;
}

const globalWithMongoose = global as typeof global & {
  _mongooseCache?: MongooseCache;
};

const cache: MongooseCache =
  globalWithMongoose._mongooseCache ?? {
    conn: null,
    promise: null,
  };

export async function connectToDatabase() {
  if (cache.conn) {
    return cache.conn;
  }

  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI environment variable is not set");
  }

  if (!cache.promise) {
    cache.promise = mongoose
      .connect(uri, {
        dbName: process.env.MONGODB_DB_NAME || "hamdi-shop",
      })
      .then((m) => m);
  }

  cache.conn = await cache.promise;

  if (!globalWithMongoose._mongooseCache) {
    globalWithMongoose._mongooseCache = cache;
  }

  return cache.conn;
}

