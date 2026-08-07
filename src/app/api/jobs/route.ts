import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Job from '@/models/Job';

export const dynamic = 'force-dynamic';

// GET /api/jobs - Fetch all jobs from MongoDB Atlas
export async function GET() {
  try {
    await dbConnect();
    const jobs = await Job.find({}).sort({ createdAt: -1 });
    const formattedJobs = jobs.map(j => ({
      id: j._id.toString(),
      recruiterId: j.recruiterId,
      title: j.title,
      company: j.company,
      companyLogo: j.companyLogo || 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?auto=format&fit=crop&q=80&w=200',
      location: j.location,
      type: j.type,
      salaryRange: j.salaryRange,
      expRequired: j.expRequired,
      description: j.description,
      requirements: j.requirements || [],
      skillsRequired: j.skillsRequired || [],
      status: j.status,
      postedAt: j.postedAt,
      applicantCount: j.applicantCount || 0,
    }));
    return NextResponse.json(formattedJobs);
  } catch (error: any) {
    console.error('Jobs GET API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/jobs - Save new job post to MongoDB Atlas
export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();

    const newJob = await Job.create({
      recruiterId: body.recruiterId || 'rec_1',
      title: body.title,
      company: body.company,
      companyLogo: body.companyLogo || 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?auto=format&fit=crop&q=80&w=200',
      location: body.location,
      type: body.type,
      salaryRange: body.salaryRange,
      expRequired: body.expRequired,
      description: body.description,
      requirements: body.requirements || [],
      skillsRequired: body.skillsRequired || [],
      status: body.status || 'pending',
      postedAt: 'Just now',
      applicantCount: 0,
    });

    const jobObj = {
      id: newJob._id.toString(),
      recruiterId: newJob.recruiterId,
      title: newJob.title,
      company: newJob.company,
      companyLogo: newJob.companyLogo,
      location: newJob.location,
      type: newJob.type,
      salaryRange: newJob.salaryRange,
      expRequired: newJob.expRequired,
      description: newJob.description,
      requirements: newJob.requirements,
      skillsRequired: newJob.skillsRequired,
      status: newJob.status,
      postedAt: newJob.postedAt,
      applicantCount: newJob.applicantCount,
    };

    return NextResponse.json({ success: true, job: jobObj }, { status: 201 });
  } catch (error: any) {
    console.error('Jobs POST API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
