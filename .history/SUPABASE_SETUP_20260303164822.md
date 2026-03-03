# Supabase Setup Guide

This guide will help you set up Supabase for the My Wallet application.

## Prerequisites

- A Supabase account (sign up at https://supabase.com)
- Node.js installed on your machine

## Step 1: Create a Supabase Project

1. Go to https://app.supabase.com
2. Click "New Project"
3. Fill in your project details:
   - Name: `my-wallet` (or any name you prefer)
   - Database Password: Generate a strong password and save it securely
   - Region: Choose the closest region to your users
4. Click "Create new project"
5. Wait for the project to be provisioned (usually takes 1-2 minutes)

## Step 2: Get Your Supabase Credentials

1. Once your project is created, go to **Settings** → **API**
2. You'll find:
   - **Project URL**: This is your `SUPABASE_URL`
   - **Project API keys**:
     - `anon` `public` key: This is your `SUPABASE_ANON_KEY`
     - `service_role` `secret` key: This is your `SUPABASE_SERVICE_ROLE_KEY`

## Step 3: Configure Server Environment

1. Copy the `.env.example` file to `.env`:
   ```bash
   cd server
   cp .env.example .env
   ```

2. Edit the `.env` file and replace the placeholder values:
   ```env
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   JWT_SECRET=generate_a_random_32_character_string
   ```

3. Generate a secure JWT secret:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

## Step 4: Configure Client Environment

1. Copy the `.env.example` file to `.env`:
   ```bash
   cd client
   cp .env.example .env
   ```

2. Edit the `.env` file:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   ```

   **Note**: In Expo/React Native, environment variables must be prefixed with `EXPO_PUBLIC_` to be accessible in the app.

## Step 5: Create Database Schema

After configuring Supabase, you'll need to create the database schema as defined in `PLANNING.md` section 1.2.

You can run SQL migrations in the Supabase SQL Editor:
1. Go to your Supabase project
2. Click on **SQL Editor** in the left sidebar
3. Create tables as per the schema in PLANNING.md

## Step 6: Verify Installation

1. Start the server:
   ```bash
   cd server
   npm run dev
   ```

2. Check the console for any Supabase connection errors

3. Start the client:
   ```bash
   cd client
   npm start
   ```

## Security Notes

⚠️ **Important Security Information:**

- **Never commit `.env` files** to version control
- The `.env.example` files are templates and don't contain sensitive data
- `SUPABASE_SERVICE_ROLE_KEY` bypasses Row Level Security - only use it in the backend
- `SUPABASE_ANON_KEY` is safe to use in the client app
- Keep your `JWT_SECRET` secure and never expose it

## Troubleshooting

### "Missing Supabase environment variables" error
- Make sure your `.env` file is in the correct directory
- Check that you've copied all required variables from `.env.example`
- Verify there are no typos in variable names

### React Native can't access environment variables
- Make sure variables are prefixed with `EXPO_PUBLIC_`
- Restart the Expo development server after changing `.env`
- Clear the cache: `expo start -c`

### Connection timeouts
- Verify your Supabase project is running and not paused
- Check your internet connection
- Verify the `SUPABASE_URL` is correct

## Next Steps

After completing the Supabase setup:
1. Continue with section 1.2 of `PLANNING.md` to create the database schema
2. Set up Row Level Security policies (section 1.4)
3. Proceed with Authentication System implementation (section 2)

For more information, refer to the [Supabase Documentation](https://supabase.com/docs).
