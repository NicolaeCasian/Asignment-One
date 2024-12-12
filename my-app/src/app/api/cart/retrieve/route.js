import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

export async function GET(req) {
  try {
    // Connect to Database
    await client.connect();
    console.log('Connected successfully to server');

    const db = client.db('Krispy_Kreme_Ltd'); 
    const collection = db.collection('cart'); 

    // Retrieve all items from the collection for display
    const findResult = await collection.find({}).toArray();
    console.log("Retrieved items:", findResult);

    // Return the Items
    return new Response(JSON.stringify(findResult), { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: "Failed to retrieve items" }), { status: 500 });
  } finally {
    await client.close();
  }
}