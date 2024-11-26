import { MongoClient } from 'mongodb';
import { encrypt } from '../../../../utils/encrypt/route';
import { NextResponse } from 'next/server';

const uri = process.env.MONGO_URI; 
const client = new MongoClient(uri);

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');
  const pass = searchParams.get('pass');
    
  if (!email || !pass) {
    return new Response(
      JSON.stringify({ message: 'Email and password are required', success: false }),
      { status: 400 }
    );
  }

  try {
    await client.connect();
    const db = client.db('Krispy_Kreme_Ltd'); 
    const collection = db.collection('manager'); //manager colection

    const user = await collection.findOne({ username: email });
    if (!user || user.pass !== pass) {
      return new Response(
        JSON.stringify({ message: 'Invalid email or password', success: false }),
        { status: 401 }
      );
    }

    const sessionData = { email: user.username, role: 'user' };
    const token = await encrypt(sessionData);

    const response = NextResponse.json({
      message: 'Login successful',
      success: true,
      token,
    });

    response.cookies.set('session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      //Redirects to the Dashboard
      path: '/dashboard',
      sameSite: 'lax', 
      maxAge: 7 * 24 * 60 * 60, 
    });

    return response;
  } catch (error) {
    console.error('Error during login:', error.message);
    return new Response(
      JSON.stringify({ message: 'Internal server error', success: false }),
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
