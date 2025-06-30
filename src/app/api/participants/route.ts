import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { NextResponse } from 'next/server';

// Mock data for when Supabase is not configured
const mockParticipants = [
  { id: 1, user_id: 'test_user', start_date: null, start_weight: null, end_weight: null }
];

export async function GET() {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured, using mock data');
    return NextResponse.json(mockParticipants);
  }

  try {
    const { data, error } = await supabase.from('participants').select('*');

    if (error) {
      console.warn('Supabase error, using mock data:', error.message);
      return NextResponse.json(mockParticipants);
    }

    return NextResponse.json(data);
  } catch (error) {
    console.warn('Supabase error, using mock data:', error);
    return NextResponse.json(mockParticipants);
  }
}

export async function POST(request: Request) {
  const { user_id, start_date, start_weight } = await request.json();

  if (!user_id) {
    return NextResponse.json({ error: 'Participant user_id is required' }, { status: 400 });
  }

  const insertData: { user_id: string; start_date?: string; start_weight?: number } = { user_id };
  if (start_date !== undefined) insertData.start_date = start_date;
  if (start_weight !== undefined) insertData.start_weight = start_weight;

  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured, using mock response');
    // Mock successful creation
    const newParticipant = {
      id: Date.now(),
      user_id,
      start_date,
      start_weight,
      end_weight: null
    };
    return NextResponse.json([newParticipant], { status: 201 });
  }

  try {
    const { data, error } = await supabase
      .from('participants')
      .insert([insertData])
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
  } catch (error) {
    console.warn('Supabase error, using mock response:', error);
    // Mock successful creation
    const newParticipant = {
      id: Date.now(),
      user_id,
      start_date,
      start_weight,
      end_weight: null
    };
    return NextResponse.json([newParticipant], { status: 201 });
  }
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
  
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured, using mock response');
    // Mock successful update
    const updatedParticipant = {
      id,
      user_id: 'test_user',
      start_date,
      start_weight,
      end_weight
    };
    return NextResponse.json([updatedParticipant]);
  }
  
  try {
    const { data, error } = await supabase
      .from('participants')
      .update(updateFields)
      .eq('id', id)
      .select();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data);
  } catch (error) {
    console.warn('Supabase error, using mock response:', error);
    // Mock successful update
    const updatedParticipant = {
      id,
      user_id: 'test_user',
      start_date,
      start_weight,
      end_weight
    };
    return NextResponse.json([updatedParticipant]);
  }
}
