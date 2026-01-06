// js/online/actions.js
import { supabase } from './supabase.js';
import { applyAction } from '../game/actions.js';
import { myColor } from './rooms.js';
import { render } from '../game/renderer.js';
import { showToast } from '../ui/toast.js';

let channel = null;

function handleRemoteAction(action) {
    const result = applyAction(action);

    render();
    window.updateTurnUI();

    if (result?.gameOver) {
        showToast(`${result.winner.toUpperCase()} WINS!`);
    }
}

// Listen for actions sent by the other player
export function subscribeToActions(roomId) {
    channel = supabase
        .channel(`room-${roomId}`)
        .on(
            'postgres_changes',
            {
                event: 'INSERT',
                schema: 'public',
                table: 'actions',
                filter: `room_id=eq.${roomId}`
            },
            payload => {
                const row = payload.new;

                if (row.player === myColor) return;
                            
                const action = {
                    type: row.type,
                    player: row.player,
                    ...row.payload
                };
                
                handleRemoteAction(action);
            }
        )
        .subscribe();
}

//  Send an action to Supabase
export async function sendAction(roomId, action) {
    await supabase.from('actions').insert({
        room_id: roomId,
        player: action.player,
        type: action.type,
        payload: {
            piece: action.piece,
            from: action.from,
            to: action.to
        }
    });
}
