import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function GET(request: NextRequest) {
  try {
    const query = request.nextUrl.searchParams.toString();
    const response = await fetch(`${API_URL}/v1/listings${query ? `?${query}` : ''}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await response.json();
    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('List listings error:', error);

    // Development: Return mock listings if API gateway is unavailable
    if (process.env.NODE_ENV === 'development') {
      return NextResponse.json({
        listings: [
          {
            id: 'mock-listing-1',
            title: '[DEV] Example Listing 1',
            description: 'Mock listing for development',
            user_id: 'mock-user-123',
            intent: 'Build something',
            created_at: new Date().toISOString(),
          },
          {
            id: 'mock-listing-2',
            title: '[DEV] Example Listing 2',
            description: 'Another mock listing',
            user_id: 'mock-user-456',
            intent: 'Learn a skill',
            created_at: new Date().toISOString(),
          },
        ],
        message: '[DEV MODE] Mock data - API gateway unavailable',
      });
    }

    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Get auth token from cookie
    const token = request.cookies.get('auth_token')?.value;
    const userId = request.cookies.get('user_id')?.value;
    if (!token) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const response = await fetch(`${API_URL}/v1/listings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...(userId ? { 'x-user-id': userId } : {}),
      },
      body: JSON.stringify({ ...body, user_id: userId }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Create listing error:', error);

    // Development: Return mock created listing if API gateway is unavailable
    if (process.env.NODE_ENV === 'development') {
      const body = await request.json().catch(() => ({}));
      const userId = request.cookies.get('user_id')?.value || 'mock-user-123';
      const listingId = 'mock-listing-' + Math.random().toString(36).substr(2, 9);

      return NextResponse.json({
        id: listingId,
        title: body.title || '[DEV] New Listing',
        description: body.description || 'Mock listing created in development',
        user_id: userId,
        intent: body.intent || 'Build something',
        created_at: new Date().toISOString(),
        message: '[DEV MODE] Mock listing created - API gateway unavailable',
      });
    }

    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
