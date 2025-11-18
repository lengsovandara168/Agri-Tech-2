// Test database connection
// Run with: node test-db-connection.js

require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testConnection() {
  console.log('Testing database connection...\n');
  
  try {
    // Test basic connection
    await prisma.$connect();
    console.log('✅ Successfully connected to database');
    
    // Test query
    const result = await prisma.$queryRaw`SELECT version()`;
    console.log('✅ Query successful');
    console.log('PostgreSQL version:', result[0].version);
    
    // Check if User table exists
    try {
      const userCount = await prisma.user.count();
      console.log(`✅ User table exists (${userCount} users)`);
    } catch (error) {
      console.log('⚠️  User table does not exist yet - run "npm run db:push"');
    }
    
    console.log('\n🎉 Database connection is working!');
  } catch (error) {
    console.error('❌ Database connection failed:\n');
    console.error('Error:', error.message);
    
    if (error.message.includes('Tenant or user not found')) {
      console.error('\n💡 Possible solutions:');
      console.error('1. Check if your Supabase project is active (not paused)');
      console.error('2. Verify your database password in .env file');
      console.error('3. Get fresh connection strings from Supabase dashboard');
      console.error('\nSupabase Dashboard: https://app.supabase.com/project/vcfbhjzvucfruskclrid/settings/database');
    }
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
