import dotenv from "dotenv";

dotenv.config();

// Helper function to parse database URL (for Vercel Postgres)
const parseDatabaseUrl = (url) => {
  if (!url) return null;
  
  try {
    const parsed = new URL(url);
    return {
      username: parsed.username,
      password: parsed.password,
      host: parsed.hostname,
      port: parsed.port || 5432,
      database: parsed.pathname.slice(1), // Remove leading '/'
      dialect: "postgres",
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
    };
  } catch (error) {
    console.error("Error parsing database URL:", error);
    return null;
  }
};

// Check for Vercel Postgres connection string (POSTGRES_URL)
const postgresUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL;
const parsedUrl = postgresUrl ? parseDatabaseUrl(postgresUrl) : null;

const config = {
  development: parsedUrl || {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    dialect: process.env.DB_DIALECT || "postgres",
    dialectOptions: process.env.DB_SSL === "true" ? {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    } : {},
  },
  test: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: `${process.env.DB_NAME}_test`,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    dialect: process.env.DB_DIALECT || "postgres",
    dialectOptions: process.env.DB_SSL === "true" ? {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    } : {},
  },
  production: parsedUrl || {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    dialect: process.env.DB_DIALECT || "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    // Use connection string if available
    use_env_variable: postgresUrl ? "POSTGRES_URL" : undefined,
  },
};

export default config;
