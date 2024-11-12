import { MongoClient } from 'mongodb';

const uri = 'mongodb+srv://nicolae:nico123@krispykreme.yky54.mongodb.net/?retryWrites=true&w=majority&appName=KrispyKreme';
const client = new MongoClient(uri);

export async function GET(req) {
  try {
    // Connect to MongoDB
    await client.connect();
    const db = client.db('Krispy_Kreme_Ltd');
    const collection = db.collection('cart');

    // Parse query parameters from the URL
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const pname = searchParams.get('pname');
    const price = searchParams.get('price');

    let response;

    if (type && pname && price) {
      // If type, pname, and price are provided, insert the data
      await collection.insertOne({ type, pname, price });
      console.log("Order added successfully to cart");
      response = { message: "Order added successfully" };
    } else {
      // Otherwise, retrieve all items from the collection
      const findResult = await collection.find({}).toArray();
      console.log("Found documents =>", findResult);
      response = findResult;
    }

    // Return the response as JSON
    return new Response(JSON.stringify(response), { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: "Failed to handle request" }), { status: 500 });
  } finally {
    // Ensure the client is closed after the operation
    await client.close();
  }
}
