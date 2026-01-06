// js/online/rooms.js
import { supabase } from './supabase.js';

export let currentRoom = null;
export let myPlayerId = null;
export let myColor = null;

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

    myPlayerId = crypto.randomUUID();
    currentRoom = data;
    myColor = 'white'; // host is white

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

    myPlayerId = crypto.randomUUID();
    currentRoom = data;
    myColor = 'black'; // joiner is black

    return data;
}
