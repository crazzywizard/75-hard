import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function PUT(request: Request, { params }: { params: { date: string } }) {
  const { date } = params;
  const body = await request.json();

  const { data, error } = await supabase.from('entries').update(body).eq('date', date).select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function DELETE(request: Request, { params }: { params: { date: string } }) {
  const { date } = params;

  const { error } = await supabase.from('entries').delete().eq('date', date);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return new Response(null, { status: 204 });
}
