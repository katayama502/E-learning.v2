'use client';

import React, { useState, useEffect, useTransition, useRef } from 'react';
import { useAppStore } from '@/lib/appStore';
import {
    BookHeart, Search, MessageCircle, Send, Loader2,
    ChevronDown, ChevronUp, Calendar, Users, RefreshCw,
    Trash2, Filter, MessageSquarePlus
} from 'lucide-react';
import { toast } from 'sonner';
import {
    getAllReflectionsAction,
    getReflectionDetailAction,
    addCommentAction,
    deleteCommentAction,
    Reflection, Mood,
} from '@/app/reskill/reflections/actions';

// ── Mood 設定 ────────────────────────────────────────────
const MOODS: Record<Mood, { emoji: string; label: string; color: string }> = {
    great:   { emoji: '🔥', label: '最高！',       color: 'bg-orange-100 text-orange-600' },
    good:    { emoji: '😊', label: '良かった',     color: 'bg-emerald-100 text-emerald-600' },
    neutral: { emoji: '😐', label: 'まあまあ',     color: 'bg-slate-100 text-slate-600' },
    tough:   { emoji: '😓', label: 'きつかった',   color: 'bg-amber-100 text-amber-600' },
    hard:    { emoji: '😣', label: 'しんどかった', color: 'bg-red-100 text-red-600' },
};

// ── コメントフォーム ─────────────────────────────────────
function CommentForm({ reflectionId, adminUserId, onSubmitted }: {
    reflectionId: string;
    adminUserId: string;
    onSubmitted: () => void;
}) {
    const [text, setText] = useState('');
    const [isPending, startTransition] = useTransition();
    const textRef = useRef<HTMLTextAreaElement>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim()) return;

        startTransition(async () => {
            const result = await addCommentAction({
                reflectionId,
                userId: adminUserId,
                content: text.trim(),
            });

            if (result.success) {
                toast.success('コメントを送信しました');
                setText('');
                onSubmitted();
            } else {
                toast.error(`送信失敗: ${result.error}`);
            }
        });
    };

    return (
        <form onSubmit={handleSubmit} className="mt-4">
            <div className="relative">
                <textarea
                    ref={textRef}
                    value={text}
                    onChange={e => setText(e.target.value)}
                    placeholder="生徒へのフィードバックを入力..."
                    rows={3}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-medium text-slate-800 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/10 resize-none pr-14 text-sm leading-relaxed"
                    onKeyDown={e => {
                        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSubmit(e as any);
                    }}
                />
                <button
                    type="submit" disabled={isPending || !text.trim()}
                    className="absolute right-3 bottom-3 w-9 h-9 bg-orange-500 text-white rounded-xl flex items-center justify-center hover:bg-orange-600 disabled:opacity-40 transition-all shadow-md"
                >
                    {isPending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                </button>
            </div>
            <p className="text-[10px] text-slate-400 font-bold mt-1 ml-1">⌘/Ctrl + Enter で送信</p>
        </form>
    );
}

// ── 振り返りカード（管理者用）────────────────────────────
function AdminReflectionCard({ reflection, adminUserId }: {
    reflection: Reflection;
    adminUserId: string;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [detail, setDetail] = useState<Reflection | null>(null);
    const [isLoadingDetail, setIsLoadingDetail] = useState(false);
    const [, startTransition] = useTransition();

    const mood = MOODS[reflection.mood] ?? MOODS.good;

    const loadDetail = async () => {
        setIsLoadingDetail(true);
        const result = await getReflectionDetailAction(reflection.id);
        if (result.success && result.data) setDetail(result.data);
        setIsLoadingDetail(false);
    };

    const handleExpand = async () => {
        if (!isOpen && !detail) await loadDetail();
        setIsOpen(v => !v);
    };

    const handleDeleteComment = (commentId: string) => {
        if (!confirm('このコメントを削除しますか？')) return;
        startTransition(async () => {
            const result = await deleteCommentAction(commentId);
            if (result.success) {
                toast.success('コメントを削除しました');
                await loadDetail(); // reload
            } else {
                toast.error(`削除失敗: ${result.error}`);
            }
        });
    };

    const displayDate = new Date(reflection.practice_date + 'T00:00:00')
        .toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' });

    const hasNewComment = (reflection.comment_count ?? 0) === 0;

    return (
        <div className={`bg-white rounded-2xl border overflow-hidden transition-all hover:shadow-md ${hasNewComment ? 'border-slate-200' : 'border-orange-50'}`}>
            {/* Header */}
            <button className="w-full text-left p-5" onClick={handleExpand}>
                <div className="flex items-start gap-4">
                    {/* Mood */}
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl shrink-0 ${mood.color}`}>
                        {mood.emoji}
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                            {/* User */}
                            <span className="inline-flex items-center gap-1 text-xs font-black text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                                <Users size={10} />
                                {reflection.profile?.full_name ?? '不明'}
                            </span>
                            {/* Date */}
                            <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                                <Calendar size={10} /> {displayDate}
                            </span>
                            {/* Comment count */}
                            <span className={`inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full border ${(reflection.comment_count ?? 0) > 0
                                ? 'bg-orange-50 text-orange-500 border-orange-50'
                                : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
                                <MessageCircle size={10} />
                                {(reflection.comment_count ?? 0) > 0
                                    ? `コメント ${reflection.comment_count}件`
                                    : 'コメントなし'}
                            </span>
                        </div>
                        <h3 className="font-black text-slate-800">{reflection.title}</h3>
                        {!isOpen && (
                            <p className="text-sm text-slate-500 font-medium line-clamp-1 mt-0.5">{reflection.content}</p>
                        )}
                    </div>

                    <div className="text-slate-300 shrink-0">
                        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </div>
                </div>
            </button>

            {/* Expanded */}
            {isOpen && (
                <div className="border-t border-slate-100 p-5 space-y-5">
                    {isLoadingDetail ? (
                        <div className="flex justify-center py-4">
                            <Loader2 size={24} className="animate-spin text-slate-400" />
                        </div>
                    ) : (
                        <>
                            {/* Reflection content */}
                            <div className="bg-slate-50 rounded-2xl p-4">
                                <pre className="text-sm text-slate-700 font-medium whitespace-pre-wrap leading-relaxed">
                                    {detail?.content ?? reflection.content}
                                </pre>
                            </div>

                            {/* Existing comments */}
                            {(detail?.comments ?? []).length > 0 && (
                                <div className="space-y-3">
                                    <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                                        <MessageCircle size={12} /> コメント履歴
                                    </h4>
                                    {(detail?.comments ?? []).map(comment => (
                                        <div key={comment.id} className="group flex gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-indigo-600 flex items-center justify-center text-white text-xs font-black shrink-0">
                                                {(comment.profile?.full_name || '管')[0]}
                                            </div>
                                            <div className="flex-1 bg-orange-50 rounded-2xl rounded-tl-none px-4 py-3 border border-orange-50 relative">
                                                <div className="flex items-center justify-between mb-1">
                                                    <p className="text-[10px] font-black text-orange-500">
                                                        {comment.profile?.full_name ?? '管理者'} ・{' '}
                                                        {new Date(comment.created_at).toLocaleString('ja-JP', {
                                                            month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                                        })}
                                                    </p>
                                                    <button
                                                        onClick={() => handleDeleteComment(comment.id)}
                                                        className="text-slate-300 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 p-1 rounded"
                                                        title="コメントを削除"
                                                    >
                                                        <Trash2 size={12} />
                                                    </button>
                                                </div>
                                                <p className="text-sm text-slate-700 font-medium leading-relaxed">{comment.content}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Comment form */}
                            <div className="border-t border-slate-100 pt-4">
                                <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5 mb-3">
                                    <MessageSquarePlus size={12} /> フィードバックを送る
                                </h4>
                                <CommentForm
                                    reflectionId={reflection.id}
                                    adminUserId={adminUserId}
                                    onSubmitted={async () => {
                                        await loadDetail();
                                    }}
                                />
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

// ── メインページ ─────────────────────────────────────────
export default function AdminReflectionsPage() {
    const { currentUserId } = useAppStore();
    const [reflections, setReflections] = useState<Reflection[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterUser, setFilterUser] = useState<string>('');

    const load = async () => {
        setIsLoading(true);
        const result = await getAllReflectionsAction();
        if (result.success) setReflections(result.data);
        else toast.error('読み込み失敗');
        setIsLoading(false);
    };

    useEffect(() => { load(); }, []);

    // ユーザー一覧（フィルタ用）
    const users = Array.from(
        new Map(
            reflections
                .filter(r => r.profile)
                .map(r => [r.user_id, r.profile!.full_name])
        ).entries()
    );

    // フィルタ適用
    const filtered = reflections.filter(r => {
        const matchUser = !filterUser || r.user_id === filterUser;
        const matchSearch = !search
            || (r.title ?? '').toLowerCase().includes(search.toLowerCase())
            || (r.profile?.full_name ?? '').toLowerCase().includes(search.toLowerCase());
        return matchUser && matchSearch;
    });

    // 統計
    const totalComments = reflections.reduce((s, r) => s + (r.comment_count ?? 0), 0);
    const noCommentCount = reflections.filter(r => (r.comment_count ?? 0) === 0).length;

    return (
        <div className="space-y-6 pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <BookHeart className="text-orange-500" size={32} />
                        振り返り管理
                    </h1>
                    <p className="text-slate-500 font-bold mt-1">生徒の振り返り投稿にフィードバックを送ります</p>
                </div>
                <button
                    onClick={load}
                    className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 px-4 py-2.5 rounded-xl font-bold hover:bg-slate-50 transition-all"
                >
                    <RefreshCw size={16} /> 更新
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: '総投稿数', value: reflections.length, color: 'text-slate-900', icon: <BookHeart size={18} className="text-slate-400" /> },
                    { label: '生徒数', value: users.length, color: 'text-orange-500', icon: <Users size={18} className="text-orange-300" /> },
                    { label: '総コメント', value: totalComments, color: 'text-emerald-600', icon: <MessageCircle size={18} className="text-emerald-400" /> },
                    { label: '未コメント', value: noCommentCount, color: noCommentCount > 0 ? 'text-amber-600' : 'text-slate-400', icon: <MessageSquarePlus size={18} className={noCommentCount > 0 ? "text-amber-400" : "text-slate-300"} /> },
                ].map(stat => (
                    <div key={stat.label} className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-3">
                        {stat.icon}
                        <div>
                            <p className="text-xs font-black text-slate-500">{stat.label}</p>
                            <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-1 relative">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text" value={search} onChange={e => setSearch(e.target.value)}
                        placeholder="タイトル・生徒名で検索..."
                        className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 outline-none focus:border-orange-400"
                    />
                </div>
                <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-3">
                    <Filter size={16} className="text-slate-400" />
                    <select
                        value={filterUser} onChange={e => setFilterUser(e.target.value)}
                        className="font-bold text-slate-600 bg-transparent outline-none cursor-pointer min-w-[140px]"
                    >
                        <option value="">すべての生徒</option>
                        {users.map(([id, name]) => (
                            <option key={id} value={id}>{name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* List */}
            {isLoading ? (
                <div className="py-16 flex flex-col items-center gap-3 text-slate-400">
                    <Loader2 size={32} className="animate-spin" />
                    <p className="font-bold text-sm">読み込み中...</p>
                </div>
            ) : filtered.length === 0 ? (
                <div className="py-16 text-center bg-white rounded-2xl border border-slate-200 border-dashed">
                    <BookHeart size={36} className="text-slate-200 mx-auto mb-3" />
                    <p className="text-slate-400 font-bold">
                        {search || filterUser ? '該当する振り返りがありません' : 'まだ振り返りの投稿がありません'}
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {/* 未コメントを先に表示 */}
                    {noCommentCount > 0 && !filterUser && !search && (
                        <div className="flex items-center gap-2 py-1">
                            <span className="text-xs font-black text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full flex items-center gap-1">
                                <MessageSquarePlus size={12} /> 未コメント {noCommentCount}件 — 上から順に確認しましょう
                            </span>
                        </div>
                    )}
                    {currentUserId && filtered.map(r => (
                        <AdminReflectionCard
                            key={r.id}
                            reflection={r}
                            adminUserId={currentUserId}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
