import mongoose, { Schema, Document } from 'mongoose';

export interface IMessageModel extends Document {
  senderId: string;
  receiverId: string;
  senderRole: 'candidate' | 'recruiter' | 'admin';
  senderName: string;
  text: string;
  fileUrl?: string;
  calendarLink?: string;
  read: boolean;
  createdAt: string;
}

const MessageSchema = new Schema<IMessageModel>({
  senderId: { type: String, required: true },
  receiverId: { type: String, required: true },
  senderRole: { type: String, enum: ['candidate', 'recruiter', 'admin'], required: true },
  senderName: { type: String, required: true },
  text: { type: String, required: true },
  fileUrl: { type: String, default: '' },
  calendarLink: { type: String, default: '' },
  read: { type: Boolean, default: false },
  createdAt: { type: String, default: () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
}, { timestamps: true });

export default mongoose.models.Message || mongoose.model<IMessageModel>('Message', MessageSchema);
