import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(request: NextRequest, { params }: { params: { date: string } }) {
  const date = params.date;
  const participantId = request.nextUrl.searchParams.get('participant_id');

  if (!participantId) {
    return NextResponse.json({ error: 'Participant ID is required' }, { status: 400 });
  }

  const body = await request.json();

  const { noSugar, noEatingOut, caloriesBurned, participantName, ...rest } = body;

  const entryData: { [key: string]: string | number | boolean | undefined } = { ...rest };
  if (noSugar !== undefined) entryData.no_sugar = noSugar;
  if (noEatingOut !== undefined) entryData.no_eating_out = noEatingOut;
  if (caloriesBurned !== undefined) entryData.calories_burned = caloriesBurned;
  if (participantName !== undefined) entryData.participant_name = participantName;

  const { data, error } = await supabase
    .from('entries')
    .update(entryData)
    .eq('date', date)
    .eq('participant_id', participantId)
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function DELETE(request: NextRequest, { params }: { params: { date: string } }) {
  const date = params.date;
  const participantId = request.nextUrl.searchParams.get('participant_id');

  if (!participantId) {
    return NextResponse.json({ error: 'Participant ID is required' }, { status: 400 });
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
