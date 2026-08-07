import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    // Find user in MongoDB Atlas
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user || user.password !== password) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    const userObj = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    };

    return NextResponse.json({ success: true, user: userObj });
  } catch (error: any) {
    console.error('Login API Error:', error);
    return NextResponse.json({ error: error.message || 'Server error during login.' }, { status: 500 });
  }
}
