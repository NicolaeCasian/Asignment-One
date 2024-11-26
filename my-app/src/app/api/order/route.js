import { MongoClient } from 'mongodb';
import { cookies } from 'next/headers';
import { decrypt } from '../../../../utils/decrypt/route';
import nodemailer from 'nodemailer';

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

export async function GET(req) {
  try {
    const cookieStore = cookies();
    const sessionToken = cookieStore.get('session')?.value;
    //Checks for sessions
    if (!sessionToken) {
      return new Response(JSON.stringify({ error: 'No session found' }), { status: 401 });
    }

    const session = await decrypt(sessionToken);

    if (!session) {
      return new Response(JSON.stringify({ error: 'Invalid session' }), { status: 401 });
    }

    const { email } = session;

    const url = new URL(req.url);
    //Gets all of the items from the cart
    const items = url.searchParams.getAll('items[]').map((item) => JSON.parse(item));
    const totalPrice = url.searchParams.get('totalPrice');
    //If the amount of items does not corelate with the Total price show respones message
    if (!items.length || !totalPrice) {
      return new Response(JSON.stringify({ error: 'Invalid order data' }), { status: 400 });
    }

    await client.connect();
    const db = client.db('Krispy_Kreme_Ltd');

    // Save order to the orders collection
    const orderResult = await db.collection('orders').insertOne({
      email,
      items,
      totalPrice,
      orderDate: new Date(),
    });

    if (!orderResult.acknowledged) {
      return new Response(JSON.stringify({ error: 'Failed to save order' }), { status: 500 });
    }

    // Clear the user's cart
    const deleteResult = await db.collection('cart').deleteMany({ username: email });
    console.log(`Deleted ${deleteResult.deletedCount} items from cart for user: ${email}`);

    // Send confirmation email and creates transporter constant to send the email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      //Auth details
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    const orderDetails = items
      .map((item) => `${item.quantity}x ${item.pname} (€${item.price} each)`)
      .join('\n');
      //Text to show in the email
    const emailText = `
            Hello,

            Thank you for your order!

            Order Details:
            ${orderDetails}

            Total Price: €${totalPrice}

            Best regards,
            Krispy Kreme Team
            `;
    //Sends email text to the user who is logged in 
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: email,
      subject: 'Your Order Confirmation',
      text: emailText,
    });

    console.log('Order email sent to:', email);
    //Show Succsefull reposponse
    return new Response(
      JSON.stringify({ success: true, message: 'Order placed successfully and cart cleared.' }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing order:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process order' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  } finally {
    await client.close();
  }
}
