/**
 * Supabase Client Configuration for React Native
 * This file initializes and exports the Supabase client for the mobile app
 */

import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';

// Expo environment variables must be prefixed with EXPO_PUBLIC_
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase not configured. Please add EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY to your .env file.'
  );
}

// Create Supabase client with anon key for client-side operations
// This key is safe to expose in the client app
const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || '',
  {
    auth: {
      // Storage will be handled by expo-secure-store after implementation
      storage: undefined,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);

export default supabase;
