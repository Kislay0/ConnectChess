// js/online/actions.js
import { supabase } from './supabase.js';
import { applyAction } from '../game/actions.js';
import { myColor } from './rooms.js';
import { render } from '../game/renderer.js';
import { showToast } from '../ui/toast.js';
import { gameOver } from '../game/state.js';

let channel = null;

function handleRemoteAction(action) {
    if (action.type === 'rematch-request') {
        if (action.player !== myColor) {
            document.getElementById('rematch-popup').classList.remove('hidden');
        }
        return;
    }

    if (action.type === 'rematch-accept') {
        window.dispatchEvent(new Event('rematch-accepted'));
        return;
    }

    if (action.type === 'rematch-reject') {
        showToast("Rematch declined");
        leaveOnlineGame();
        return;
    }
    
    if (gameOver) return;
    const result = applyAction(action);

    render();
    window.updateTurnUI();

    window.handleGameOver(result);
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

                if (
                    (row.type === 'move' || row.type === 'place') &&
                    row.player === myColor
                ) return;
                            
                const action = {
                    type: row.type,
                    player: row.player,
                    ...row.payload
                };
                console.log(
                    '[REALTIME RECEIVED]',
                    'type:', action.type,
                    'player:', action.player,
                    'me:', myColor
                );
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
