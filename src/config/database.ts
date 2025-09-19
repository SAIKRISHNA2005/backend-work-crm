import { createClient } from "@supabase/supabase-js";
import { config } from "./environment";
import { logger } from "../utils/logger";

// Create Supabase client
export const supabase = createClient(
  config.supabase.url,
  config.supabase.serviceRoleKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// Create Supabase client for public operations (with anon key)
export const supabasePublic = createClient(
  config.supabase.url,
  config.supabase.anonKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// Test database connection
export const testConnection = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('schools')
      .select('count')
      .limit(1);
    
    if (error) {
      logger.error("Database connection test failed:", error);
      return false;
    }
    
    logger.info("✅ Supabase database connected successfully");
    return true;
  } catch (error) {
    logger.error("❌ Database connection test failed:", error);
    return false;
  }
};

// Initialize database connection
export const connectDB = async (): Promise<void> => {
  try {
    const isConnected = await testConnection();
    
    if (!isConnected) {
      throw new Error("Failed to connect to Supabase database");
    }
    
    logger.info("✅ Database connection established");
    
    // Graceful shutdown
    process.on('SIGINT', () => {
      logger.info('Database connection closed through app termination');
      process.exit(0);
    });

  } catch (error) {
    logger.error("❌ Database connection failed:", error);
    process.exit(1);
  }
};

export default connectDB;
