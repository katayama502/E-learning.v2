'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';
import { toast } from 'sonner';
import {
    Plus, Search, Pencil, Trash2, Play, Loader2, X, Check,
    ChevronDown, Film, FileText, BookOpen, Filter
} from 'lucide-react';

type Lesson = {
    id: string;
    title: string;
    description: string | null;
    youtube_url: string | null;
    duration: string | null;
    order_index: number;
    curriculum_id: string;
    module_title?: string;
    track_title?: string;
};

type Module = { id: string; title: string; course_id: string; track_title?: string };
type Track = { id: string; title: string };

type FormState = {
    title: string;
    description: string;
    youtube_url: string;
    duration: string;
    curriculum_id: string;
};

const EMPTY_FORM: FormState = { title: '', description: '', youtube_url: '', duration: '', curriculum_id: '' };

export default function ContentPage() {
    const supabase = createClient();
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [modules, setModules] = useState<Module[]>([]);
    const [tracks, setTracks] = useState<Track[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterTrack, setFilterTrack] = useState('');
    const [filterModule, setFilterModule] = useState('');

    const [modal, setModal] = useState<{ type: 'create' | 'edit' | null; data?: Lesson }>({ type: null });
    const [form, setForm] = useState<FormState>(EMPTY_FORM);
    const [saving, setSaving] = useState(false);

    const load = useCallback(async () => {
        setLoading(true);

        const [{ data: tracksData }, { data: modulesData }, { data: lessonsData }] = await Promise.all([
            supabase.from('courses').select('id, title').order('order_index'),
            supabase.from('course_curriculums').select('id, title, course_id').order('order_index'),
            supabase.from('course_lessons').select('id, title, description, youtube_url, duration, order_index, curriculum_id').order('curriculum_id, order_index'),
        ]);

        const trackMap = Object.fromEntries((tracksData || []).map(t => [t.id, t.title]));
        const moduleMap = Object.fromEntries((modulesData || []).map(m => [m.id, { title: m.title, course_id: m.course_id }]));

        const enrichedModules = (modulesData || []).map(m => ({
            ...m,
            track_title: trackMap[m.course_id] || '',
        }));

        const enrichedLessons = (lessonsData || []).map(l => ({
            ...l,
            module_title: moduleMap[l.curriculum_id]?.title || '',
            track_title: trackMap[moduleMap[l.curriculum_id]?.course_id || ''] || '',
        }));

        setTracks(tracksData || []);
        setModules(enrichedModules);
        setLessons(enrichedLessons);
        setLoading(false);
    }, []);

    useEffect(() => { load(); }, [load]);

    const filteredLessons = lessons.filter(l => {
        const matchSearch = !search || l.title.toLowerCase().includes(search.toLowerCase());
        const matchTrack = !filterTrack || l.track_title === filterTrack;
        const matchModule = !filterModule || l.curriculum_id === filterModule;
        return matchSearch && matchTrack && matchModule;
    });

    const filteredModulesForDropdown = filterTrack
        ? modules.filter(m => m.track_title === filterTrack)
        : modules;

    const openModal = (type: 'create' | 'edit', data?: Lesson) => {
        setModal({ type, data });
        setForm(data ? {
            title: data.title,
            description: data.description || '',
            youtube_url: data.youtube_url || '',
            duration: data.duration || '',
            curriculum_id: data.curriculum_id,
        } : EMPTY_FORM);
    };

    const closeModal = () => { setModal({ type: null }); setForm(EMPTY_FORM); };

    const handleSave = async () => {
        if (!form.title.trim()) { toast.error('タイトルを入力してください'); return; }
        if (!form.curriculum_id) { toast.error('モジュールを選択してください'); return; }
        setSaving(true);

        try {
            if (modal.type === 'create') {
                const { count } = await supabase
                    .from('course_lessons')
                    .select('*', { count: 'exact', head: true })
                    .eq('curriculum_id', form.curriculum_id);

                const { error } = await supabase.from('course_lessons').insert({
                    title: form.title,
                    description: form.description || null,
                    youtube_url: form.youtube_url || null,
                    duration: form.duration || null,
                    curriculum_id: form.curriculum_id,
                    order_index: (count || 0) + 1,
                });
                if (error) throw error;
                toast.success('レッスンを作成しました');
            } else {
                const { error } = await supabase.from('course_lessons').update({
                    title: form.title,
                    description: form.description || null,
                    youtube_url: form.youtube_url || null,
                    duration: form.duration || null,
                    curriculum_id: form.curriculum_id,
                }).eq('id', modal.data!.id);
                if (error) throw error;
                toast.success('レッスンを更新しました');
            }

            closeModal();
            await load();
        } catch (e: any) {
            toast.error(e.message || '保存に失敗しました');
        } finally {
            setSaving(false);
        }
    };

    const deleteLesson = async (lesson: Lesson) => {
        if (!confirm(`「${lesson.title}」を削除しますか？`)) return;
        const { error } = await supabase.from('course_lessons').delete().eq('id', lesson.id);
        if (error) { toast.error('削除に失敗しました'); return; }
        toast.success('削除しました');
        await load();
    };

    const getYoutubeId = (url: string) => {
        const match = url?.match(/(?:embed\/|v=|youtu\.be\/)([^&?/]+)/);
        return match?.[1];
    };

    return (
        <div className="min-h-full bg-slate-50">
            <div className="max-w-5xl mx-auto p-6 md:p-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-black text-slate-900">コンテンツ管理</h1>
                        <p className="text-slate-500 font-bold text-sm mt-1">レッスン動画・教材を管理します</p>
                    </div>
                    <button
                        onClick={() => openModal('create')}
                        className="flex items-center gap-2 bg-orange-500 text-white font-black px-4 py-2.5 rounded-xl shadow-md shadow-orange-100 hover:bg-orange-600 transition-all text-sm"
                    >
                        <Plus size={16} /> レッスン追加
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                        <p className="text-xs font-black text-slate-400 uppercase tracking-wider mb-1">総レッスン数</p>
                        <p className="text-2xl font-black text-slate-900">{lessons.length}</p>
                    </div>
                    <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                        <p className="text-xs font-black text-slate-400 uppercase tracking-wider mb-1">動画あり</p>
                        <p className="text-2xl font-black text-slate-900">{lessons.filter(l => l.youtube_url).length}</p>
                    </div>
                    <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                        <p className="text-xs font-black text-slate-400 uppercase tracking-wider mb-1">表示中</p>
                        <p className="text-2xl font-black text-orange-500">{filteredLessons.length}</p>
                    </div>
                </div>

                {/* Search & Filter */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 mb-4 flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text" value={search} onChange={e => setSearch(e.target.value)}
                            placeholder="レッスン名で検索..."
                            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:border-orange-300 transition-all"
                        />
                    </div>
                    <div className="relative">
                        <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        <select
                            value={filterTrack}
                            onChange={e => { setFilterTrack(e.target.value); setFilterModule(''); }}
                            className="pl-8 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:border-orange-300 appearance-none cursor-pointer"
                        >
                            <option value="">すべてのトラック</option>
                            {tracks.map(t => <option key={t.id} value={t.title}>{t.title}</option>)}
                        </select>
                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                    <div className="relative">
                        <BookOpen size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        <select
                            value={filterModule}
                            onChange={e => setFilterModule(e.target.value)}
                            className="pl-8 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:border-orange-300 appearance-none cursor-pointer"
                        >
                            <option value="">すべてのモジュール</option>
                            {filteredModulesForDropdown.map(m => <option key={m.id} value={m.id}>{m.title}</option>)}
                        </select>
                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                </div>

                {/* Lessons Table */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="animate-spin text-orange-500" size={32} />
                        </div>
                    ) : filteredLessons.length === 0 ? (
                        <div className="text-center py-16">
                            <Film size={36} className="text-slate-300 mx-auto mb-3" />
                            <p className="text-slate-400 font-bold">レッスンが見つかりません</p>
                        </div>
                    ) : (
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-100">
                                    <th className="text-left px-4 py-3 text-xs font-black text-slate-400 uppercase tracking-wider">レッスン</th>
                                    <th className="text-left px-4 py-3 text-xs font-black text-slate-400 uppercase tracking-wider hidden md:table-cell">モジュール</th>
                                    <th className="text-left px-4 py-3 text-xs font-black text-slate-400 uppercase tracking-wider hidden lg:table-cell">動画</th>
                                    <th className="text-left px-4 py-3 text-xs font-black text-slate-400 uppercase tracking-wider hidden sm:table-cell">時間</th>
                                    <th className="px-4 py-3 w-24"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredLessons.map((lesson, i) => (
                                    <tr key={lesson.id} className={`border-b border-slate-50 hover:bg-slate-50 transition-colors ${i % 2 === 0 ? '' : 'bg-slate-50/30'}`}>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                {lesson.youtube_url ? (
                                                    <div className="w-10 h-7 bg-slate-100 rounded-lg overflow-hidden shrink-0">
                                                        <img
                                                            src={`https://img.youtube.com/vi/${getYoutubeId(lesson.youtube_url)}/default.jpg`}
                                                            alt=""
                                                            className="w-full h-full object-cover"
                                                            onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="w-10 h-7 bg-slate-100 rounded-lg flex items-center justify-center shrink-0">
                                                        <FileText size={13} className="text-slate-400" />
                                                    </div>
                                                )}
                                                <div className="min-w-0">
                                                    <p className="font-black text-slate-800 text-sm truncate">{lesson.title}</p>
                                                    <p className="text-xs text-slate-400 font-bold md:hidden">{lesson.module_title}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 hidden md:table-cell">
                                            <div>
                                                <p className="text-sm font-bold text-slate-600 truncate max-w-[180px]">{lesson.module_title}</p>
                                                <p className="text-xs text-slate-400 font-bold">{lesson.track_title}</p>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 hidden lg:table-cell">
                                            {lesson.youtube_url ? (
                                                <a
                                                    href={lesson.youtube_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-1.5 text-orange-500 hover:text-orange-600 font-bold text-xs transition-colors"
                                                >
                                                    <Play size={12} fill="currentColor" />
                                                    視聴する
                                                </a>
                                            ) : (
                                                <span className="text-slate-300 text-xs font-bold">未設定</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 hidden sm:table-cell">
                                            <span className="text-sm font-bold text-slate-500">{lesson.duration || '—'}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-1 justify-end">
                                                <button
                                                    onClick={() => openModal('edit', lesson)}
                                                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                                                >
                                                    <Pencil size={14} />
                                                </button>
                                                <button
                                                    onClick={() => deleteLesson(lesson)}
                                                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Create/Edit Modal */}
            {modal.type && (
                <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={closeModal}>
                    <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between p-6 border-b border-slate-100 sticky top-0 bg-white rounded-t-3xl">
                            <h2 className="font-black text-slate-900">
                                {modal.type === 'create' ? 'レッスンを作成' : 'レッスンを編集'}
                            </h2>
                            <button onClick={closeModal} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-slate-100 text-slate-400">
                                <X size={16} />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            {/* Module Selection */}
                            <div>
                                <label className="text-sm font-black text-slate-700 block mb-1.5">モジュール <span className="text-red-400">*</span></label>
                                <div className="relative">
                                    <select
                                        value={form.curriculum_id}
                                        onChange={e => setForm(f => ({ ...f, curriculum_id: e.target.value }))}
                                        className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl font-bold text-slate-800 outline-none focus:border-orange-300 transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="">モジュールを選択...</option>
                                        {tracks.map(track => (
                                            <optgroup key={track.id} label={track.title}>
                                                {modules.filter(m => m.course_id === track.id).map(m => (
                                                    <option key={m.id} value={m.id}>{m.title}</option>
                                                ))}
                                            </optgroup>
                                        ))}
                                    </select>
                                    <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                </div>
                            </div>

                            {/* Title */}
                            <div>
                                <label className="text-sm font-black text-slate-700 block mb-1.5">タイトル <span className="text-red-400">*</span></label>
                                <input
                                    type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                                    placeholder="例：Canvaの基本操作"
                                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl font-bold text-slate-800 outline-none focus:border-orange-300 transition-all"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="text-sm font-black text-slate-700 block mb-1.5">説明</label>
                                <textarea
                                    value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                                    placeholder="このレッスンの内容..."
                                    rows={2}
                                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl font-bold text-slate-800 outline-none focus:border-orange-300 transition-all resize-none"
                                />
                            </div>

                            {/* YouTube URL */}
                            <div>
                                <label className="text-sm font-black text-slate-700 block mb-1.5">YouTube URL</label>
                                <input
                                    type="url" value={form.youtube_url} onChange={e => setForm(f => ({ ...f, youtube_url: e.target.value }))}
                                    placeholder="https://www.youtube.com/embed/..."
                                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl font-bold text-slate-800 outline-none focus:border-orange-300 transition-all"
                                />
                                {form.youtube_url && getYoutubeId(form.youtube_url) && (
                                    <div className="mt-2 rounded-xl overflow-hidden aspect-video">
                                        <iframe
                                            src={`https://www.youtube.com/embed/${getYoutubeId(form.youtube_url)}`}
                                            className="w-full h-full"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Duration */}
                            <div>
                                <label className="text-sm font-black text-slate-700 block mb-1.5">動画時間</label>
                                <input
                                    type="text" value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))}
                                    placeholder="例：12分"
                                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl font-bold text-slate-800 outline-none focus:border-orange-300 transition-all"
                                />
                            </div>
                        </div>
                        <div className="flex gap-3 p-6 pt-0 sticky bottom-0 bg-white rounded-b-3xl">
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
