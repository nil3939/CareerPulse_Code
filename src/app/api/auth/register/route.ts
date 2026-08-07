import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { name, email, password, role } = body;

    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Name, email, and password are required.' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json({ error: 'User with this email already exists.' }, { status: 400 });
    }

    // Create user in MongoDB Atlas
    const newUser = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: role || 'candidate',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=ef4444&color=fff`,
    });

    const userObj = {
      id: newUser._id.toString(),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      avatar: newUser.avatar,
    };

    return NextResponse.json({ success: true, user: userObj }, { status: 201 });
  } catch (error: any) {
    console.error('Registration API Error:', error);
    return NextResponse.json({ error: error.message || 'Server error during registration.' }, { status: 500 });
  }
}
