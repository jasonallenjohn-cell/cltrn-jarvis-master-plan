import { createCommandCenterClient } from './supabase/client';

export interface Document {
    id: string;
    title: string;
    type: string;
    file_url: string;
    shared_with: string[];
    created_by: string;
    created_at: string;
    status: 'active' | 'archived' | 'deleted';
}

const supabase = createCommandCenterClient();

export async function getSharedDocuments(userId: string): Promise<Document[]> {
    const { data, error } = await supabase
        .from('documents')
        .select('*')
        .contains('shared_with', [userId])
        .eq('status', 'active')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
}

export async function downloadDocument(fileUrl: string) {
    const fileName = fileUrl.split('/').pop() || 'document';
    const { data, error } = await supabase.storage
        .from('documents')
        .download(fileName);

    if (error) throw error;
    return data;
}

export async function getDocumentUrl(fileUrl: string): Promise<string> {
    const fileName = fileUrl.split('/').pop() || 'document';
    const { data } = await supabase.storage
        .from('documents')
        .createSignedUrl(fileName, 3600); // 1 hour expiry

    return data?.signedUrl || '';
}
