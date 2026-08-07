import mongoose, { Schema, Document } from 'mongoose';

export interface IUserModel extends Document {
  name: string;
  email: string;
  password?: string;
  role: 'candidate' | 'recruiter' | 'admin';
  address?: string;
  phone?: string;
  bio?: string;
  skills?: string[];
  avatar?: string;
}

const UserSchema = new Schema<IUserModel>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['candidate', 'recruiter', 'admin'], default: 'candidate' },
  address: { type: String, default: '' },
  phone: { type: String, default: '' },
  bio: { type: String, default: '' },
  skills: [String],
  avatar: { type: String, default: '' },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model<IUserModel>('User', UserSchema);
