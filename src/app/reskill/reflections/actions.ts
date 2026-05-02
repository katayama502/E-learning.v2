'use server';

import { createAdminClient } from '@/utils/supabase/admin';

const db = () => createAdminClient();

export type Mood = 'great' | 'good' | 'neutral' | 'tough' | 'hard';

export interface Reflection {
    id: string;
    user_id: string;
    title: string;
    content: string;
    mood: Mood;
    practice_date: string;
    created_at: string;
    updated_at: string;
    profile?: { full_name: string; email: string };
    comments?: ReflectionComment[];
    comment_count?: number;
}

export interface ReflectionComment {
    id: string;
    reflection_id: string;
    user_id: string;
    content: string;
    created_at: string;
    profile?: { full_name: string; email: string; user_type: string };
}

// ── 生徒: 自分の振り返り一覧 ──────────────────────────────
export async function getMyReflectionsAction(userId: string): Promise<{
    success: boolean;
    data: Reflection[];
    error?: string;
}> {
    try {
        const { data, error } = await db()
            .from('club_reflections')
            .select(`
                *,
                club_reflection_comments ( id )
            `)
            .eq('user_id', userId)
            .order('practice_date', { ascending: false });

        if (error) throw error;

        const reflections: Reflection[] = (data ?? []).map((r: any) => ({
            ...r,
            comment_count: r.club_reflection_comments?.length ?? 0,
        }));

        return { success: true, data: reflections };
    } catch (e: any) {
        return { success: false, data: [], error: e.message };
    }
}

// ── 生徒: 振り返り詳細（コメント付き）────────────────────
export async function getReflectionDetailAction(id: string): Promise<{
    success: boolean;
    data: Reflection | null;
    error?: string;
}> {
    try {
        const { data, error } = await db()
            .from('club_reflections')
            .select(`
                *,
                club_reflection_comments (
                    *,
                    profile:profiles ( full_name, email, user_type )
                )
            `)
            .eq('id', id)
            .single();

        if (error) throw error;

        const reflection: Reflection = {
            ...data,
            comments: (data.club_reflection_comments ?? []).map((c: any) => ({
                ...c,
                profile: c.profile,
            })),
        };

        return { success: true, data: reflection };
    } catch (e: any) {
        return { success: false, data: null, error: e.message };
    }
}

// ── 生徒: 振り返りを投稿 ─────────────────────────────────
export async function createReflectionAction(params: {
    userId: string;
    title: string;
    content: string;
    mood: Mood;
    practiceDate: string;
}): Promise<{ success: boolean; id?: string; error?: string }> {
    try {
        const { data, error } = await db()
            .from('club_reflections')
            .insert({
                user_id: params.userId,
                title: params.title,
                content: params.content,
                mood: params.mood,
                practice_date: params.practiceDate,
            })
            .select('id')
            .single();

        if (error) throw error;
        return { success: true, id: data.id };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

// ── 生徒: 振り返りを削除 ─────────────────────────────────
export async function deleteReflectionAction(id: string, userId: string): Promise<{
    success: boolean;
    error?: string;
}> {
    try {
        const { error } = await db()
            .from('club_reflections')
            .delete()
            .eq('id', id)
            .eq('user_id', userId); // 本人のみ削除可

        if (error) throw error;
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

// ── 管理者: 全件一覧（ユーザー情報付き）─────────────────
export async function getAllReflectionsAction(params?: {
    userId?: string;
    limit?: number;
}): Promise<{ success: boolean; data: Reflection[]; error?: string }> {
    try {
        let query = db()
            .from('club_reflections')
            .select(`
                *,
                profile:profiles ( full_name, email ),
                club_reflection_comments ( id )
            `)
            .order('practice_date', { ascending: false })
            .order('created_at', { ascending: false });

        if (params?.userId) {
            query = query.eq('user_id', params.userId);
        }
        if (params?.limit) {
            query = query.limit(params.limit);
        }

        const { data, error } = await query;
        if (error) throw error;

        const reflections: Reflection[] = (data ?? []).map((r: any) => ({
            ...r,
            profile: r.profile,
            comment_count: r.club_reflection_comments?.length ?? 0,
        }));

        return { success: true, data: reflections };
    } catch (e: any) {
        return { success: false, data: [], error: e.message };
    }
}

// ── 管理者: コメントを追加 ───────────────────────────────
export async function addCommentAction(params: {
    reflectionId: string;
    userId: string;  // 管理者のユーザーID
    content: string;
}): Promise<{ success: boolean; error?: string }> {
    try {
        const { error } = await db()
            .from('club_reflection_comments')
            .insert({
                reflection_id: params.reflectionId,
                user_id: params.userId,
                content: params.content,
            });

        if (error) throw error;
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

// ── 管理者: コメントを削除 ───────────────────────────────
export async function deleteCommentAction(commentId: string): Promise<{
    success: boolean;
    error?: string;
}> {
    try {
        const { error } = await db()
            .from('club_reflection_comments')
            .delete()
            .eq('id', commentId);

        if (error) throw error;
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}
