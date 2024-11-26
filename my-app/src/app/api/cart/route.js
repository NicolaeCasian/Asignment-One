import { MongoClient, ObjectId } from 'mongodb';

const uri = 'mongodb+srv://nicolae:nico123@krispykreme.yky54.mongodb.net/?retryWrites=true&w=majority&appName=KrispyKreme';
const client = new MongoClient(uri);



//This Get Function works with the Add to Cart button by inserting the Item to the Database
export async function GET(req) {
  try {
    //Search Parameters to get from Product
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

    //Return Item Added to cart response and message
    return new Response(JSON.stringify({ data: "Item Added to Cart" }), { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    //Return Item not Added to cart response and message
    return new Response(JSON.stringify({ error: "Item not Added to Cart" }), { status: 500 });
  } finally {
    
    await client.close();
  }
}


//This function Delete function works with the Delete button in the Shopping Cart Page
export async function DELETE(req) {
  try {
    const { id, username } = await req.json();

    await client.connect();
    const db = client.db('Krispy_Kreme_Ltd');
    const collection = db.collection('cart');
      //if there is a username aka session
    if (username) {
      // Clear all items for the user
      const result = await collection.deleteMany({ username });
      return new Response(
        JSON.stringify({ message: `Deleted ${result.deletedCount} items for user: ${username}` }),
        { status: 200 }
      );
    } else if (id) {
      // Delete a single item by ID
      const result = await collection.deleteOne({ _id: new ObjectId(id) });
      if (result.deletedCount === 1) {
        return new Response(JSON.stringify({ message: 'Item deleted successfully' }), { status: 200 });
      } else {
        return new Response(JSON.stringify({ error: 'Item not found' }), { status: 404 });
      }
    } else {
      return new Response(JSON.stringify({ error: 'Invalid request' }), { status: 400 });
    }
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete items' }), { status: 500 });
  } finally {
    await client.close();
  }
}