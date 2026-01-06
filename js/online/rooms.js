import { supabase } from './supabase.js';

function generateRoomCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += chars[Math.floor(Math.random() * chars.length)];
    }
    return code;
}

export async function createRoom() {
    const code = generateRoomCode();

    const { data, error } = await supabase
        .from('rooms')
        .insert({ code })
        .select()
        .single();

    if (error) throw error;
    
    return data;
}

export async function joinRoom(code) {
    const { data, error } = await supabase
    .from('rooms')
    .select('*')
    .eq('code', code)
    .single();
    
    if (error) throw error;
    await supabase
      .from('rooms')
      .update({ status: 'active' })
      .eq('id', data.id);

    return data;
}
