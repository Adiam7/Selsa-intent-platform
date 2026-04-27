import { NextRequest, NextResponse } from 'next/server';

const API_URL = (process.env.API_GATEWAY_URL || 'http://localhost:3001').replace(/\/$/, '');

async function parseResponse(response: Response): Promise<unknown> {
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return response.json();
  }

  const text = await response.text();
  return {
    message: text ? 'Upstream service returned a non-JSON response' : 'Upstream service returned an empty response',
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await fetch(`${API_URL}/v1/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await parseResponse(response) as Record<string, string>;

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    // Set auth cookie with the access token
    const res = NextResponse.json(data);
    res.cookies.set('auth_token', data.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60, // 24 hours
    });
    res.cookies.set('user_id', data.userId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60,
    });

    return res;
  } catch (error) {
    console.error('Register error:', error);

    // Try to get the body for mock auth in development
    let body: Record<string, string> = {};
    try {
      body = await request.json();
    } catch {
      // Body already read or invalid, use defaults
    }

    // Development: Return mock auth response if API gateway is unavailable
    if (process.env.NODE_ENV === 'development') {
      const email = (body.email as string) || 'user@example.com';
      const userId = 'mock-user-' + Math.random().toString(36).substr(2, 9);
      const mockToken = Buffer.from(
        JSON.stringify({ userId, email, iat: Date.now() })
      ).toString('base64');

      const res = NextResponse.json({
        accessToken: mockToken,
        userId,
        email,
        message: '[DEV MODE] Mock authentication - API gateway unavailable',
      });

      res.cookies.set('auth_token', mockToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 24 * 60 * 60,
      });
      res.cookies.set('user_id', userId, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 24 * 60 * 60,
      });

      return res;
    }

    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
