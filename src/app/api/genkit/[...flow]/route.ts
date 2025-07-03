// Temporary content for diagnosing the route signature issue
import { type NextRequest, NextResponse } from 'next/server';

// Using 'any' for the context type as a temporary diagnostic measure
export async function GET(
  request: NextRequest,
  context: any
): Promise<NextResponse> {
  const flow = context && context.params && Array.isArray(context.params.flow)
               ? context.params.flow
               : ['error_unknown_flow_shape'];
  return NextResponse.json({
    message: 'Test handler for [...flow]',
    flow: flow,
    url: request.url,
  });
}

export async function POST(
  request: NextRequest,
  context: any
): Promise<NextResponse> {
  const flow = context && context.params && Array.isArray(context.params.flow)
               ? context.params.flow
               : ['error_unknown_flow_shape'];
  const body = await request.json().catch(() => ({}));
  return NextResponse.json({
    message: 'Test POST handler for [...flow]',
    flow: flow,
    url: request.url,
    receivedBody: body,
  });
}

export async function PUT(request: NextRequest, context: any): Promise<NextResponse> {
    const flow = context && context.params && Array.isArray(context.params.flow) ? context.params.flow : [];
    const body = await request.json().catch(() => ({}));
    return NextResponse.json({ message: 'Test PUT', flow, body });
}
export async function DELETE(request: NextRequest, context: any): Promise<NextResponse> {
    const flow = context && context.params && Array.isArray(context.params.flow) ? context.params.flow : [];
    return NextResponse.json({ message: 'Test DELETE', flow });
}
export async function PATCH(request: NextRequest, context: any): Promise<NextResponse> {
    const flow = context && context.params && Array.isArray(context.params.flow) ? context.params.flow : [];
    const body = await request.json().catch(() => ({}));
    return NextResponse.json({ message: 'Test PATCH', flow, body });
}
export async function HEAD(request: NextRequest, context: any): Promise<NextResponse> {
    return new NextResponse(null, { status: 200 });
}
export async function OPTIONS(request: NextRequest, context: any): Promise<NextResponse> {
    return new NextResponse(null, { status: 204, headers: { 'Allow': 'GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS' } });
}