"use client";

import React, { useState } from 'react';
import { useAppStore } from '@/lib/appStore';
import {
    PlayCircle, CheckCircle2, BookOpen, Clock,
    TrendingUp, Award, ChevronRight, Layout,
    Zap, Star, ArrowRight, Layers, Play, X, Sparkles, Flame,
    Calendar, Users, MapPin, MonitorPlay, XCircle,
    Map, ExternalLink, Code, Palette, Globe, Bot, Cpu, BookHeart
} from 'lucide-react';
import Link from 'next/link';
import TrackRoadmapView from '@/components/reskill/TrackRoadmapView';
import { ElearningService } from '@/services/elearning';

// Helper to extract YouTube ID from URL
const getYoutubeId = (url?: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};

// Helper function to get fallback image based on course title
// Only use local paths (starting with /), ignore external URLs
const getCourseImage = (course: { image?: string; title: string }) => {
    // Only use course.image if it's a local path (starts with /)
    if (course.image && course.image.startsWith('/')) {
        return course.image;
    }

    const title = course.title;
    if (title.includes('リスキル')) return '/courses/reskill_archive.png';
    if (title.includes('ITパスポート')) return '/courses/it_passport.png';
    if (title.includes('基本情報')) return '/courses/fe_exam.png';
    if (title.includes('キャリア')) return '/courses/career_support.png';
    if (title.includes('AI')) return '/courses/ai_course.png';
    if (title.includes('SNS') || title.includes('マーケティング')) return '/courses/sns_marketing.png';
    if (title.includes('動画')) return '/courses/video_production.png';
    if (title.includes('アプリ')) return '/courses/app_development.png';
    if (title.includes('自動化')) return '/courses/automation.png';
    if (title.includes('セキュリティ')) return '/courses/security_course.png';
    if (title.includes('Google Apps Script') || title.includes('GAS')) return '/courses/gas_course.png';
    if (title.includes('Google')) return '/courses/google_basics.png';
    if (title.includes('HP') || title.includes('Web') || title.includes('ウェブ')) return '/courses/hp_course.png';
    if (title.includes('DX')) return '/courses/track_dx.png';
    if (title.includes('デジタル')) return '/courses/digital_basics.png';

    return '/courses/digital_basics.png';
};

// Recently Viewed Section Component with YouTube thumbnails and inline play
function RecentlyViewedSection({ lessons, courses, activeTrack }: { lessons: any[]; courses: any[]; activeTrack: any }) {
    const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);

    return (
        <section>
            <div className="flex items-center justify-between mb-4 mt-12">
                <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                    <Clock className="text-orange-400" />
                    最近見たレッスン
                </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {lessons.map((lesson: any) => {
                    // Find module containing this lesson
                    const module = courses.find((c: any) => c.lessons && c.lessons.some((l: any) => l.id === lesson.id));
                    // Extract YouTube ID from lesson URL
                    const youtubeId = getYoutubeId(lesson.url);
                    // Use YouTube thumbnail if available, otherwise fallback
                    const thumbnail = youtubeId
                        ? `https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`
                        : module?.thumbnail_url || activeTrack?.image || '/illustrations/dx_roadmap.png';

                    const isPlaying = playingVideoId === lesson.id;

                    return (
                        <div
                            key={lesson.id}
                            className="group bg-white rounded-3xl border border-slate-200 overflow-hidden hover:shadow-xl hover:shadow-orange-800/5 transition-all"
                        >
                            <div className="aspect-video bg-slate-900 relative overflow-hidden">
                                {isPlaying && youtubeId ? (
                                    <>
                                        <iframe
                                            src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`}
                                            className="w-full h-full"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        />
                                        <button
                                            onClick={() => setPlayingVideoId(null)}
                                            className="absolute top-2 right-2 w-8 h-8 bg-black/60 text-white rounded-full flex items-center justify-center hover:bg-black/80 transition-colors z-10"
                                        >
                                            <X size={16} />
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <img
                                            src={thumbnail}
                                            alt={lesson.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        {/* Play button on hover */}
                                        <div
                                            className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                            onClick={() => youtubeId && setPlayingVideoId(lesson.id)}
                                        >
                                            <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                                                <Play size={24} className="text-slate-900 ml-1" fill="currentColor" />
                                            </div>
                                        </div>
                                        {/* Duration badge */}
                                        <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-black px-2 py-1 rounded">
                                            {lesson.duration || '0:00'}
                                        </div>
                                    </>
                                )}
                            </div>
                            <Link href={`/reskill/lesson/${lesson.id}`} className="block p-5 hover:bg-slate-50 transition-colors">
                                <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">{module?.title}</span>
                                <h3 className="text-lg font-black text-slate-800 mt-1 line-clamp-1 group-hover:text-orange-500 transition-colors">
                                    {lesson.title}
                                </h3>
                            </Link>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
export default function ReskillDashboardPage() {
    // State
    const [tracks, setTracks] = useState<any[]>([]);
    const [selectedTrackId, setSelectedTrackId] = useState<string>('');
    const [courses, setCourses] = useState<any[]>([]); // Courses for the selected track
    const [allModules, setAllModules] = useState<any[]>([]); // All public modules for "すべてのコース"
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [retryCount, setRetryCount] = useState(0);
    const [upcomingEvent, setUpcomingEvent] = useState<any>(null);
    const [appliedEvents, setAppliedEvents] = useState<any[]>([]); // New state for applied events

    // Get from Store
    const { activeRole, userAnalysis, completedLessonIds, lastViewedLessonIds, currentUserId } = useAppStore();

    // Fetch Initial Data (Tracks & All Modules) - runs on mount and on retry
    React.useEffect(() => {
        let isActive = true;

        setIsLoading(true);
        setError(null);

        const fetchData = async () => {
            try {
                console.log('ReskillDashboard: Fetching data...');

                // Parallel fetch
                const [fetchedTracks, fetchedModules, fetchedEvents] = await Promise.all([
                    ElearningService.getTracks(),
                    fetch('/api/elearning/modules').then(res => res.ok ? res.json() : []),
                    fetch('/api/reskill/events').then(res => res.ok ? res.json() : [])
                ]);

                if (!isActive) return;

                // Process Events
                if (Array.isArray(fetchedEvents) && fetchedEvents.length > 0) {
                    // Filter for future events and sort by date
                    const now = new Date();
                    const futureEvents = fetchedEvents
                        .filter((e: any) => new Date(e.start_at) > now)
                        .sort((a: any, b: any) => new Date(a.start_at).getTime() - new Date(b.start_at).getTime());

                    if (futureEvents.length > 0) {
                        setUpcomingEvent(futureEvents[0]);
                    }
                }

                // Process Tracks
                const uiTracks = fetchedTracks.map((t: any) => ({
                    ...t,
                    image: t.image || '/illustrations/dx_roadmap.png',
                    courseIds: []
                }));

                console.log('ReskillDashboard: Loaded tracks:', uiTracks.length);
                setTracks(uiTracks);

                // Process Modules
                console.log('ReskillDashboard: Loaded modules:', fetchedModules.length);
                const publicModules = Array.isArray(fetchedModules) ? fetchedModules.filter((m: any) => m.is_public !== false) : [];
                setAllModules(publicModules);

                if (uiTracks.length > 0) {
                    setSelectedTrackId(uiTracks[0].id);
                } else {
                    setError('No tracks found in database.');
                    setIsLoading(false);
                }
            } catch (e: any) {
                if (!isActive) return;

                console.error("Failed to load dashboard data:", e?.message || e);
                setError(e.message || 'Failed to load data');
                setIsLoading(false);
            }
        };

        fetchData();

        return () => { isActive = false; };
    }, [retryCount]);

    // Fetch Courses when Track Changes
    React.useEffect(() => {
        if (!selectedTrackId) return;

        let isActive = true;

        const loadCourses = async () => {
            setIsLoading(true);

            try {
                console.log(`ReskillDashboard: Fetching courses for track ${selectedTrackId}...`);
                const trackCourses = await ElearningService.getCoursesForTrack(selectedTrackId);

                if (!isActive) return;

                console.log(`ReskillDashboard: Fetched ${trackCourses.length} courses.`);
                setCourses(trackCourses);
            } catch (e: any) {
                if (!isActive) return;

                const isAbortError = e?.name === 'AbortError' ||
                    (e?.message && e.message.includes('aborted'));

                if (!isAbortError) {
                    console.error("Failed to load courses for track", e);
                    setCourses([]);
                }
            } finally {
                if (isActive) {
                    setIsLoading(false);
                }
            }
        };

        loadCourses();

        return () => { isActive = false; };
    }, [selectedTrackId]);

    // Fetch Applied Events when currentUserId is available
    React.useEffect(() => {
        if (!currentUserId) return;

        const fetchAppliedEvents = async () => {
            const events = await ElearningService.getAppliedEvents(currentUserId);
            setAppliedEvents(events);
        };

        fetchAppliedEvents();
    }, [currentUserId]);

    // Retry function for the debug panel
    const handleRetry = () => {
        setTracks([]);
        setCourses([]);
        setSelectedTrackId('');
        setRetryCount(c => c + 1);
    };

    // --- Personalization (Dynamic Sorting) ---

    const sortedTracks = React.useMemo(() => {
        if (!tracks.length) return [];
        if (!userAnalysis?.diagnosisScores || Object.keys(userAnalysis.diagnosisScores).length === 0) return tracks;

        // 1. Determine User's Top Category
        const categories = { A: 0, B: 0, C: 0, D: 0, E: 0 };
        Object.entries(userAnalysis.diagnosisScores).forEach(([qId, score]) => {
            const id = Number(qId);
            if (id <= 10) categories.A += score;
            else if (id <= 20) categories.B += score;
            else if (id <= 30) categories.C += score;
            else if (id <= 40) categories.D += score;
            else categories.E += score;
        });

        const sortedCats = Object.entries(categories).sort((a, b) => b[1] - a[1]);
        const topCategory = sortedCats[0][0]; // 'A', 'B', 'C', 'D', or 'E'

        console.log('Dashboard: Personalizing for Category', topCategory);

        // 2. Sort Tracks based on affinity
        // A(Idea)/B(Active) -> Suggest DX (Planning/Leadership)
        // C(Steady)/E(Stoic) -> Suggest Web Engineer (Structure/Technical)
        const getScore = (track: any) => {
            const t = (track.title || '').toLowerCase();
            let score = 0;
            // Base score is 0. Matches add points.
            if (topCategory === 'A' || topCategory === 'B') {
                if (t.includes('dx') || t.includes('企画') || t.includes('デザイン')) score += 10;
            }
            if (topCategory === 'C' || topCategory === 'E') {
                if (t.includes('web') || t.includes('エンジニア') || t.includes('開発')) score += 10;
            }
            // If Category D (Empathy) -> maybe preference? For now neutral.
            return score;
        };

        return [...tracks].sort((a, b) => getScore(b) - getScore(a));

    }, [tracks, userAnalysis]);

    // Update selectedTrackId if it's empty and we have tracks
    React.useEffect(() => {
        if (!selectedTrackId && sortedTracks.length > 0) {
            setSelectedTrackId(sortedTracks[0].id);
        }
    }, [sortedTracks, selectedTrackId]);



    // Calculate aggregated stats from the currently loaded course list
    // Note: To get global stats "overallProgress", we might need a separate API or fetch all. 
    // For now, let's calc stats based on the *active track* or leave 0 if not loaded.
    const allLessons = courses.flatMap((c: any) => c.lessons || []);
    const totalLessonsCount = allLessons.length;

    const completedCount = allLessons.filter(l => completedLessonIds.includes(l.id)).length;
    const overallProgress = totalLessonsCount > 0 ? Math.round((completedCount / totalLessonsCount) * 100) : 0;

    // Get recently viewed lessons info (from current track context)
    const recentlyViewedLessons = lastViewedLessonIds.map(id =>
        allLessons.find(l => l.id === id)
    ).filter(Boolean);

    const activeTrackRaw = sortedTracks.find(t => t.id === selectedTrackId);

    // Check if we need to hydrate courseIds
    // If courses are loaded and match this track, we use their IDs.
    // Since 'courses' state is always updated for the 'selectedTrackId', we can trust it matches the active track.
    const activeTrack = activeTrackRaw ? {
        ...activeTrackRaw,
        courseIds: courses.map((c: any) => c.id)
    } : undefined;

    console.log('Dashboard: Render', {
        selectedTrackId,
        activeTrackRaw: activeTrackRaw?.title,
        fetchedCourses: courses.length,
        activeTrackIds: activeTrack?.courseIds.length
    });

    // --- Derived State for Active Module (Course) ---
    const lastLesson = recentlyViewedLessons[0];

    const activeModule = lastLesson
        ? courses.find((c: any) => c.lessons && c.lessons.some((l: any) => l.id === lastLesson.id))
        : courses[0];

    const activeModuleLessons = activeModule?.lessons || [];
    const activeModuleCompletedCount = activeModuleLessons.filter((l: any) => completedLessonIds.includes(l.id)).length;
    const activeCourseProgress = activeModuleLessons.length > 0
        ? Math.round((activeModuleCompletedCount / activeModuleLessons.length) * 100)
        : 0;

    // Aliases for JSX compatibility
    const activeCourse = activeModule;

    return (
        <div className="min-h-screen bg-slate-50 pb-20 w-full min-w-0 overflow-x-hidden">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-orange-500 p-2 rounded-xl text-white shadow-lg shadow-orange-50">
                            <BookOpen size={24} />
                        </div>
                        <div>
                            <h1 className="text-xl font-black tracking-tighter text-slate-900 leading-none">クリエット部活</h1>
                            <p className="text-[10px] font-bold text-orange-500 tracking-wide">やりたいを形に！</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
                {/* Stats Overview */}
                {/* Stats Overview */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Left: Upcoming Event */}
                    <div className="bg-white p-0 rounded-[2rem] border border-slate-200 shadow-sm relative overflow-hidden group flex flex-col aspect-video hover:shadow-xl transition-shadow">
                        {upcomingEvent ? (
                            <Link href="/reskill/events" className="flex flex-col h-full relative">
                                <div className="absolute inset-0">
                                    <img
                                        src={upcomingEvent.image_url || '/illustrations/dx_roadmap.png'}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                        alt=""
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                                </div>

                                <div className="absolute top-4 left-4">
                                    <span className="bg-orange-500 text-white text-[10px] font-black px-2 py-1 rounded shadow-lg backdrop-blur-md">
                                        NEW EVENT
                                    </span>
                                </div>

                                <div className="absolute top-4 right-4 text-white/80 group-hover:text-white transition-colors">
                                    <ArrowRight size={24} />
                                </div>

                                <div className="absolute bottom-0 left-0 right-0 p-5 text-white flex flex-col justify-end h-full pointer-events-none">
                                    <div className="flex items-center gap-3 text-[10px] font-bold text-white/80 mb-1">
                                        <span className="flex items-center gap-1">
                                            <Calendar size={12} className="text-orange-300" />
                                            {new Date(upcomingEvent.start_at).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric', weekday: 'short' })}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <MapPin size={12} className="text-orange-300" />
                                            {upcomingEvent.event_type === 'webinar' ? 'オンライン' : upcomingEvent.location}
                                        </span>
                                    </div>

                                    <h3 className="text-lg font-black leading-tight line-clamp-2 mb-2 group-hover:text-orange-100 transition-colors text-shadow-sm">
                                        {upcomingEvent.title}
                                    </h3>

                                    <div className="flex items-center gap-2 text-xs font-bold text-white/60">
                                        <div className="w-5 h-5 rounded-full bg-slate-700 border border-slate-600 overflow-hidden flex items-center justify-center shrink-0">
                                            {upcomingEvent.instructor?.image_url ? (
                                                <img src={upcomingEvent.instructor.image_url} className="w-full h-full object-cover" alt="" />
                                            ) : (
                                                <Users size={12} className="text-slate-400" />
                                            )}
                                        </div>
                                        <span>{upcomingEvent.instructor?.display_name || '講師未定'}</span>
                                    </div>
                                </div>
                            </Link>
                        ) : (
                            <div className="p-6 flex flex-col justify-between h-full relative">
                                <div className="absolute right-[-10%] top-[-10%] text-orange-50 opacity-50 group-hover:scale-110 transition-transform">
                                    <Award size={140} />
                                </div>
                                <div className="relative z-10">
                                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">全体の進捗</span>
                                    <div className="flex items-end gap-2 mt-2">
                                        <span className="text-5xl font-black text-slate-900">{overallProgress}%</span>
                                        <span className="text-slate-400 font-bold mb-1">達成</span>
                                    </div>
                                    <div className="mt-4 h-3 bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-orange-500 rounded-full transition-all duration-1000"
                                            style={{ width: `${overallProgress}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Middle: Currently Learning */}
                    <div className="bg-slate-900 p-6 rounded-[2rem] shadow-xl relative overflow-hidden group text-white hover:shadow-2xl hover:shadow-orange-800/20 transition-all">
                        <div className="absolute right-[-10%] top-[-10%] text-white/5 group-hover:scale-110 transition-transform">
                            <Zap size={140} />
                        </div>
                        <div className="relative z-10 h-full flex flex-col justify-between">
                            <div>
                                <span className="text-xs font-black text-white/50 uppercase tracking-widest">
                                    {activeCourseProgress > 0 ? '受講中のコース' : '新しく始める'}
                                </span>
                                <h3 className="text-xl md:text-2xl font-black mt-2 leading-tight line-clamp-2">
                                    {activeCourse?.title || "未経験から学ぶエンジニアの道"}
                                </h3>
                                {activeCourseProgress > 0 && (
                                    <div className="mt-4 flex items-center gap-3">
                                        <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden">
                                            <div className="h-full bg-orange-300 rounded-full" style={{ width: `${activeCourseProgress}%` }} />
                                        </div>
                                        <span className="text-[10px] font-black text-orange-300">{activeCourseProgress}%</span>
                                    </div>
                                )}
                            </div>
                            <Link
                                href={lastLesson ? `/reskill/lesson/${lastLesson.id}` : `/reskill/course/${activeCourse?.id}`}
                                className="mt-6 bg-orange-400 hover:bg-orange-300 text-white font-black py-3 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-orange-400/20"
                            >
                                {activeCourseProgress > 0 ? '学習を再開する' : 'コースを見る'} <PlayCircle size={20} />
                            </Link>
                        </div>
                    </div>

                    {/* Right: Completed Steps */}
                    <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-lg transition-all relative overflow-hidden">
                        <div className="absolute right-[-5%] bottom-[-10%] text-slate-50 opacity-80 pointer-events-none">
                            <CheckCircle2 size={100} />
                        </div>
                        <div>
                            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">完了したステップ</span>
                            <div className="flex items-center gap-4 mt-2">
                                <div className="text-5xl font-black text-slate-900">{completedCount}</div>
                                <div className="text-slate-400 font-bold leading-tight">
                                    lessons<br />completed
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 self-start px-3 py-1.5 rounded-full mt-4 z-10">
                            <TrendingUp size={14} />
                            継続は力なり！
                        </div>
                    </div>
                </section>

                {/* My Learning / Applied Events Section */}
                {(appliedEvents.length > 0 || recentlyViewedLessons.length > 0) && (
                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                                <BookOpen className="text-orange-400" />
                                マイ学習リスト
                            </h2>
                        </div>

                        <div className="space-y-8">
                            {/* Applied Events */}
                            {appliedEvents.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-black text-slate-500 mb-3 flex items-center gap-2">
                                        <Calendar size={14} /> 申し込み済みのイベント
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {appliedEvents.map((app: any) => {
                                            const event = app.event;
                                            if (!event) return null;
                                            const eventDate = new Date(event.start_at);
                                            const isPast = eventDate < new Date();

                                            return (
                                                <Link
                                                    href={`/reskill/events`}
                                                    key={app.id}
                                                    className={`
                                                        bg-white border rounded-xl p-4 flex gap-4 transition-all hover:shadow-md group
                                                        ${isPast
                                                            ? (app.attended ? 'border-emerald-100 opacity-90' : 'border-slate-100 opacity-60 bg-slate-50/50')
                                                            : 'border-orange-50 shadow-sm'
                                                        }
                                                    `}
                                                >
                                                    <div className="w-20 h-20 rounded-lg bg-slate-100 shrink-0 overflow-hidden relative">
                                                        {event.image_url ? (
                                                            <img src={event.image_url} className={`w-full h-full object-cover ${isPast && !app.attended ? 'grayscale' : ''}`} alt="" />
                                                        ) : (
                                                            <div className="flex items-center justify-center h-full text-slate-300">
                                                                <Calendar size={24} />
                                                            </div>
                                                        )}
                                                        {isPast && (
                                                            <div className="absolute inset-0 bg-slate-900/10 flex items-center justify-center">
                                                                {app.attended ? (
                                                                    <span className="text-[10px] font-black text-white bg-emerald-600/90 px-2 py-0.5 rounded shadow-sm">出席確認済</span>
                                                                ) : (
                                                                    <span className="text-[10px] font-black text-white bg-slate-600/80 px-2 py-0.5 rounded">終了</span>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${event.event_type === 'webinar' ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'
                                                                }`}>
                                                                {event.event_type === 'webinar' ? 'オンライン' : '現地開催'}
                                                            </span>
                                                            <span className="text-[10px] text-slate-400 font-medium">
                                                                {eventDate.toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                        <h4 className={`text-sm font-black text-slate-800 line-clamp-2 group-hover:text-orange-500 transition-colors mb-1 ${isPast && !app.attended ? 'text-slate-500' : ''}`}>
                                                            {event.title}
                                                        </h4>
                                                        {isPast ? (
                                                            app.attended ? (
                                                                <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-bold">
                                                                    <CheckCircle2 size={10} /> 出席済み
                                                                </div>
                                                            ) : (
                                                                <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold">
                                                                    <XCircle size={10} /> 未出席/欠席
                                                                </div>
                                                            )
                                                        ) : (
                                                            <div className="flex items-center gap-1 text-[10px] text-orange-400 font-bold">
                                                                <CheckCircle2 size={10} /> 申し込み済み
                                                            </div>
                                                        )}
                                                    </div>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Recently Viewed (Existing logic moved/referenced here) */}
                            {recentlyViewedLessons.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-black text-slate-500 mb-3 flex items-center gap-2 mt-6">
                                        <MonitorPlay size={14} /> 受講中のコース・レッスン
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {recentlyViewedLessons.map((lesson: any) => {
                                            // Code from RecentlyViewedSection inlined or reused
                                            const module = courses.find((c: any) => c.lessons && c.lessons.some((l: any) => l.id === lesson.id));
                                            const youtubeId = getYoutubeId(lesson.url);
                                            const thumbnail = youtubeId
                                                ? `https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`
                                                : module?.thumbnail_url || activeTrack?.image || '/illustrations/dx_roadmap.png';

                                            return (
                                                <div
                                                    key={lesson.id}
                                                    className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all flex flex-col"
                                                >
                                                    <div className="aspect-video bg-slate-100 relative overflow-hidden">
                                                        <img
                                                            src={thumbnail}
                                                            alt={lesson.title}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                        />
                                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                                                        <Link href={`/reskill/lesson/${lesson.id}`} className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                                                                <Play size={20} className="text-slate-900 ml-1" fill="currentColor" />
                                                            </div>
                                                        </Link>
                                                        <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-md text-white text-[10px] font-black px-2 py-0.5 rounded">
                                                            {lesson.duration || '0:00'}
                                                        </div>
                                                    </div>
                                                    <Link href={`/reskill/lesson/${lesson.id}`} className="p-4 flex-1 flex flex-col px-4 pb-4 pt-3">
                                                        <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest line-clamp-1 mb-1">{module?.title}</span>
                                                        <h4 className="text-sm font-black text-slate-800 line-clamp-2 group-hover:text-orange-500 transition-colors">
                                                            {lesson.title}
                                                        </h4>
                                                    </Link>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>
                )}

                {/* Main Track Roadmap (Top Level Curriculum) */}

                {/* Curriculum Selection Tabs */}
                <section>
                    <div className="flex items-center gap-4 mb-6 overflow-x-auto pb-2 pl-4 hide-scrollbar">
                        {sortedTracks.map((track: any) => {
                            const isSelected = track.id === selectedTrackId;
                            return (
                                <button
                                    key={track.id}
                                    onClick={() => setSelectedTrackId(track.id)}
                                    className={`
                                        flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-sm whitespace-nowrap transition-all
                                        ${isSelected
                                            ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20 scale-105'
                                            : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-200'}
                                    `}
                                >
                                    <Layers size={16} className={isSelected ? 'text-orange-300' : 'text-slate-300'} />
                                    {track.title}
                                </button>
                            )
                        })}
                    </div>

                    {activeTrack && courses.length > 0 ? (
                        <section className="bg-white/50 backdrop-blur-sm rounded-[3rem] border border-white/50 shadow-xl overflow-hidden relative">
                            <div className="py-8">
                                <TrackRoadmapView
                                    track={activeTrack}
                                    courses={courses} // Pass all modules
                                    completedLessonIds={completedLessonIds}
                                    onCourseSelect={(courseId) => window.location.href = `/reskill/course/${courseId}`}
                                />
                            </div>
                        </section>
                    ) : (
                        <div className="py-12 text-center bg-white rounded-[3rem] border border-slate-200 border-dashed">
                            <p className="text-slate-400 font-bold">このカリキュラムにはまだコースが登録されていません。</p>
                        </div>
                    )}
                </section>



                {/* Club Activity Roadmap Section */}
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-indigo-100">
                            <Map size={20} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-slate-800 tracking-tight">部活ロードマップ</h2>
                            <p className="text-sm text-slate-500 font-bold">入門から専門まで、自分のペースで学ぼう</p>
                        </div>
                    </div>

                    {/* Common Intro Path */}
                    <div className="bg-white rounded-[2rem] border border-slate-200 p-6 mb-4 shadow-sm">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="bg-emerald-100 text-emerald-700 text-xs font-black px-3 py-1 rounded-full">STEP 0 — 共通入門</span>
                            <span className="text-xs text-slate-400 font-bold">全員まずここから</span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {[
                                { label: 'Scratch', desc: 'ビジュアルプログラミング', icon: <Cpu size={20} />, color: 'bg-orange-50 text-orange-600 border-orange-100', href: 'https://scratch.mit.edu' },
                                { label: 'Canva', desc: 'デザイン・スライド作成', icon: <Palette size={20} />, color: 'bg-violet-50 text-violet-600 border-violet-100', href: 'https://www.canva.com' },
                                { label: 'Google Workspace', desc: 'ドキュメント・スプレッドシート', icon: <Globe size={20} />, color: 'bg-orange-50 text-orange-500 border-orange-50', href: 'https://edu.google.com' },
                                { label: 'タイピング練習', desc: 'キーボード基礎', icon: <Code size={20} />, color: 'bg-slate-50 text-slate-600 border-slate-200', href: 'https://e-typing.ne.jp' },
                            ].map((item) => (
                                <a
                                    key={item.label}
                                    href={item.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`group flex flex-col items-start gap-2 p-4 rounded-2xl border ${item.color} hover:shadow-md transition-all`}
                                >
                                    <div className="flex items-center justify-between w-full">
                                        {item.icon}
                                        <ExternalLink size={12} className="opacity-40 group-hover:opacity-80 transition-opacity" />
                                    </div>
                                    <div>
                                        <p className="font-black text-sm leading-none mb-1">{item.label}</p>
                                        <p className="text-[10px] font-bold opacity-60">{item.desc}</p>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Individual Roadmaps */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                            {
                                track: 'Webデザイン・HP制作',
                                color: 'from-pink-500 to-rose-500',
                                bg: 'bg-rose-50 border-rose-100',
                                steps: ['HTML/CSS基礎', 'Canvaデザイン', 'Google Sites', 'WordPress入門'],
                                links: [
                                    { label: 'Progate HTML', href: 'https://prog-8.com/courses/html' },
                                    { label: 'MDN Web Docs', href: 'https://developer.mozilla.org/ja/' },
                                ],
                                icon: <Globe size={18} />,
                            },
                            {
                                track: 'プログラミング',
                                color: 'from-orange-400 to-indigo-500',
                                bg: 'bg-orange-50 border-orange-50',
                                steps: ['Scratch', 'Python入門', 'Google Apps Script', 'Webアプリ開発'],
                                links: [
                                    { label: 'Progate Python', href: 'https://prog-8.com/courses/python' },
                                    { label: 'GAS公式ドキュメント', href: 'https://developers.google.com/apps-script' },
                                ],
                                icon: <Code size={18} />,
                            },
                            {
                                track: 'AI・データ活用',
                                color: 'from-violet-500 to-purple-500',
                                bg: 'bg-violet-50 border-violet-100',
                                steps: ['AIツール体験', 'ChatGPT活用', 'スプレッドシート分析', 'AIプログラミング'],
                                links: [
                                    { label: 'Google AI Essentials', href: 'https://grow.google/intl/ja_jp/' },
                                    { label: 'Microsoft AI Skills', href: 'https://learn.microsoft.com/ja-jp/ai/' },
                                ],
                                icon: <Bot size={18} />,
                            },
                        ].map((roadmap) => (
                            <div key={roadmap.track} className={`rounded-2xl border p-5 ${roadmap.bg} hover:shadow-lg transition-all`}>
                                <div className={`inline-flex items-center gap-2 bg-gradient-to-r ${roadmap.color} text-white text-xs font-black px-3 py-1.5 rounded-xl mb-4 shadow-sm`}>
                                    {roadmap.icon}
                                    {roadmap.track}
                                </div>

                                {/* Steps */}
                                <div className="flex flex-col gap-2 mb-4">
                                    {roadmap.steps.map((step, idx) => (
                                        <div key={step} className="flex items-center gap-3">
                                            <span className="w-5 h-5 rounded-full bg-white/80 border border-slate-200 flex items-center justify-center text-[10px] font-black text-slate-500 shrink-0 shadow-sm">
                                                {idx + 1}
                                            </span>
                                            <span className="text-xs font-bold text-slate-700">{step}</span>
                                            {idx < roadmap.steps.length - 1 && (
                                                <div className="w-px h-3 bg-slate-200 ml-auto" />
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {/* Free materials links */}
                                <div className="border-t border-white/60 pt-3 space-y-1.5">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">無料教材</p>
                                    {roadmap.links.map((link) => (
                                        <a
                                            key={link.label}
                                            href={link.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-orange-500 transition-colors group"
                                        >
                                            <ExternalLink size={10} className="shrink-0 opacity-50 group-hover:opacity-100" />
                                            {link.label}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Recommended Courses */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                            <Star className="text-amber-500" fill="currentColor" />
                            すべてのコース
                        </h2>
                        <Link href="/reskill/courses" className="text-orange-500 font-bold text-sm hover:underline flex items-center gap-1">
                            すべて見る <ChevronRight size={16} />
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {allModules.map((course) => {
                            // Determine recommendation tag
                            const courseCategory = (course.title || '').toLowerCase();
                            const isDiagnosisRecommended = (() => {
                                if (!userAnalysis?.diagnosisScores || Object.keys(userAnalysis.diagnosisScores).length === 0) return false;

                                // Re-calc top category (simplified for render)
                                const categories = { A: 0, B: 0, C: 0, D: 0, E: 0 };
                                Object.entries(userAnalysis.diagnosisScores).forEach(([qId, score]) => {
                                    const id = Number(qId);
                                    if (id <= 10) categories.A += score;
                                    else if (id <= 20) categories.B += score;
                                    else if (id <= 30) categories.C += score;
                                    else if (id <= 40) categories.D += score;
                                    else categories.E += score;
                                });
                                const sortedCats = Object.entries(categories).sort((a, b) => b[1] - a[1]);
                                const topCategory = sortedCats[0][0];

                                if (topCategory === 'A' || topCategory === 'B') {
                                    if (courseCategory.includes('dx') || courseCategory.includes('企画') || courseCategory.includes('デザイン')) return true;
                                }
                                if (topCategory === 'C' || topCategory === 'E') {
                                    if (courseCategory.includes('web') || courseCategory.includes('エンジニア') || courseCategory.includes('開発')) return true;
                                }
                                return false;
                            })();

                            const isPopular = (course.viewCount || 0) >= 10;
                            const isAdminRecommended = course.tags && (course.tags.includes('Recommended') || course.tags.includes('recommended'));

                            return (
                                <Link
                                    key={course.id}
                                    href={`/reskill/course/${course.id}`}
                                    className="group flex flex-row bg-white rounded-[2rem] border border-slate-200 overflow-hidden hover:shadow-2xl transition-all h-full relative"
                                >
                                    <div className="w-1/3 md:w-2/5 relative shrink-0">
                                        <img src={getCourseImage(course)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={course.title} />
                                        <div className="absolute top-2 left-2 md:top-4 md:left-4">
                                            <span className="bg-white/90 backdrop-blur px-3 py-1.5 rounded-full text-[10px] font-black text-slate-800 shadow-sm border border-slate-100">
                                                {course.category}
                                            </span>
                                        </div>
                                        <div className="absolute top-2 right-2 md:top-4 md:right-4 z-20 flex flex-col gap-1 md:gap-2 items-end">
                                            {isDiagnosisRecommended && (
                                                <span className="bg-amber-400 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg border border-amber-300 flex items-center gap-1">
                                                    <Sparkles size={12} fill="currentColor" /> あなたにおすすめ
                                                </span>
                                            )}
                                            {isPopular && (
                                                <span className="bg-rose-500 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg border border-rose-400 flex items-center gap-1">
                                                    <Flame size={12} fill="currentColor" /> 人気
                                                </span>
                                            )}
                                            {isAdminRecommended && (
                                                <span className="bg-orange-500 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg border border-orange-400 flex items-center gap-1">
                                                    <Award size={12} fill="currentColor" /> クリエット部活推奨
                                                </span>
                                            )}
                                            {/* Progress Badge Merged Here */}
                                            {(() => {
                                                const lessons = course.lessons || course.curriculums?.flatMap((c: any) => c.lessons) || [];
                                                const completed = lessons.filter((l: any) => completedLessonIds.includes(l.id)).length;
                                                const progress = lessons.length > 0 ? Math.round((completed / lessons.length) * 100) : 0;
                                                if (progress > 0) {
                                                    return (
                                                        <div className="flex flex-col items-end mt-1">
                                                            <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100 shadow-lg">
                                                                <CheckCircle2 size={12} className="text-emerald-500" />
                                                                <span className="text-[10px] font-black">{progress}% Complete</span>
                                                            </div>
                                                            {/* Progress Bar within container if needed, or simplified code */}
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            })()}
                                        </div>
                                    </div>
                                    <div className="flex-1 p-3 md:p-8 flex flex-col justify-between relative min-w-0">

                                        <div>
                                            <div className="flex items-center gap-2 mb-3 flex-wrap">
                                                <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${course.level === '初級' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                                                    'bg-orange-50 text-orange-500 border border-orange-50'
                                                    }`}>
                                                    {course.level}
                                                </span>
                                                <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                                                    <Clock size={12} /> {course.totalDuration || '0分'}
                                                </span>
                                            </div>
                                            {/* Title Area */}
                                            <h3 className="text-sm md:text-2xl font-black text-slate-800 leading-tight mb-1.5 md:mb-3 group-hover:text-orange-500 transition-colors break-words line-clamp-2 md:line-clamp-none">
                                                {course.title}
                                            </h3>
                                            <p className="text-xs md:text-sm text-slate-500 font-medium line-clamp-2 mb-6">
                                                {course.description}
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between border-t border-slate-50 pt-4">
                                            <div className="flex items-center gap-3">
                                                {course.instructor ? (
                                                    <>
                                                        <img src={course.instructor.image} className="w-10 h-10 rounded-full border-2 border-white shadow-md object-cover" alt="" />
                                                        <div>
                                                            <p className="text-xs font-black text-slate-800 leading-none">{course.instructor.name}</p>
                                                            <p className="text-[10px] font-bold text-slate-400 mt-0.5">{course.instructor.role}</p>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        <div className="w-10 h-10 rounded-full border-2 border-white shadow-md bg-slate-100 flex items-center justify-center overflow-hidden">
                                                            <img src="/eis_logo_mark.png" className="w-8 h-8 object-contain" alt="" />
                                                        </div>
                                                        <div>
                                                            <p className="text-xs font-black text-slate-800 leading-none">クリエット部活</p>
                                                            <p className="text-[10px] font-bold text-slate-400 mt-0.5">Official Course</p>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 group-hover:bg-orange-500 group-hover:text-white transition-all">
                                                    <ArrowRight size={20} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </section>
            </main>

            {/* Bottom Nav Hint (for mobile style feel) */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-xl px-2 py-2 rounded-2xl border border-slate-200 shadow-2xl z-50 flex gap-1">
                <Link href="/reskill" className="flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-500 text-white font-black text-sm shadow-lg shadow-orange-50">
                    <Layout size={18} /> Dashboard
                </Link>
                <Link href="/reskill/courses" className="flex items-center gap-2 px-6 py-3 rounded-xl text-slate-400 hover:text-slate-600 font-black text-sm transition-colors">
                    <BookOpen size={18} /> Courses
                </Link>
                <Link href="/reskill/events" className="flex items-center gap-2 px-6 py-3 rounded-xl text-slate-400 hover:text-slate-600 font-black text-sm transition-colors">
                    <Calendar size={18} /> Events
                </Link>
                <Link href="/reskill/instructors" className="flex items-center gap-2 px-6 py-3 rounded-xl text-slate-400 hover:text-slate-600 font-black text-sm transition-colors">
                    <Users size={18} /> Teachers
                </Link>
                <Link href="/reskill/reflections" className="flex items-center gap-2 px-6 py-3 rounded-xl text-slate-400 hover:text-slate-600 font-black text-sm transition-colors">
                    <BookHeart size={18} /> 振り返り
                </Link>
                {(activeRole === 'admin' || activeRole === 'instructor') && (
                    <Link href="/reskill/management/participants" className="flex items-center gap-2 px-6 py-3 rounded-xl text-amber-600 hover:text-amber-700 font-black text-sm transition-colors">
                        <Users size={18} /> Management
                    </Link>
                )}
            </div>


        </div>
    );
}
