import mongoose, { Schema, Document } from 'mongoose';

export interface IApplicationModel extends Document {
  jobId: string;
  jobTitle: string;
  company: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone?: string;
  candidateAddress?: string;
  candidateSkills?: string[];
  stage: 'Applied' | 'Screening' | 'Interview Scheduled' | 'Shortlisted' | 'Offered' | 'Rejected';
  atsMatchScore: number;
  quizScore?: number;
  coverLetter?: string;
  resumeFileName?: string;
  resumeText?: string;
  appliedAt: string;
}

const ApplicationSchema = new Schema<IApplicationModel>({
  jobId: { type: String, required: true },
  jobTitle: { type: String, required: true },
  company: { type: String, required: true },
  candidateId: { type: String, required: true },
  candidateName: { type: String, required: true },
  candidateEmail: { type: String, required: true },
  candidatePhone: { type: String, default: '' },
  candidateAddress: { type: String, default: '' },
  candidateSkills: [String],
  stage: { type: String, default: 'Applied' },
  atsMatchScore: { type: Number, default: 0 },
  quizScore: { type: Number, default: 0 },
  coverLetter: { type: String, default: '' },
  resumeFileName: { type: String, default: '' },
  resumeText: { type: String, default: '' },
  appliedAt: { type: String, default: 'Just now' },
}, { timestamps: true });

export default mongoose.models.Application || mongoose.model<IApplicationModel>('Application', ApplicationSchema);
