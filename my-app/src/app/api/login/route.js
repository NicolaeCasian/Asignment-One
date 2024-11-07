import { MongoClient } from 'mongodb';


const uri = 'mongodb+srv://nicolae:nico123@krispykreme.yky54.mongodb.net/?retryWrites=true&w=majority&appName=KrispyKreme';
const client = new MongoClient(uri);

export async function GET(req) {
  console.log("in the api page");

  // Extract email and password 
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');
  const pass = searchParams.get('pass');

  console.log("Email:", email);
  console.log("Password:", pass);

  try {
    // Connecting to MongoDB Atlas
    await client.connect();
    console.log('Connected successfully to MongoDB Atlas');

    
    const db = client.db('Krispy_Kreme_Ltd'); 
    const collection = db.collection('Customers'); 

    // Finds user
    const findResult = await collection.find({ username: email }).toArray();
    console.log('Found documents =>', findResult);

    let valid = false;
    if (findResult.length > 0 && findResult[0].pass === pass) {
      valid = true;
      console.log("login valid");
    } else {
      console.log("login invalid");
    }

    // Return the validation result
    return new Response(JSON.stringify({ data: valid }), { status: 200 });
  } catch (error) {
    console.error("Error connecting to MongoDB Atlas:", error);
    return new Response(JSON.stringify({ error: "Database connection error" }), { status: 500 });
  } finally {
    // End
    await client.close();
  }
}
