import { createCommandCenterClient } from './supabase/client';
import type { RealtimeChannel } from '@supabase/supabase-js';

export interface Message {
    id: string;
    sender_id: string;
    recipient_id: string;
    content: string;
    read_at: string | null;
    created_at: string;
}

const supabase = createCommandCenterClient();

export async function getMessages(userId: string): Promise<Message[]> {
    const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
        .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
}

export async function sendMessage(
    recipientId: string,
    content: string
): Promise<Message> {
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
        .from('messages')
        .insert({
            sender_id: user.id,
            recipient_id: recipientId,
            content,
        })
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function markAsRead(messageId: string): Promise<void> {
    const { error } = await supabase
        .from('messages')
        .update({ read_at: new Date().toISOString() })
        .eq('id', messageId);

    if (error) throw error;
}

export async function getUnreadCount(userId: string): Promise<number> {
    const { count, error } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('recipient_id', userId)
        .is('read_at', null);

    if (error) throw error;
    return count || 0;
}

export function subscribeToMessages(
    userId: string,
    callback: (message: Message) => void
): RealtimeChannel {
    return supabase
        .channel('messages')
        .on(
            'postgres_changes',
            {
                event: 'INSERT',
                schema: 'public',
                table: 'messages',
                filter: `recipient_id=eq.${userId}`,
            },
            (payload: any) => {
                callback(payload.new as Message);
            }
        )
        .subscribe();
}
