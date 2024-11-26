import { MongoClient } from 'mongodb';

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

export async function DELETE(req) {
  try {
    await client.connect();
    const db = client.db('Krispy_Kreme_Ltd');
    const collection = db.collection('cart');

    //Delete all Documents within the cart
    const deleteResult = await collection.deleteMany({});
    console.log(`Deleted ${deleteResult.deletedCount} items from cart`);

    //Returns a success response and status 
    return new Response(JSON.stringify({ success: true, message: 'Cart cleared successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    //Returns a failure response and status
    console.error('Error clearing cart:', error);
    return new Response(JSON.stringify({ error: 'Failed to clear cart' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  } finally {
    await client.close();
  }
}
