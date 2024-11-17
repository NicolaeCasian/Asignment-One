import { MongoClient, ObjectId } from 'mongodb';

const uri = 'mongodb+srv://nicolae:nico123@krispykreme.yky54.mongodb.net/?retryWrites=true&w=majority&appName=KrispyKreme';
const client = new MongoClient(uri);

export async function GET(req) {
  try {
    // Connect to MongoDB
    await client.connect();
    const db = client.db('Krispy_Kreme_Ltd');
    const collection = db.collection('cart');

    // Retrieve all items from the collection
    const findResult = await collection.find({}).toArray();
    console.log("Found documents =>", findResult);

    // Return the retrieved items as JSON
    return new Response(JSON.stringify(findResult), { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: "Failed to retrieve items" }), { status: 500 });
  } finally {
    // Ensure the client is closed after the operation
    await client.close();
  }
}

export async function POST(req) {
  try {
    // Parse the request body
    const { type, pname, price } = await req.json();

    // Connect to MongoDB
    await client.connect();
    const db = client.db('Krispy_Kreme_Ltd');
    const collection = db.collection('cart');

    // Insert the item into the collection
    await collection.insertOne({ type, pname, price });
    console.log("Order added successfully to cart");

    // Return success response
    return new Response(JSON.stringify({ message: "Order added successfully" }), { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: "Failed to add item" }), { status: 500 });
  } finally {
    // Ensure the client is closed after the operation
    await client.close();
  }
}

export async function DELETE(req) {
  try {
    // Parse the request body to get the item ID
    const { id } = await req.json();

    // Connect to MongoDB
    await client.connect();
    const db = client.db('Krispy_Kreme_Ltd');
    const collection = db.collection('cart');

    // Delete the item with the specified ID
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 1) {
      console.log("Item deleted successfully");
      return new Response(JSON.stringify({ message: "Item deleted successfully" }), { status: 200 });
    } else {
      console.log("Item not found");
      return new Response(JSON.stringify({ error: "Item not found" }), { status: 404 });
    }
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: "Failed to delete item" }), { status: 500 });
  } finally {
    // Ensure the client is closed after the operation
    await client.close();
  }
}
