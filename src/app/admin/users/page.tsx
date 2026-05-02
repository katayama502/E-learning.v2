'use client';

import React, { useState, useEffect, useTransition } from 'react';
import {
    Users, Plus, Search, Trash2, ShieldCheck, ShieldOff,
    Loader2, X, Eye, EyeOff, AlertTriangle, RefreshCw,
    Crown, UserCircle, Mail, Calendar, KeyRound
} from 'lucide-react';
import { toast } from 'sonner';
import {
    listUsersAction,
    createUserAction,
    updateUserRoleAction,
    deleteUserAction,
    resetPasswordAction,
    ManagedUser,
} from './actions';

// ---- Create User Modal ----
function CreateUserModal({
    isOpen,
    onClose,
    onCreated,
}: {
    isOpen: boolean;
    onClose: () => void;
    onCreated: () => void;
}) {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [role, setRole] = useState<'user' | 'admin'>('user');
    const [isPending, startTransition] = useTransition();

    const reset = () => {
        setFullName(''); setEmail(''); setPassword('');
        setRole('user'); setShowPassword(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!fullName || !email || !password) return;

        startTransition(async () => {
            const result = await createUserAction({ email, password, fullName, role });
            if (result.success) {
                toast.success('アカウントを作成しました');
                reset();
                onCreated();
                onClose();
            } else {
                toast.error(`作成失敗: ${result.error}`);
            }
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                        <Plus size={20} className="text-orange-500" /> アカウント追加
                    </h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="text-xs font-black text-slate-600 block mb-1">名前</label>
                        <input
                            type="text" required value={fullName}
                            onChange={e => setFullName(e.target.value)}
                            placeholder="山田 太郎"
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/10"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-black text-slate-600 block mb-1">メールアドレス</label>
                        <input
                            type="email" required value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="user@example.com"
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/10"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-black text-slate-600 block mb-1">初期パスワード</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'} required value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="8文字以上"
                                minLength={8}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/10 pr-12"
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-black text-slate-600 block mb-2">権限</label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setRole('user')}
                                className={`flex items-center gap-3 p-4 rounded-xl border-2 font-bold text-sm transition-all ${role === 'user'
                                    ? 'border-orange-400 bg-orange-50 text-orange-600'
                                    : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}
                            >
                                <UserCircle size={20} className={role === 'user' ? 'text-orange-400' : 'text-slate-400'} />
                                <div className="text-left">
                                    <p className="font-black text-xs">ユーザー</p>
                                    <p className="text-[10px] opacity-70 font-bold">学習のみ</p>
                                </div>
                            </button>
                            <button
                                type="button"
                                onClick={() => setRole('admin')}
                                className={`flex items-center gap-3 p-4 rounded-xl border-2 font-bold text-sm transition-all ${role === 'admin'
                                    ? 'border-red-500 bg-red-50 text-red-700'
                                    : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}
                            >
                                <Crown size={20} className={role === 'admin' ? 'text-red-500' : 'text-slate-400'} />
                                <div className="text-left">
                                    <p className="font-black text-xs">管理者</p>
                                    <p className="text-[10px] opacity-70 font-bold">全権限</p>
                                </div>
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit" disabled={isPending}
                        className="w-full py-3 bg-orange-500 text-white font-black rounded-xl hover:bg-orange-600 disabled:opacity-60 transition-all flex items-center justify-center gap-2 mt-2"
                    >
                        {isPending ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
                        アカウントを作成する
                    </button>
                </form>
            </div>
        </div>
    );
}

// ---- Delete Confirm Modal ----
function DeleteConfirmModal({
    user, onClose, onDeleted,
}: {
    user: ManagedUser | null;
    onClose: () => void;
    onDeleted: () => void;
}) {
    const [isPending, startTransition] = useTransition();

    const handleDelete = () => {
        if (!user) return;
        startTransition(async () => {
            const result = await deleteUserAction(user.id);
            if (result.success) {
                toast.success('アカウントを削除しました');
                onDeleted();
                onClose();
            } else {
                toast.error(`削除失敗: ${result.error}`);
            }
        });
    };

    if (!user) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6 text-center" onClick={e => e.stopPropagation()}>
                <div className="w-14 h-14 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle size={28} />
                </div>
                <h3 className="text-lg font-black text-slate-900 mb-1">アカウントを削除しますか？</h3>
                <p className="text-sm text-slate-500 font-bold mb-2">
                    「{user.full_name || user.email}」のアカウントを完全に削除します。
                </p>
                <p className="text-xs text-red-500 font-bold mb-6">この操作は取り消せません</p>
                <div className="flex gap-3">
                    <button onClick={onClose} className="flex-1 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-all">
                        キャンセル
                    </button>
                    <button onClick={handleDelete} disabled={isPending}
                        className="flex-1 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 disabled:opacity-60 transition-all flex items-center justify-center gap-2">
                        {isPending ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                        削除する
                    </button>
                </div>
            </div>
        </div>
    );
}

// ---- Main Page ----
export default function AdminUsersPage() {
    const [users, setUsers] = useState<ManagedUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [deletingUser, setDeletingUser] = useState<ManagedUser | null>(null);
    const [, startTransition] = useTransition();

    const loadUsers = async () => {
        setIsLoading(true);
        const result = await listUsersAction();
        if (result.success) {
            setUsers(result.data);
        } else {
            toast.error('ユーザー一覧の取得に失敗しました');
        }
        setIsLoading(false);
    };

    useEffect(() => { loadUsers(); }, []);

    const handleRoleToggle = (user: ManagedUser) => {
        const newRole = user.user_type === 'admin' ? 'user' : 'admin';
        const label = newRole === 'admin' ? '管理者' : 'ユーザー';

        startTransition(async () => {
            const result = await updateUserRoleAction({ userId: user.id, role: newRole });
            if (result.success) {
                toast.success(`${user.full_name || user.email} を ${label} に変更しました`);
                setUsers(prev => prev.map(u =>
                    u.id === user.id
                        ? { ...u, user_type: newRole === 'admin' ? 'admin' : 'student' }
                        : u
                ));
            } else {
                toast.error(`更新失敗: ${result.error}`);
            }
        });
    };

    const handleResetPassword = (user: ManagedUser) => {
        startTransition(async () => {
            const result = await resetPasswordAction(user.email);
            if (result.success) {
                toast.success(`${user.email} にパスワードリセットリンクを送信しました`);
            } else {
                toast.error(`送信失敗: ${result.error}`);
            }
        });
    };

    const filtered = users.filter(u =>
        (u.full_name || '').toLowerCase().includes(search.toLowerCase()) ||
        (u.email || '').toLowerCase().includes(search.toLowerCase())
    );

    const adminCount = users.filter(u => u.user_type === 'admin').length;
    const userCount = users.filter(u => u.user_type !== 'admin').length;

    return (
        <div className="space-y-6 pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <Users className="text-orange-500" size={32} />
                        アカウント管理
                    </h1>
                    <p className="text-slate-500 font-bold mt-1">ユーザーアカウントの発行・権限管理を行います</p>
                </div>
                <button
                    onClick={() => setIsCreateOpen(true)}
                    className="flex items-center gap-2 bg-orange-500 text-white px-5 py-3 rounded-xl font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-100"
                >
                    <Plus size={20} /> アカウント追加
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                {[
                    { label: '総アカウント', value: users.length, color: 'text-slate-900', bg: 'bg-white border-slate-200', icon: <Users size={20} className="text-slate-400" /> },
                    { label: '管理者', value: adminCount, color: 'text-red-600', bg: 'bg-red-50 border-red-100', icon: <Crown size={20} className="text-red-400" /> },
                    { label: 'ユーザー', value: userCount, color: 'text-orange-500', bg: 'bg-orange-50 border-orange-50', icon: <UserCircle size={20} className="text-orange-300" /> },
                ].map(stat => (
                    <div key={stat.label} className={`${stat.bg} border rounded-2xl p-5 flex items-center gap-4`}>
                        {stat.icon}
                        <div>
                            <p className="text-xs font-black text-slate-500">{stat.label}</p>
                            <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Search & Refresh */}
            <div className="flex items-center gap-3">
                <div className="flex-1 relative">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text" value={search} onChange={e => setSearch(e.target.value)}
                        placeholder="名前・メールアドレスで検索..."
                        className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/10"
                    />
                </div>
                <button onClick={loadUsers} className="p-3 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-all">
                    <RefreshCw size={18} />
                </button>
            </div>

            {/* User Table */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                {isLoading ? (
                    <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
                        <Loader2 size={32} className="animate-spin" />
                        <p className="font-bold text-sm">読み込み中...</p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="py-20 text-center">
                        <Users size={40} className="text-slate-200 mx-auto mb-3" />
                        <p className="text-slate-400 font-bold">{search ? '検索結果がありません' : 'アカウントがありません'}</p>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider">ユーザー</th>
                                <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider hidden md:table-cell">メール</th>
                                <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider">権限</th>
                                <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider hidden lg:table-cell">作成日</th>
                                <th className="px-6 py-4 text-right text-xs font-black text-slate-500 uppercase tracking-wider">操作</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filtered.map(user => {
                                const isAdmin = user.user_type === 'admin';
                                return (
                                    <tr key={user.id} className="hover:bg-slate-50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-black shrink-0 ${isAdmin ? 'bg-red-100 text-red-600' : 'bg-orange-50 text-orange-500'}`}>
                                                    {(user.full_name || user.email || '?')[0].toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-black text-slate-800 text-sm leading-none mb-0.5">
                                                        {user.full_name || '名前未設定'}
                                                    </p>
                                                    <p className="text-xs text-slate-400 font-bold md:hidden">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 hidden md:table-cell">
                                            <span className="text-sm font-bold text-slate-600 flex items-center gap-2">
                                                <Mail size={14} className="text-slate-300" />
                                                {user.email}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black ${isAdmin
                                                ? 'bg-red-100 text-red-700 border border-red-200'
                                                : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>
                                                {isAdmin ? <Crown size={12} /> : <UserCircle size={12} />}
                                                {isAdmin ? '管理者' : 'ユーザー'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 hidden lg:table-cell">
                                            <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                                                <Calendar size={12} />
                                                {user.created_at
                                                    ? new Date(user.created_at).toLocaleDateString('ja-JP')
                                                    : '-'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {/* Role toggle */}
                                                <button
                                                    onClick={() => handleRoleToggle(user)}
                                                    title={isAdmin ? '一般ユーザーに変更' : '管理者に変更'}
                                                    className={`p-2 rounded-lg transition-all ${isAdmin
                                                        ? 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                                                        : 'text-slate-400 hover:text-red-600 hover:bg-red-50'}`}
                                                >
                                                    {isAdmin ? <ShieldOff size={16} /> : <ShieldCheck size={16} />}
                                                </button>
                                                {/* Password reset */}
                                                <button
                                                    onClick={() => handleResetPassword(user)}
                                                    title="パスワードリセットメールを送信"
                                                    className="p-2 rounded-lg text-slate-400 hover:text-orange-500 hover:bg-orange-50 transition-all"
                                                >
                                                    <KeyRound size={16} />
                                                </button>
                                                {/* Delete */}
                                                <button
                                                    onClick={() => setDeletingUser(user)}
                                                    title="削除"
                                                    className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Modals */}
            <CreateUserModal
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                onCreated={loadUsers}
            />
            <DeleteConfirmModal
                user={deletingUser}
                onClose={() => setDeletingUser(null)}
                onDeleted={loadUsers}
            />
        </div>
    );
}
