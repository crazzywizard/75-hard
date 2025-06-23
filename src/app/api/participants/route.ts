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
  const { user_id, start_date } = await request.json();

  if (!user_id) {
    return NextResponse.json({ error: 'Participant user_id is required' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('participants')
    .insert([{ user_id, start_date }])
    .select();

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

export async function PATCH(request: Request) {
  const { id, start_date, start_weight, end_weight } = await request.json();
  if (!id) {
    return NextResponse.json({ error: 'Participant id is required' }, { status: 400 });
  }
  const updateFields: Record<string, unknown> = {};
  if (start_date !== undefined) updateFields.start_date = start_date;
  if (start_weight !== undefined) updateFields.start_weight = start_weight;
  if (end_weight !== undefined) updateFields.end_weight = end_weight;
  if (Object.keys(updateFields).length === 0) {
    return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
  }
  const { data, error } = await supabase
    .from('participants')
    .update(updateFields)
    .eq('id', id)
    .select();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}
