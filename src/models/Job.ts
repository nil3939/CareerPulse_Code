import mongoose, { Schema, Document } from 'mongoose';

export interface IJobModel extends Document {
  recruiterId: string;
  title: string;
  company: string;
  companyLogo: string;
  location: string;
  type: string;
  salaryRange: string;
  expRequired: string;
  description: string;
  requirements: string[];
  skillsRequired: string[];
  status: string;
  postedAt: string;
  applicantCount: number;
}

const JobSchema = new Schema<IJobModel>({
  recruiterId: { type: String, required: true },
  title: { type: String, required: true },
  company: { type: String, required: true },
  companyLogo: { type: String, default: '' },
  location: { type: String, required: true },
  type: { type: String, required: true },
  salaryRange: { type: String, required: true },
  expRequired: { type: String, required: true },
  description: { type: String, required: true },
  requirements: [String],
  skillsRequired: [String],
  status: { type: String, default: 'pending' },
  postedAt: { type: String, default: 'Just now' },
  applicantCount: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.Job || mongoose.model<IJobModel>('Job', JobSchema);
