import { supabase } from '@/lib/supabase';
import { NextResponse, NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const participantId = searchParams.get('participant_id');

  if (!participantId) {
    return NextResponse.json({ error: 'Participant ID is required' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('entries')
    .select('*')
    .eq('participant_id', participantId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Transform data to ensure new fields have defaults if missing
  const transformedData = data?.map((entry: any) => ({
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

  // Validate eating out rule if provided
  if (body.ate_out && body.eating_out_calories && body.eating_out_calories >= 500) {
    return NextResponse.json({ 
      error: 'If eating out, calories must be less than 500' 
    }, { status: 400 });
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

  // Validate eating out rule if being updated
  if (body.ate_out !== undefined || body.eating_out_calories !== undefined) {
    // Get current entry to check combined rule
    const { data: currentEntry } = await supabase
      .from('entries')
      .select('ate_out, eating_out_calories')
      .eq('date', date)
      .eq('participant_id', participantId)
      .single();

    const newAteOut = body.ate_out !== undefined ? body.ate_out : currentEntry?.ate_out;
    const newCalories = body.eating_out_calories !== undefined ? body.eating_out_calories : currentEntry?.eating_out_calories;

    if (newAteOut && newCalories && newCalories >= 500) {
      return NextResponse.json({ 
        error: 'If eating out, calories must be less than 500' 
      }, { status: 400 });
    }
  }

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
