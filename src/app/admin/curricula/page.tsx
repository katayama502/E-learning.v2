'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { toast } from 'sonner';
import {
    Plus, ChevronDown, ChevronRight, Pencil, Trash2, Eye, EyeOff,
    BookOpen, Layers, Loader2, X, Check, GripVertical
} from 'lucide-react';

type Module = {
    id: string;
    title: string;
    description: string | null;
    is_public: boolean;
    order_index: number;
    lesson_count?: number;
};

type Track = {
    id: string;
    title: string;
    description: string | null;
    is_published: boolean;
    order_index: number;
    modules?: Module[];
};

export default function CurriculaPage() {
    const supabase = createClient();
    const [tracks, setTracks] = useState<Track[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedTrack, setExpandedTrack] = useState<string | null>(null);

    // Modal state
    const [modal, setModal] = useState<{
        type: 'createTrack' | 'editTrack' | 'createModule' | 'editModule' | null;
        data?: any;
    }>({ type: null });
    const [form, setForm] = useState({ title: '', description: '' });
    const [saving, setSaving] = useState(false);

    const load = async () => {
        setLoading(true);
        const { data: tracksData } = await supabase
            .from('courses')
            .select('id, title, description, is_published, order_index')
            .order('order_index');

        if (!tracksData) { setLoading(false); return; }

        const enriched = await Promise.all(tracksData.map(async (track) => {
            const { data: modules } = await supabase
                .from('course_curriculums')
                .select('id, title, description, is_public, order_index')
                .eq('course_id', track.id)
                .order('order_index');

            const modulesWithCount = await Promise.all((modules || []).map(async (mod) => {
                const { count } = await supabase
                    .from('course_lessons')
                    .select('*', { count: 'exact', head: true })
                    .eq('curriculum_id', mod.id);
                return { ...mod, lesson_count: count || 0 };
            }));

            return { ...track, modules: modulesWithCount };
        }));

        setTracks(enriched);
        setLoading(false);
    };

    useEffect(() => { load(); }, []);

    const openModal = (type: typeof modal.type, data?: any) => {
        setModal({ type, data });
        setForm({
            title: data?.title || '',
            description: data?.description || '',
        });
    };

    const closeModal = () => { setModal({ type: null }); setForm({ title: '', description: '' }); };

    const handleSave = async () => {
        if (!form.title.trim()) { toast.error('タイトルを入力してください'); return; }
        setSaving(true);

        try {
            if (modal.type === 'createTrack') {
                const maxOrder = Math.max(0, ...tracks.map(t => t.order_index));
                const { error } = await supabase.from('courses').insert({
                    title: form.title,
                    description: form.description || null,
                    is_published: false,
                    order_index: maxOrder + 1,
                });
                if (error) throw error;
                toast.success('トラックを作成しました');

            } else if (modal.type === 'editTrack') {
                const { error } = await supabase.from('courses').update({
                    title: form.title,
                    description: form.description || null,
                }).eq('id', modal.data.id);
                if (error) throw error;
                toast.success('トラックを更新しました');

            } else if (modal.type === 'createModule') {
                const track = tracks.find(t => t.id === modal.data.trackId);
                const maxOrder = Math.max(0, ...(track?.modules || []).map(m => m.order_index));
                const { error } = await supabase.from('course_curriculums').insert({
                    course_id: modal.data.trackId,
                    title: form.title,
                    description: form.description || null,
                    is_public: false,
                    order_index: maxOrder + 1,
                });
                if (error) throw error;
                toast.success('モジュールを作成しました');

            } else if (modal.type === 'editModule') {
                const { error } = await supabase.from('course_curriculums').update({
                    title: form.title,
                    description: form.description || null,
                }).eq('id', modal.data.id);
                if (error) throw error;
                toast.success('モジュールを更新しました');
            }

            closeModal();
            await load();
        } catch (e: any) {
            toast.error(e.message || '保存に失敗しました');
        } finally {
            setSaving(false);
        }
    };

    const toggleTrackPublish = async (track: Track) => {
        const { error } = await supabase.from('courses')
            .update({ is_published: !track.is_published })
            .eq('id', track.id);
        if (error) { toast.error('更新に失敗しました'); return; }
        toast.success(track.is_published ? '非公開にしました' : '公開しました');
        await load();
    };

    const toggleModulePublish = async (mod: Module) => {
        const { error } = await supabase.from('course_curriculums')
            .update({ is_public: !mod.is_public })
            .eq('id', mod.id);
        if (error) { toast.error('更新に失敗しました'); return; }
        toast.success(mod.is_public ? '非公開にしました' : '公開しました');
        await load();
    };

    const deleteTrack = async (track: Track) => {
        if (!confirm(`「${track.title}」を削除しますか？含まれるモジュール・レッスンもすべて削除されます。`)) return;
        const { error } = await supabase.from('courses').delete().eq('id', track.id);
        if (error) { toast.error('削除に失敗しました'); return; }
        toast.success('削除しました');
        await load();
    };

    const deleteModule = async (mod: Module) => {
        if (!confirm(`「${mod.title}」を削除しますか？含まれるレッスンもすべて削除されます。`)) return;
        const { error } = await supabase.from('course_curriculums').delete().eq('id', mod.id);
        if (error) { toast.error('削除に失敗しました'); return; }
        toast.success('削除しました');
        await load();
    };

    return (
        <div className="min-h-full bg-slate-50">
            <div className="max-w-4xl mx-auto p-6 md:p-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-black text-slate-900">カリキュラム管理</h1>
                        <p className="text-slate-500 font-bold text-sm mt-1">トラック・モジュールの構成を管理します</p>
                    </div>
                    <button
                        onClick={() => openModal('createTrack')}
                        className="flex items-center gap-2 bg-orange-500 text-white font-black px-4 py-2.5 rounded-xl shadow-md shadow-orange-100 hover:bg-orange-600 transition-all text-sm"
                    >
                        <Plus size={16} /> トラック追加
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                        <p className="text-xs font-black text-slate-400 uppercase tracking-wider mb-1">トラック数</p>
                        <p className="text-3xl font-black text-slate-900">{tracks.length}</p>
                    </div>
                    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                        <p className="text-xs font-black text-slate-400 uppercase tracking-wider mb-1">モジュール数</p>
                        <p className="text-3xl font-black text-slate-900">
                            {tracks.reduce((sum, t) => sum + (t.modules?.length || 0), 0)}
                        </p>
                    </div>
                </div>

                {/* Track List */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="animate-spin text-orange-500" size={32} />
                    </div>
                ) : tracks.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-slate-100 p-16 text-center">
                        <Layers size={40} className="text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-400 font-bold">トラックがありません</p>
                        <button onClick={() => openModal('createTrack')} className="mt-4 text-orange-500 font-black text-sm hover:underline">
                            + 最初のトラックを作成する
                        </button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {tracks.map((track) => (
                            <div key={track.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                                {/* Track Header */}
                                <div className="flex items-center gap-3 p-4">
                                    <button
                                        onClick={() => setExpandedTrack(expandedTrack === track.id ? null : track.id)}
                                        className="flex items-center gap-3 flex-1 text-left min-w-0"
                                    >
                                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${track.is_published ? 'bg-orange-100 text-orange-500' : 'bg-slate-100 text-slate-400'}`}>
                                            <BookOpen size={16} />
                                        </div>
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className="font-black text-slate-900 truncate">{track.title}</span>
                                                <span className={`shrink-0 text-[10px] font-black px-1.5 py-0.5 rounded ${track.is_published ? 'bg-orange-50 text-orange-500' : 'bg-slate-100 text-slate-400'}`}>
                                                    {track.is_published ? '公開中' : '非公開'}
                                                </span>
                                            </div>
                                            <p className="text-xs text-slate-400 font-bold">
                                                {track.modules?.length || 0} モジュール
                                            </p>
                                        </div>
                                        {expandedTrack === track.id
                                            ? <ChevronDown size={16} className="text-slate-400 shrink-0" />
                                            : <ChevronRight size={16} className="text-slate-400 shrink-0" />
                                        }
                                    </button>

                                    {/* Track Actions */}
                                    <div className="flex items-center gap-1 shrink-0">
                                        <button onClick={() => toggleTrackPublish(track)}
                                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors"
                                            title={track.is_published ? '非公開にする' : '公開する'}>
                                            {track.is_published ? <EyeOff size={15} /> : <Eye size={15} />}
                                        </button>
                                        <button onClick={() => openModal('editTrack', track)}
                                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors">
                                            <Pencil size={15} />
                                        </button>
                                        <button onClick={() => deleteTrack(track)}
                                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors">
                                            <Trash2 size={15} />
                                        </button>
                                    </div>
                                </div>

                                {/* Modules (Expanded) */}
                                {expandedTrack === track.id && (
                                    <div className="border-t border-slate-100 bg-slate-50/50">
                                        {(track.modules || []).map((mod) => (
                                            <div key={mod.id} className="flex items-center gap-3 px-4 py-3 border-b border-slate-100 last:border-0">
                                                <GripVertical size={14} className="text-slate-300 shrink-0" />
                                                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${mod.is_public ? 'bg-orange-50 text-orange-400' : 'bg-slate-100 text-slate-300'}`}>
                                                    <Layers size={13} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <span className="font-bold text-slate-700 text-sm truncate block">{mod.title}</span>
                                                    <span className="text-xs text-slate-400 font-bold">{mod.lesson_count} レッスン</span>
                                                </div>
                                                <span className={`shrink-0 text-[10px] font-black px-1.5 py-0.5 rounded ${mod.is_public ? 'bg-orange-50 text-orange-500' : 'bg-slate-100 text-slate-400'}`}>
                                                    {mod.is_public ? '公開' : '非公開'}
                                                </span>
                                                <div className="flex items-center gap-1 shrink-0">
                                                    <button onClick={() => toggleModulePublish(mod)}
                                                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white text-slate-400 hover:text-slate-600 transition-colors">
                                                        {mod.is_public ? <EyeOff size={13} /> : <Eye size={13} />}
                                                    </button>
                                                    <button onClick={() => openModal('editModule', mod)}
                                                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white text-slate-400 hover:text-slate-600 transition-colors">
                                                        <Pencil size={13} />
                                                    </button>
                                                    <button onClick={() => deleteModule(mod)}
                                                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors">
                                                        <Trash2 size={13} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                        {/* Add Module Button */}
                                        <button
                                            onClick={() => openModal('createModule', { trackId: track.id })}
                                            className="w-full flex items-center gap-2 px-4 py-3 text-sm font-black text-orange-500 hover:bg-orange-50 transition-colors"
                                        >
                                            <Plus size={14} /> モジュールを追加
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal */}
            {modal.type && (
                <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={closeModal}>
                    <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between p-6 border-b border-slate-100">
                            <h2 className="font-black text-slate-900">
                                {modal.type === 'createTrack' && 'トラックを作成'}
                                {modal.type === 'editTrack' && 'トラックを編集'}
                                {modal.type === 'createModule' && 'モジュールを作成'}
                                {modal.type === 'editModule' && 'モジュールを編集'}
                            </h2>
                            <button onClick={closeModal} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-slate-100 text-slate-400">
                                <X size={16} />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="text-sm font-black text-slate-700 block mb-1.5">タイトル <span className="text-red-400">*</span></label>
                                <input
                                    type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                                    placeholder="例：Canvaで作ろう"
                                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl font-bold text-slate-800 outline-none focus:border-orange-300 transition-all"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-black text-slate-700 block mb-1.5">説明</label>
                                <textarea
                                    value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                                    placeholder="このトラック/モジュールの説明"
                                    rows={3}
                                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl font-bold text-slate-800 outline-none focus:border-orange-300 transition-all resize-none"
                                />
                            </div>
                        </div>
                        <div className="flex gap-3 p-6 pt-0">
                            <button onClick={closeModal} className="flex-1 py-3 bg-slate-100 text-slate-600 font-black rounded-xl hover:bg-slate-200 transition-all">キャンセル</button>
                            <button onClick={handleSave} disabled={saving}
                                className="flex-1 py-3 bg-orange-500 text-white font-black rounded-xl hover:bg-orange-600 transition-all disabled:opacity-70 flex items-center justify-center gap-2">
                                {saving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                                保存
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
