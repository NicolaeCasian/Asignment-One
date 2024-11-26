import { MongoClient } from 'mongodb';

const uri = 'mongodb+srv://nicolae:nico123@krispykreme.yky54.mongodb.net/?retryWrites=true&w=majority&appName=KrispyKreme';
const client = new MongoClient(uri);

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    const pass = searchParams.get('pass');
    

    console.log("Received Registration Data:", { username: email, pass});

    // Connect to Database
    await client.connect();
    const db = client.db('Krispy_Kreme_Ltd');
    const collection = db.collection('Customers');

    // Check if the user already exists
    const existingUser = await collection.findOne({username: email });
    if (existingUser) {
      return new Response(JSON.stringify({ data: "User already exists" }), { status: 409 });
    }

    // Inserting new user
    await collection.insertOne({ username: email, pass });
    console.log("User registered successfully");
    return new Response(JSON.stringify({ data: "valid" }), { status: 200 });
    
  } catch (error) {
    console.error("Error during registration:", error);
    return new Response(JSON.stringify({ error: "Database error" }), { status: 500 });
  } finally {
    await client.close();
  }

  
}
