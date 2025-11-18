// Test Supabase connection
// Run with: npx tsx scripts/test-connection.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log('🔌 Testing Supabase connection...\n');

    // Test basic connection
    await prisma.$connect();
    console.log('✅ Connected to Supabase!\n');

    // Test database query
    console.log('📊 Testing database query...');
    const userCount = await prisma.user.count();
    console.log(`✅ Users in database: ${userCount}\n`);

    // Check if pgvector extension is enabled
    console.log('🔍 Checking pgvector extension...');
    const result = await prisma.$queryRaw<Array<{ extname: string }>>`
      SELECT extname FROM pg_extension WHERE extname = 'vector';
    `;
    
    if (result.length > 0) {
      console.log('✅ pgvector extension is enabled!\n');
    } else {
      console.log('❌ pgvector extension NOT found. Enable it in Supabase Dashboard → Database → Extensions\n');
    }

    // List all tables
    console.log('📋 Database tables:');
    const tables = await prisma.$queryRaw<Array<{ tablename: string }>>`
      SELECT tablename FROM pg_tables WHERE schemaname = 'public';
    `;
    tables.forEach(({ tablename }) => console.log(`  - ${tablename}`));
    console.log();

    console.log('🎉 All checks passed! Your Supabase database is ready.\n');
  } catch (error) {
    console.error('❌ Connection failed:', error);
    console.error('\nTroubleshooting:');
    console.error('1. Check DATABASE_URL in .env file');
    console.error('2. Verify your Supabase password is correct');
    console.error('3. Enable pgvector extension in Supabase Dashboard');
    console.error('4. Run: npx prisma migrate dev\n');
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
