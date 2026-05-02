'use server';

import { createAdminClient } from '@/utils/supabase/admin';

const getAdmin = () => createAdminClient();

export type UserRole = 'admin' | 'user';

export interface ManagedUser {
    id: string;
    email: string;
    full_name: string;
    user_type: string | null;
    created_at: string;
    last_sign_in_at?: string;
}

/** 全ユーザー一覧を取得（profiles テーブル） */
export async function listUsersAction(): Promise<{ success: boolean; data: ManagedUser[]; error?: string }> {
    try {
        const admin = getAdmin();
        const { data, error } = await admin
            .from('profiles')
            .select('id, email, full_name, user_type, created_at')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return { success: true, data: (data ?? []) as ManagedUser[] };
    } catch (e: any) {
        console.error('listUsersAction error:', e);
        return { success: false, data: [], error: e.message };
    }
}

/** 新規アカウントを作成 (Supabase Auth + profiles) */
export async function createUserAction(params: {
    email: string;
    password: string;
    fullName: string;
    role: UserRole;
}): Promise<{ success: boolean; error?: string }> {
    try {
        const admin = getAdmin();

        // 1. Supabase Auth でユーザー作成（メール確認スキップ）
        const { data: authData, error: authError } = await admin.auth.admin.createUser({
            email: params.email,
            password: params.password,
            email_confirm: true,
        });

        if (authError) throw authError;
        const userId = authData.user.id;

        // 2. profiles テーブルに挿入
        const { error: profileError } = await admin.from('profiles').upsert({
            id: userId,
            email: params.email,
            full_name: params.fullName,
            user_type: params.role === 'admin' ? 'admin' : 'student',
            created_at: new Date().toISOString(),
        });

        if (profileError) {
            // Auth ユーザー作成済みのためロールバック
            await admin.auth.admin.deleteUser(userId).catch(() => {});
            throw profileError;
        }

        return { success: true };
    } catch (e: any) {
        console.error('createUserAction error:', e);
        return { success: false, error: e.message };
    }
}

/** ユーザーのロールを変更 */
export async function updateUserRoleAction(params: {
    userId: string;
    role: UserRole;
}): Promise<{ success: boolean; error?: string }> {
    try {
        const admin = getAdmin();
        const { error } = await admin
            .from('profiles')
            .update({ user_type: params.role === 'admin' ? 'admin' : 'student' })
            .eq('id', params.userId);

        if (error) throw error;
        return { success: true };
    } catch (e: any) {
        console.error('updateUserRoleAction error:', e);
        return { success: false, error: e.message };
    }
}

/** ユーザーを削除（Auth + profile） */
export async function deleteUserAction(userId: string): Promise<{ success: boolean; error?: string }> {
    try {
        const admin = getAdmin();

        // Auth ユーザー削除（cascade で profile も消える場合あり）
        const { error: authError } = await admin.auth.admin.deleteUser(userId);
        if (authError) throw authError;

        // profiles も念のため削除
        await admin.from('profiles').delete().eq('id', userId).catch(() => {});

        return { success: true };
    } catch (e: any) {
        console.error('deleteUserAction error:', e);
        return { success: false, error: e.message };
    }
}

/** パスワードリセットメールを送信 */
export async function resetPasswordAction(email: string): Promise<{ success: boolean; error?: string }> {
    try {
        const admin = getAdmin();
        const { error } = await admin.auth.admin.generateLink({
            type: 'recovery',
            email,
        });

        if (error) throw error;
        return { success: true };
    } catch (e: any) {
        console.error('resetPasswordAction error:', e);
        return { success: false, error: e.message };
    }
}
