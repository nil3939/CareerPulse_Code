import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Application from '@/models/Application';

export const dynamic = 'force-dynamic';

// GET /api/applications - Fetch all applications from MongoDB Atlas
export async function GET() {
  try {
    await dbConnect();
    const apps = await Application.find({}).sort({ createdAt: -1 });
    const formatted = apps.map(a => ({
      id: a._id.toString(),
      jobId: a.jobId,
      jobTitle: a.jobTitle,
      company: a.company,
      candidateId: a.candidateId,
      candidateName: a.candidateName,
      candidateEmail: a.candidateEmail,
      candidatePhone: a.candidatePhone,
      candidateAddress: a.candidateAddress,
      candidateSkills: a.candidateSkills || [],
      stage: a.stage,
      atsMatchScore: a.atsMatchScore,
      quizScore: a.quizScore || 0,
      coverLetter: a.coverLetter,
      resumeFileName: a.resumeFileName,
      resumeText: a.resumeText,
      appliedAt: a.appliedAt,
    }));
    return NextResponse.json(formatted);
  } catch (error: any) {
    console.error('Applications GET API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/applications - Save job application & resume analysis to MongoDB Atlas
export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();

    const newApp = await Application.create({
      jobId: body.jobId,
      jobTitle: body.jobTitle,
      company: body.company,
      candidateId: body.candidateId || 'cand_1',
      candidateName: body.candidateName,
      candidateEmail: body.candidateEmail,
      candidatePhone: body.candidatePhone || '',
      candidateAddress: body.candidateAddress || '',
      candidateSkills: body.candidateSkills || [],
      stage: 'Applied',
      atsMatchScore: body.atsMatchScore || 0,
      quizScore: body.quizScore || 0,
      coverLetter: body.coverLetter || '',
      resumeFileName: body.resumeFileName || '',
      resumeText: body.resumeText || '',
      appliedAt: 'Just now',
    });

    const appObj = {
      id: newApp._id.toString(),
      jobId: newApp.jobId,
      jobTitle: newApp.jobTitle,
      company: newApp.company,
      candidateId: newApp.candidateId,
      candidateName: newApp.candidateName,
      candidateEmail: newApp.candidateEmail,
      candidatePhone: newApp.candidatePhone,
      candidateAddress: newApp.candidateAddress,
      candidateSkills: newApp.candidateSkills,
      stage: newApp.stage,
      atsMatchScore: newApp.atsMatchScore,
      quizScore: newApp.quizScore,
      coverLetter: newApp.coverLetter,
      resumeFileName: newApp.resumeFileName,
      resumeText: newApp.resumeText,
      appliedAt: newApp.appliedAt,
    };

    return NextResponse.json({ success: true, application: appObj }, { status: 201 });
  } catch (error: any) {
    console.error('Applications POST API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
