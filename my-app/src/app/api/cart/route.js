import { MongoClient, ObjectId } from 'mongodb';

const uri = 'mongodb+srv://nicolae:nico123@krispykreme.yky54.mongodb.net/?retryWrites=true&w=majority&appName=KrispyKreme';
const client = new MongoClient(uri);



//This Get Function works with the Add to Cart button by inserting the Item to the Database
export async function GET(req) {
  try {
    
    const { searchParams } = new URL(req.url); 
    const pname = searchParams.get('pname');
    const type = searchParams.get('type'); 
    const price = searchParams.get('price'); 

    // Connect to Database
    await client.connect();
    console.log('Connected successfully to server');

    const db = client.db('Krispy_Kreme_Ltd'); 
    const collection = db.collection('cart'); 

    // Insert the item into the collection
    const myobj = { type, pname, username: "sample@test.com", price };
    const insertResult = await collection.insertOne(myobj);
    console.log("Insert result:", insertResult);

    
    return new Response(JSON.stringify({ data: "Item Added to Cart" }), { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: "Item not Added to Cart" }), { status: 500 });
  } finally {
    
    await client.close();
  }
}


//This function Delete function works with the Delete button in the Shopping Cart Page
export async function DELETE(req) {
  try {
    // Parse the request body to get the item ID
    const { id } = await req.json();

    // Connect to Database
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
    await client.close();
  }
}
