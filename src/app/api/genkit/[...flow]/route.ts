import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: "Genkit AI features are temporarily disabled." });
}

export async function POST() {
  return NextResponse.json({ message: "Genkit AI features are temporarily disabled." });
}