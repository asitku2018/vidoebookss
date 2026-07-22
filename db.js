const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Ensure your environment variables are available
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase URL or Key in environment variables.');
}

// Initialize the Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Test query function to check connection with 'ebooks' (or your_table)
async function testConnection() {
    try {
        // Replace 'ebooks' with any table name from your Supabase project
       const { createClient } = require('@supabase/supabase-js');
