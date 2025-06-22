import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET() {
  const { data, error } = await supabase.from('participants').select('*');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const { user_id } = await request.json();

  if (!user_id) {
    return NextResponse.json({ error: 'Participant user_id is required' }, { status: 400 });
  }

  const { data, error } = await supabase.from('participants').insert([{ user_id }]).select();

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json(
        { error: 'A participant with this user_id already exists.' },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
