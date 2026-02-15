import { createCommandCenterClient } from '../supabase/client';

export interface SkillResult<T = any> {
    success: boolean;
    data?: T;
    error?: string;
}

/**
 * Execute a skill via the edge function
 */
export async function executeSkill<T = any>(
    skillName: string,
    input: any
): Promise<T> {
    const supabase = createCommandCenterClient();

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Not authenticated');

    const response = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/execute-skill`,
        {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${session.access_token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ skillName, input }),
        }
    );

    const result = await response.json();
    if (!result.success) throw new Error(result.error);

    return result.data;
}
