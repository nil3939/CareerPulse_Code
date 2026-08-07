import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Message from '@/models/Message';

export const dynamic = 'force-dynamic';

// GET /api/messages - Fetch direct messages from MongoDB Atlas
export async function GET() {
  try {
    await dbConnect();
    const msgs = await Message.find({}).sort({ createdAt: 1 });
    const formatted = msgs.map(m => ({
      id: m._id.toString(),
      senderId: m.senderId,
      receiverId: m.receiverId,
      senderRole: m.senderRole,
      senderName: m.senderName,
      text: m.text,
      fileUrl: m.fileUrl,
      calendarLink: m.calendarLink,
      read: m.read,
      createdAt: m.createdAt,
    }));
    return NextResponse.json(formatted);
  } catch (error: any) {
    console.error('Messages GET API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/messages - Save candidate or recruiter direct message to MongoDB Atlas
export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();

    const newMsg = await Message.create({
      senderId: body.senderId,
      receiverId: body.receiverId,
      senderRole: body.senderRole,
      senderName: body.senderName,
      text: body.text,
      fileUrl: body.fileUrl || '',
      calendarLink: body.calendarLink || '',
      read: false,
    });

    const msgObj = {
      id: newMsg._id.toString(),
      senderId: newMsg.senderId,
      receiverId: newMsg.receiverId,
      senderRole: newMsg.senderRole,
      senderName: newMsg.senderName,
      text: newMsg.text,
      fileUrl: newMsg.fileUrl,
      calendarLink: newMsg.calendarLink,
      read: newMsg.read,
      createdAt: newMsg.createdAt,
    };

    return NextResponse.json({ success: true, message: msgObj }, { status: 201 });
  } catch (error: any) {
    console.error('Messages POST API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
