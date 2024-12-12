import { MongoClient } from 'mongodb';

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');
  const pass = searchParams.get('pass');
  
  console.log("Received Registration Data:", { username: email, pass });

  const bcrypt = require('bcrypt');

  const saltRounds = 10;

   const hash = bcrypt.hashSync(pass, saltRounds);

  // Connect to Database
  await client.connect();
  const db = client.db('Krispy_Kreme_Ltd');
  const collection = db.collection('Customers');

  // Check if the user already exists
  const existingUser = await collection.findOne({ username: email });
  if (existingUser) {
    return new Response(JSON.stringify({ data: "User already exists" }), { status: 409 });
  }

  // Inserting new user
  await collection.insertOne({ username: email, pass : hash });
  console.log("User registered successfully");

  await client.close();

  return new Response(JSON.stringify({ data: "valid" }), { status: 200 });
}