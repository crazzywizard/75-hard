import { supabase } from '@/lib/supabase';
import { NextResponse, NextRequest } from 'next/server';
import { DayEntry } from '@/components/EntriesTable';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const participantId = searchParams.get('participant_id');

  let query = supabase.from('entries').select('*');
  
  // If participant_id is provided, filter by it. Otherwise, return all entries
  if (participantId) {
    query = query.eq('participant_id', participantId);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Transform data to ensure new fields have defaults if missing
  const transformedData = data?.map((entry: DayEntry) => ({
    ...entry,
    ate_out: entry.ate_out ?? false,
    eating_out_calories: entry.eating_out_calories ?? 0
  }));

  return NextResponse.json(transformedData);
}

export async function POST(request: Request) {
  const body = await request.json();

  if (!body.participant_id) {
    return NextResponse.json({ error: 'Participant ID is required in the body' }, { status: 400 });
  }

  // Ensure new fields have defaults
  const entryData = {
    ...body,
    ate_out: body.ate_out ?? false,
    eating_out_calories: body.eating_out_calories ?? 0
  };

  const { data, error } = await supabase.from('entries').insert([entryData]).select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function PUT(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const date = searchParams.get('date');
  const participantId = searchParams.get('participant_id');

  if (!date || !participantId) {
    return NextResponse.json({ error: 'Date and Participant ID are required' }, { status: 400 });
  }

  const body = await request.json();

  const { data, error } = await supabase
    .from('entries')
    .update(body)
    .eq('date', date)
    .eq('participant_id', participantId)
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const date = searchParams.get('date');
  const participantId = searchParams.get('participant_id');

  if (!date || !participantId) {
    return NextResponse.json({ error: 'Date and Participant ID are required' }, { status: 400 });
  }

  const { error } = await supabase
    .from('entries')
    .delete()
    .eq('date', date)
    .eq('participant_id', participantId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return new Response(null, { status: 204 });
}
