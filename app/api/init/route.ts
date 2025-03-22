import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { env } from "@/lib/env"
import { logger, createRequestLogger } from "@/lib/logger"

// This endpoint initializes the database and creates default data
export async function GET(request: NextRequest) {
  const requestLogger = createRequestLogger("/api/init").start("GET")

  try {
    logger.info("Starting database initialization")

    // Check database connection
    logger.debug("Testing database connection")
    try {
      // Simple query to test connection
      await db.execute("SELECT 1")
      logger.info("Database connection successful")
    } catch (error) {
      logger.error("Database connection failed", error)

      // If we're in development, provide helpful information
      if (env.NODE_ENV === "development") {
        return NextResponse.json(
          {
            success: false,
            message: "Database connection failed. Make sure your DATABASE_URL is correct and the database is running.",
            error: (error as Error).message,
            databaseUrl: env.DATABASE_URL?.replace(/:[^:]*@/, ":****@"), // Hide password in logs
            help: "If running locally, make sure your PostgreSQL server is running and the database exists.",
          },
          { status: 500 },
        )
      }

      return NextResponse.json(
        {
          success: false,
          message: "Database initialization failed. Please contact system administrator.",
        },
        { status: 500 },
      )
    }

    // Check if tables exist by querying the users table
    logger.debug("Checking if database tables exist")
    let tablesExist = false
    try {
      await db.execute("SELECT * FROM users LIMIT 1")
      tablesExist = true
      logger.info("Database tables already exist")
    } catch (error) {
      logger.info("Database tables do not exist, will create them")
    }

    // If tables don't exist, run migrations
    if (!tablesExist) {
      logger.info("Running database migrations")
      try {
        // This would typically use a migration library like Drizzle ORM's migrate
        // For simplicity, we'll just run a SQL script directly

        // Read SQL from the migration file (in a real app)
        // const sql = fs.readFileSync('./drizzle/0000_initial_schema.sql', 'utf8')

        // For this example, we'll use inline SQL
        const sql = `
          -- Create users table
          CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            name VARCHAR(255) NOT NULL,
            role VARCHAR(50) NOT NULL DEFAULT 'user',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
          );
          
          -- Create customers table
          CREATE TABLE IF NOT EXISTS customers (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255),
            phone VARCHAR(50),
            address TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
          );
          
          -- Create products table
          CREATE TABLE IF NOT EXISTS products (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            description TEXT,
            price DECIMAL(10, 2) NOT NULL,
            stock INTEGER NOT NULL DEFAULT 0,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
          );
          
          -- Create orders table
          CREATE TABLE IF NOT EXISTS orders (
            id SERIAL PRIMARY KEY,
            customer_id INTEGER REFERENCES customers(id),
            status VARCHAR(50) NOT NULL DEFAULT 'pending',
            total DECIMAL(10, 2) NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
          );
          
          -- Create order_items table
          CREATE TABLE IF NOT EXISTS order_items (
            id SERIAL PRIMARY KEY,
            order_id INTEGER REFERENCES orders(id),
            product_id INTEGER REFERENCES products(id),
            quantity INTEGER NOT NULL,
            price DECIMAL(10, 2) NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
          );
          
          -- Create audit_logs table
          CREATE TABLE IF NOT EXISTS audit_logs (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id),
            action VARCHAR(50) NOT NULL,
            entity VARCHAR(50) NOT NULL,
            entity_id INTEGER,
            details JSONB,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
          );
        `

        // Execute the SQL script
        await db.execute(sql)
        logger.info("Database migrations completed successfully")

        // Seed initial data
        logger.info("Seeding initial data")

        // Create admin user (password: admin123)
        await db.execute(`
          INSERT INTO users (email, password, name, role)
          VALUES ('admin@aenzbi.com', '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6xNekdHgTGmrpHEfIoxm', 'Admin User', 'admin')
          ON CONFLICT (email) DO NOTHING
        `)

        // Create demo user (password: demo123)
        await db.execute(`
          INSERT INTO users (email, password, name, role)
          VALUES ('demo@aenzbi.com', '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6xNekdHgTGmrpHEfIoxm', 'Demo User', 'user')
          ON CONFLICT (email) DO NOTHING
        `)

        // Create sample customers
        await db.execute(`
          INSERT INTO customers (name, email, phone, address)
          VALUES 
            ('Acme Corporation', 'contact@acme.com', '555-123-4567', '123 Business Ave, Suite 100, Business City, 12345'),
            ('TechStart Inc.', 'info@techstart.com', '555-987-6543', '456 Innovation Blvd, Tech Valley, 67890'),
            ('Global Services LLC', 'support@globalservices.com', '555-456-7890', '789 Enterprise St, Commerce Town, 34567')
          ON CONFLICT DO NOTHING
        `)

        // Create sample products
        await db.execute(`
          INSERT INTO products (name, description, price, stock)
          VALUES 
            ('Business Analytics Suite', 'Complete business intelligence and analytics platform', 1299.99, 50),
            ('Cloud Storage Plan - 1TB', 'Secure cloud storage solution for businesses', 99.99, 100),
            ('Project Management Pro', 'Advanced project management software', 499.99, 75),
            ('Secure Email Gateway', 'Enterprise-grade email security solution', 799.99, 30),
            ('Customer Relationship Suite', 'All-in-one CRM platform', 999.99, 25)
          ON CONFLICT DO NOTHING
        `)

        // Create sample orders
        await db.execute(`
          INSERT INTO orders (customer_id, status, total)
          VALUES 
            (1, 'completed', 1299.99),
            (2, 'processing', 599.98),
            (3, 'pending', 999.99),
            (1, 'completed', 799.99)
          ON CONFLICT DO NOTHING
        `)

        // Create sample order items
        await db.execute(`
          INSERT INTO order_items (order_id, product_id, quantity, price)
          VALUES 
            (1, 1, 1, 1299.99),
            (2, 2, 6, 599.94),
            (3, 5, 1, 999.99),
            (4, 4, 1, 799.99)
          ON CONFLICT DO NOTHING
        `)

        logger.info("Initial data seeded successfully")
      } catch (error) {
        logger.error("Error during database initialization", error)
        return NextResponse.json(
          {
            success: false,
            message: "Database initialization failed",
            error: (error as Error).message,
          },
          { status: 500 },
        )
      }
    }

    requestLogger.end(200)
    return NextResponse.json({
      success: true,
      message: "Database initialized successfully",
      environment: env.NODE_ENV,
      databaseUrl: env.DATABASE_URL?.replace(/:[^:]*@/, ":****@"), // Hide password in logs
      defaultUsers: [
        { email: "admin@aenzbi.com", password: "admin123", role: "admin" },
        { email: "demo@aenzbi.com", password: "demo123", role: "user" },
      ],
    })
  } catch (error) {
    requestLogger.error(error)
    return NextResponse.json(
      {
        success: false,
        message: "An unexpected error occurred",
        error: (error as Error).message,
      },
      { status: 500 },
    )
  }
}

