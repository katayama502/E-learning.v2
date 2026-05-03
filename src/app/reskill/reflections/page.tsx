'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { useAppStore } from '@/lib/appStore';
import {
    BookHeart, Plus, ChevronDown, ChevronUp,
    Calendar, Smile, MessageCircle, Trash2, Loader2,
    Send, X, CheckCircle2, AlertCircle, Sparkles
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import {
    getMyReflectionsAction,
    getReflectionDetailAction,
    createReflectionAction,
    deleteReflectionAction,
    Reflection, Mood,
} from './actions';

// ── Mood の設定 ──────────────────────────────────────────
const MOODS: { value: Mood; label: string; emoji: string; color: string }[] = [
    { value: 'great', label: '最高！', emoji: '🔥', color: 'bg-orange-100 text-orange-600 border-orange-200' },
    { value: 'good', label: '良かった', emoji: '😊', color: 'bg-emerald-100 text-emerald-600 border-emerald-200' },
    { value: 'neutral', label: 'まあまあ', emoji: '😐', color: 'bg-slate-100 text-slate-600 border-slate-200' },
    { value: 'tough', label: 'きつかった', emoji: '😓', color: 'bg-amber-100 text-amber-600 border-amber-200' },
    { value: 'hard', label: 'しんどかった', emoji: '😣', color: 'bg-red-100 text-red-600 border-red-200' },
];

function getMood(v: Mood) {
    return MOODS.find(m => m.value === v) ?? MOODS[1];
}

// ── 投稿フォーム ─────────────────────────────────────────
function ReflectionForm({ userId, onCreated, onCancel }: {
    userId: string;
    onCreated: () => void;
    onCancel: () => void;
}) {
    const today = new Date().toISOString().split('T')[0];
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [mood, setMood] = useState<Mood>('good');
    const [date, setDate] = useState(today);
    const [isPending, startTransition] = useTransition();

    const TEMPLATE = `【やったこと】\n\n\n【気づいたこと・学び】\n\n\n【次回の目標】\n\n`;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) return;

        startTransition(async () => {
            const result = await createReflectionAction({
                userId,
                title: title.trim(),
                content: content.trim(),
                mood,
                practiceDate: date,
            });

            if (result.success) {
                toast.success('振り返りを投稿しました！');
                onCreated();
            } else {
                toast.error(`投稿失敗: ${result.error}`);
            }
        });
    };

    return (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500 to-indigo-600 p-5 flex items-center justify-between">
                <h2 className="text-white font-black flex items-center gap-2">
                    <BookHeart size={20} /> 振り返りを書く
                </h2>
                <button onClick={onCancel} className="text-white/70 hover:text-white transition-colors">
                    <X size={20} />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {/* 日付 */}
                <div className="flex items-center gap-3">
                    <Calendar size={18} className="text-slate-400 shrink-0" />
                    <div className="flex-1">
                        <label className="text-xs font-black text-slate-500 block mb-1">部活の日付</label>
                        <input
                            type="date" value={date} onChange={e => setDate(e.target.value)}
                            max={today}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 outline-none focus:border-orange-300"
                        />
                    </div>
                </div>

                {/* 気分 */}
                <div>
                    <label className="text-xs font-black text-slate-500 block mb-2 flex items-center gap-1.5">
                        <Smile size={14} /> 今日の気分
                    </label>
                    <div className="flex gap-2 flex-wrap">
                        {MOODS.map(m => (
                            <button
                                key={m.value} type="button"
                                onClick={() => setMood(m.value)}
                                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold border-2 transition-all ${mood === m.value
                                    ? `${m.color} border-current scale-105 shadow-sm`
                                    : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'}`}
                            >
                                <span className="text-base">{m.emoji}</span>
                                <span>{m.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* タイトル */}
                <div>
                    <label className="text-xs font-black text-slate-500 block mb-1">タイトル</label>
                    <input
                        type="text" required value={title}
                        onChange={e => setTitle(e.target.value)}
                        placeholder="例: 初めてのHTML制作"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-300/10"
                    />
                </div>

                {/* 内容 */}
                <div>
                    <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-black text-slate-500">振り返り内容</label>
                        <button
                            type="button"
                            onClick={() => setContent(TEMPLATE)}
                            className="text-[10px] font-black text-orange-400 hover:text-orange-600 flex items-center gap-1"
                        >
                            <Sparkles size={10} /> テンプレートを使う
                        </button>
                    </div>
                    <textarea
                        required value={content}
                        onChange={e => setContent(e.target.value)}
                        placeholder="今日の部活で学んだことを自由に書きましょう"
                        rows={10}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-300/10 resize-none leading-relaxed"
                    />
                    <p className="text-[10px] text-slate-400 font-bold mt-1 text-right">{content.length} 文字</p>
                </div>

                <div className="flex gap-3 pt-2">
                    <button type="button" onClick={onCancel}
                        className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all">
                        キャンセル
                    </button>
                    <button type="submit" disabled={isPending}
                        className="flex-1 py-3 bg-orange-500 text-white font-black rounded-2xl hover:bg-orange-600 disabled:opacity-60 transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-100">
                        {isPending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                        投稿する
                    </button>
                </div>
            </form>
        </div>
    );
}

// ── 振り返りカード ───────────────────────────────────────
function ReflectionCard({ reflection, userId, onDeleted }: {
    reflection: Reflection;
    userId: string;
    onDeleted: () => void;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [detail, setDetail] = useState<Reflection | null>(null);
    const [isLoadingDetail, setIsLoadingDetail] = useState(false);
    const [isPending, startTransition] = useTransition();
    const mood = getMood(reflection.mood);

    const handleExpand = async () => {
        if (!isOpen && !detail) {
            setIsLoadingDetail(true);
            const result = await getReflectionDetailAction(reflection.id);
            if (result.success && result.data) setDetail(result.data);
            setIsLoadingDetail(false);
        }
        setIsOpen(!isOpen);
    };

    const handleDelete = () => {
        if (!confirm('この振り返りを削除しますか？')) return;
        startTransition(async () => {
            const result = await deleteReflectionAction(reflection.id, userId);
            if (result.success) {
                toast.success('削除しました');
                onDeleted();
            } else {
                toast.error(`削除失敗: ${result.error}`);
            }
        });
    };

    const displayDate = new Date(reflection.practice_date + 'T00:00:00').toLocaleDateString('ja-JP', {
        year: 'numeric', month: 'long', day: 'numeric', weekday: 'short',
    });

    return (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-md transition-all">
            {/* Card Header */}
            <button
                className="w-full text-left p-5 flex items-start gap-4"
                onClick={handleExpand}
            >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 border ${mood.color}`}>
                    {mood.emoji}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-xs font-black text-slate-400 flex items-center gap-1">
                            <Calendar size={12} /> {displayDate}
                        </span>
                        {(reflection.comment_count ?? 0) > 0 && (
                            <span className="flex items-center gap-1 text-[10px] font-black text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-50">
                                <MessageCircle size={10} /> コメント {reflection.comment_count}件
                            </span>
                        )}
                    </div>
                    <h3 className="font-black text-slate-800 text-base line-clamp-1">{reflection.title}</h3>
                    {!isOpen && (
                        <p className="text-sm text-slate-500 font-medium line-clamp-2 mt-1">{reflection.content}</p>
                    )}
                </div>
                <div className="text-slate-300 shrink-0 mt-1">
                    {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
            </button>

            {/* Expanded Content */}
            {isOpen && (
                <div className="border-t border-slate-100">
                    {isLoadingDetail ? (
                        <div className="p-6 flex justify-center">
                            <Loader2 size={24} className="animate-spin text-slate-400" />
                        </div>
                    ) : (
                        <div className="p-5 space-y-5">
                            {/* Content */}
                            <div className="bg-slate-50 rounded-2xl p-4">
                                <pre className="text-sm text-slate-700 font-medium whitespace-pre-wrap leading-relaxed">
                                    {detail?.content ?? reflection.content}
                                </pre>
                            </div>

                            {/* Admin Comments */}
                            {(detail?.comments ?? []).length > 0 && (
                                <div className="space-y-3">
                                    <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                                        <MessageCircle size={12} /> 先生からのコメント
                                    </h4>
                                    {(detail?.comments ?? []).map(comment => (
                                        <div key={comment.id} className="flex gap-3">
                                            <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-black shrink-0">
                                                {(comment.profile?.full_name || '先')[0]}
                                            </div>
                                            <div className="flex-1 bg-orange-50 rounded-2xl rounded-tl-none px-4 py-3 border border-orange-50">
                                                <p className="text-[10px] font-black text-orange-500 mb-1">
                                                    {comment.profile?.full_name ?? '管理者'} ・{' '}
                                                    {new Date(comment.created_at).toLocaleDateString('ja-JP')}
                                                </p>
                                                <p className="text-sm text-slate-700 font-medium leading-relaxed">{comment.content}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {(detail?.comments ?? []).length === 0 && (
                                <p className="text-xs text-slate-400 font-bold text-center py-2">
                                    まだコメントはありません
                                </p>
                            )}

                            {/* Actions */}
                            <div className="flex justify-end">
                                <button
                                    onClick={handleDelete} disabled={isPending}
                                    className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-red-500 transition-colors px-3 py-2 rounded-xl hover:bg-red-50"
                                >
                                    {isPending ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                                    削除
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

// ── メインページ ─────────────────────────────────────────
export default function ReflectionsPage() {
    const { currentUserId, authStatus } = useAppStore();
    const [reflections, setReflections] = useState<Reflection[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);

    const load = async () => {
        if (!currentUserId) return;
        setIsLoading(true);
        const result = await getMyReflectionsAction(currentUserId);
        if (result.success) setReflections(result.data);
        setIsLoading(false);
    };

    useEffect(() => {
        if (currentUserId) load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUserId]);

    const streakCount = (() => {
        if (reflections.length === 0) return 0;
        const today = new Date();
        let streak = 0;
        let checkDate = new Date(today);
        const dates = new Set(reflections.map(r => r.practice_date));
        while (true) {
            const key = checkDate.toISOString().split('T')[0];
            if (dates.has(key)) { streak++; checkDate.setDate(checkDate.getDate() - 1); }
            else break;
            if (streak > 365) break;
        }
        return streak;
    })();

    if (authStatus !== 'authenticated' || !currentUserId) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
                <div className="bg-white rounded-3xl p-8 text-center shadow-sm max-w-sm w-full">
                    <AlertCircle className="text-slate-300 mx-auto mb-4" size={40} />
                    <p className="font-bold text-slate-600 mb-4">ログインが必要です</p>
                    <Link href="/login" className="bg-orange-500 text-white font-bold py-3 px-6 rounded-xl block hover:bg-orange-600 transition-all">
                        ログインする
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-full bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-100 sticky top-0 z-30">
                <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div>
                        <h1 className="text-base font-black text-slate-900 flex items-center gap-2">
                            <BookHeart size={18} className="text-orange-500" /> 振り返り記録
                        </h1>
                        <p className="text-xs text-slate-400 font-bold">部活動の学びを記録しよう</p>
                    </div>
                    {!isFormOpen && (
                        <button
                            onClick={() => setIsFormOpen(true)}
                            className="flex items-center gap-1.5 bg-orange-500 text-white font-black px-4 py-2.5 rounded-xl hover:bg-orange-600 transition-all shadow-md shadow-orange-100 text-sm"
                        >
                            <Plus size={16} /> 書く
                        </button>
                    )}
                </div>
            </header>

            <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-3 gap-3">
                    {[
                        { label: '投稿数', value: reflections.length, icon: <BookHeart size={16} />, color: 'text-orange-500' },
                        { label: '連続日数', value: `${streakCount}日`, icon: <CheckCircle2 size={16} />, color: 'text-emerald-600' },
                        {
                            label: 'コメント', value: reflections.reduce((s, r) => s + (r.comment_count ?? 0), 0),
                            icon: <MessageCircle size={16} />, color: 'text-indigo-600'
                        },
                    ].map(stat => (
                        <div key={stat.label} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm text-center">
                            <div className={`flex justify-center mb-1 ${stat.color}`}>{stat.icon}</div>
                            <p className={`text-xl font-black ${stat.color}`}>{stat.value}</p>
                            <p className="text-[10px] font-black text-slate-400">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Form */}
                {isFormOpen && (
                    <ReflectionForm
                        userId={currentUserId}
                        onCreated={() => { setIsFormOpen(false); load(); }}
                        onCancel={() => setIsFormOpen(false)}
                    />
                )}

                {/* List */}
                {isLoading ? (
                    <div className="py-16 flex flex-col items-center gap-3 text-slate-400">
                        <Loader2 size={32} className="animate-spin" />
                        <p className="text-sm font-bold">読み込み中...</p>
                    </div>
                ) : reflections.length === 0 ? (
                    <div className="py-16 text-center">
                        <div className="w-20 h-20 bg-orange-50 rounded-3xl flex items-center justify-center mx-auto mb-4">
                            <BookHeart size={36} className="text-orange-200" />
                        </div>
                        <p className="font-black text-slate-600 mb-1">まだ振り返りがありません</p>
                        <p className="text-sm text-slate-400 font-bold mb-6">部活後の学びを記録してみましょう</p>
                        <button
                            onClick={() => setIsFormOpen(true)}
                            className="inline-flex items-center gap-2 bg-orange-500 text-white font-black px-6 py-3 rounded-2xl hover:bg-orange-600 transition-all shadow-lg shadow-orange-100"
                        >
                            <Plus size={18} /> 最初の振り返りを書く
                        </button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {reflections.map(r => (
                            <ReflectionCard
                                key={r.id}
                                reflection={r}
                                userId={currentUserId}
                                onDeleted={load}
                            />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
