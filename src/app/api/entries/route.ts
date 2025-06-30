import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { NextResponse, NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const participantId = searchParams.get('participant_id');

  if (!participantId) {
    return NextResponse.json({ error: 'Participant ID is required' }, { status: 400 });
  }

  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured, returning empty entries');
    return NextResponse.json([]);
  }

  try {
    const { data, error } = await supabase
      .from('entries')
      .select('*')
      .eq('participant_id', participantId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.warn('Supabase error, returning empty entries:', error);
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  const body = await request.json();

  if (!body.participant_id) {
    return NextResponse.json({ error: 'Participant ID is required in the body' }, { status: 400 });
  }

  const { data, error } = await supabase.from('entries').insert([body]).select();

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
