import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    const token = request.cookies.get('auth_token')?.value;
    const userId = request.cookies.get('user_id')?.value;
    if (!token || !userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const response = await fetch(`${API_URL}/v1/users/${userId}/intents`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Update intents error:', error);

    // Development: Return mock updated intents if API gateway is unavailable
    if (process.env.NODE_ENV === 'development') {
      const body = await request.json().catch(() => ({}));

      return NextResponse.json({
        intents: body.intents || ['Build something', 'Learn a skill'],
        message: '[DEV MODE] Mock intents updated - API gateway unavailable',
      });
    }

    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 },
    );
  }
}
