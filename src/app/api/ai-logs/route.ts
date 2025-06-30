import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import AiLog from '@/models/AiLog';

export async function POST(req: Request) {
  try {
    await clientPromise;
    const { prompt, response } = await req.json();

    const newLog = new AiLog({ prompt, response });
    await newLog.save();

    return NextResponse.json({ message: 'Log saved successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error saving AI log:', error);
    return NextResponse.json({ message: 'Error saving AI log' }, { status: 500 });
  }
}

export async function GET() {
  try {
    await clientPromise;
    const logs = await AiLog.find({});
    return NextResponse.json(logs, { status: 200 });
  } catch (error) {
    console.error('Error fetching AI logs:', error);
    return NextResponse.json({ message: 'Error fetching AI logs' }, { status: 500 });
  }
}
