import { MongoClient } from 'mongodb';
import { encrypt } from '../../../../utils/encrypt/route';
import { NextResponse } from 'next/server';

const uri = process.env.MONGO_URI; 
const client = new MongoClient(uri);

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');
  const pass = searchParams.get('pass');
//If no email and pass input show required message
  if (!email || !pass) {
    return new Response(
      JSON.stringify({ message: 'Email and password are required', success: false }),
      { status: 400 }
    );
  }

  try {
    await client.connect();
    const db = client.db('Krispy_Kreme_Ltd'); // Replace with your actual DB name
    const collection = db.collection('Customers'); // Replace with your actual collection name

    const user = await collection.findOne({ username: email });
    //If user and pass invalid show message
    if (!user || user.pass !== pass) {
      return new Response(
        JSON.stringify({ message: 'Invalid email or password', success: false }),
        { status: 401 }
      );
    }
    //encrypt session Data and sets it
    const sessionData = { email: user.username, role: 'user' };
    const token = await encrypt(sessionData);

    //Creates a Response with token
    const response = NextResponse.json({
      message: 'Login successful',
      success: true,
      token,
    });

    //Set a cookie with session token
    response.cookies.set('session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'lax', // Ensure the cookie is sent with cross-site requests
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });
    //Return suscesfull login response
    return response;
  } catch (error) {
    //Log any errors during the process
    console.error('Error during login:', error.message);
    //Return a 500 for internal server errors
    return new Response(
      JSON.stringify({ message: 'Internal server error', success: false }),
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
