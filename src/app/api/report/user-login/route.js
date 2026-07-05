import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

function getApiConfig() {
  const baseUrl = process.env.REPORT_API_BASE_URL || process.env.NEXT_PUBLIC_REPORT_API_BASE_URL;
  const apiKey = process.env.REPORT_API_KEY;

  if (!baseUrl || !apiKey) {
    throw new Error('Missing report API configuration');
  }

  return { baseUrl, apiKey };
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { baseUrl, apiKey } = getApiConfig();
    const upstreamUrl = new URL(`${baseUrl.replace(/\/$/, '')}/user-login`);

    const upstreamResponse = await fetch(upstreamUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ApiKey: apiKey,
        'App-Language': 'en',
      },
      body: JSON.stringify(body),
    });

    const contentType = upstreamResponse.headers.get('content-type') || 'application/json';
    const responseBody = await upstreamResponse.text();

    return new NextResponse(responseBody, {
      status: upstreamResponse.status,
      headers: {
        'content-type': contentType,
      },
    });
  } catch (error) {
    console.error('User-login proxy error:', error);
    return NextResponse.json({ error: 'Failed to login user' }, { status: 500 });
  }
}
