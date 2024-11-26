import { MongoClient } from 'mongodb';

export async function GET(req) {
  try {
    const uri = process.env.MONGO_URI;
    const client = new MongoClient(uri);
    const dbName = 'Krispy_Kreme_Ltd';

    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db(dbName);
    //Finds the order Data in the data collection and gets put into an Array
    const orders = await db.collection('orders').find({}).toArray();

    // Log the fetched orders for debugging
    console.log('Fetched orders from database:', orders);

    // Normalize totalPrice from String to Number on All orders
    const normalizedOrders = orders.map((order) => ({
      ...order,
      totalPrice: typeof order.totalPrice === 'string' 
        ? parseFloat(order.totalPrice) 
        : order.totalPrice,
    }));

    await client.close();

    // If no orders are found, return an empty array
    if (!normalizedOrders || normalizedOrders.length === 0) {
      return new Response(JSON.stringify([]), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Return the normalized orders
    return new Response(JSON.stringify(normalizedOrders), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch orders' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
