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

export async function GET(request, { params }) {
  try {
    const resolvedParams = await params;
    const { baseUrl, apiKey } = getApiConfig();
    const slug = Array.isArray(resolvedParams?.slug) ? resolvedParams.slug : [];
    const targetPath = slug.join('/');

    // console.log('Proxying request to report API:', baseUrl, targetPath, request.nextUrl.searchParams.toString());

    if (!targetPath) {
      return NextResponse.json({ error: 'Missing report endpoint' }, { status: 400 });
    }

    const upstreamUrl = new URL(`${baseUrl.replace(/\/$/, '')}/${targetPath}`);
    request.nextUrl.searchParams.forEach((value, key) => {
      upstreamUrl.searchParams.set(key, value);
    });

    const upstreamResponse = await fetch(upstreamUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ApiKey: apiKey,
        'App-Language': 'en',
      },
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
    console.error('Report proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch report data' },
      { status: 500 }
    );
  }
}
