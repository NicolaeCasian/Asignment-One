import { decrypt } from '../../../../utils/decrypt/route.js'; 
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = cookies();
    const sessionToken = cookieStore.get('session')?.value;

    if (!sessionToken) {
      return new Response(JSON.stringify({ loggedIn: false, error: 'No session found' }), {
        status: 401,
      });
    }

    const session = await decrypt(sessionToken);

    if (!session) {
      return new Response(JSON.stringify({ loggedIn: false, error: 'Invalid or expired session' }), {
        status: 401,
      });
    }

    return new Response(JSON.stringify({ loggedIn: true, session }), {
      status: 200,
    });
  } catch (error) {
    console.error('Error in /api/sessions:', error);
    return new Response(JSON.stringify({ loggedIn: false, error: 'Internal server error' }), {
      status: 500,
    });
  }
}

export async function DELETE() {
  try {
    const cookieStore = cookies();

    // Clear the session cookie
    cookieStore.delete('session');

    return new Response(JSON.stringify({ success: true, message: 'Session deleted' }), {
      status: 200,
    });
  } catch (error) {
    console.error('Error in DELETE /api/sessions:', error);
    return new Response(JSON.stringify({ success: false, error: 'Internal server error' }), {
      status: 500,
    });
  }
}
