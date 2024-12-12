import { MongoClient } from 'mongodb';
import { encrypt } from '../../../../utils/encrypt/route';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

const uri = process.env.MONGO_URI; 
const client = new MongoClient(uri);

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');
  const pass = searchParams.get('pass');

  // If no email and password provided, show required message
  if (!email || !pass) {
    return new Response(
      JSON.stringify({ message: 'Email and password are required', success: false }),
      { status: 400 }
    );
  }

  // Validate environment variable
  if (!uri) {
    throw new Error("MONGO_URI is not defined in the environment variables");
  }

  try {
    // Connect to the database
    await client.connect();
    const db = client.db('Krispy_Kreme_Ltd'); 
    const collection = db.collection('Customers'); 

    // Find the user by email
    const user = await collection.findOne({ username: email });

    if (!user) {
      return new Response(
        JSON.stringify({ message: 'Invalid email or password', success: false }),
        { status: 401 }
      );
    }

    // Compare password hash
    const hashResult = await bcrypt.compare(pass, user.pass);

    if (!hashResult) {
      return new Response(
        JSON.stringify({ message: 'Invalid email or password', success: false }),
        { status: 401 }
      );
    }

    // Encrypt session data and set it
    const sessionData = { email: user.username, role: 'user' };
    const token = await encrypt(sessionData);

    // Create a response with token
    const response = NextResponse.json({
      message: 'Login successful',
      success: true,
      token,
    });

    // Set a cookie with session token
    response.cookies.set('session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'lax', // Ensure the cookie is sent with cross-site requests
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    // Return successful login response
    return response;
  } catch (error) {
    // Log any errors during the process
    console.error('Error during login:', error.message);

    // Return a 500 for internal server errors
    return new Response(
      JSON.stringify({ message: 'Internal server error', success: false }),
      { status: 500 }
    );
  } finally {
    // Ensure the database connection is closed
    await client.close();
  }
}
