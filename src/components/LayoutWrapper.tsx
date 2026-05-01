"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Layout as DashboardIcon, Building2, Search, Film, Heart, GraduationCap, FileEdit, UserCircle, LogOut, LogIn, Menu, MessageCircle, MessagesSquare, Map, Briefcase, TrendingUp, User, ShieldCheck, Settings, ClipboardList, PanelLeftClose, PanelLeftOpen, Loader2 } from 'lucide-react';
import { useAppStore } from '@/lib/appStore';
import MobileBottomNav from './MobileBottomNav';
import ScrollToTop from './ScrollToTop';
import { getFallbackAvatarUrl } from '@/lib/avatarUtils';
import { createClient } from '@/utils/supabase/client';
import { ErrorBoundary } from './ui/ErrorBoundary';
import pkg from '../../package.json';

interface NavItem {
    name: string;
    icon: any;
    href: string;
    badge?: number;
}

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);
    const [hasWorkspaces, setHasWorkspaces] = React.useState(false);
    const { users, interactions, currentUserId, chats, authStatus, activeRole, logout } = useAppStore();

    const isAdmin = activeRole === 'admin';

    const currentUser = users.find(u => u.id === currentUserId);
    const isAuthenticated = authStatus === 'authenticated';

    const router = useRouter();

    // Navigation items filtered by auth status
    const allNavItems: NavItem[] = [
        { name: 'クエスト情報', icon: Map, href: '/quests' },
        { name: '企業情報', icon: Building2, href: '/companies' },
        { name: '求人情報', icon: Briefcase, href: '/jobs' },
        { name: '動画で探す', icon: Film, href: '/reels' },
        { name: 'インタビューシップ', icon: ClipboardList, href: '/interviewship' },
        { name: '気になるリスト', icon: Heart, href: '/saved', badge: undefined },
        { name: 'メッセージ', icon: MessageCircle, href: '/messages', badge: undefined }, // Badge handled below
        { name: 'コミュニケーション', icon: MessagesSquare, href: '/communication' },
        { name: 'リスキル大学', icon: GraduationCap, href: '/reskill' },
        { name: '進捗確認', icon: TrendingUp, href: '/progress' },
        { name: 'ダッシュボード', icon: DashboardIcon, href: '/dashboard' },
        { name: 'プロフィール・設定', icon: Settings, href: '/mypage' },
        { name: '管理者画面', icon: ShieldCheck, href: '/admin' },
    ];

    const authOnlyRoutes = ['/saved', '/messages', '/communication', '/progress', '/mypage', '/dashboard', '/reskill', '/elearning'];

    const navItems = allNavItems.filter(item => {
        if (!isAuthenticated && authOnlyRoutes.includes(item.href)) return false;
        if (item.href === '/admin' && !isAdmin) return false;
        // コミュニケーションはWSメンバーまたは管理者のみ表示
        if (item.href === '/communication' && !hasWorkspaces && !isAdmin) return false;
        return true;
    });

    // Update message badge
    const messageItem = navItems.find(n => n.href === '/messages');
    if (messageItem && isAuthenticated) {
        const unreadCount = chats
            .filter(c => c.userId === currentUserId || c.companyId === currentUserId)
            .reduce((acc, chat) => acc + chat.messages.filter(m => m.senderId !== currentUserId && !m.isRead).length, 0);
        if (unreadCount > 0) messageItem.badge = unreadCount;
    }

    // Update saved/approach badge
    const savedItem = navItems.find(n => n.href === '/saved');
    if (savedItem && isAuthenticated) {
        const approachCount = interactions.filter(i =>
            i.toId === currentUserId && (i.type === 'like_user' || i.type === 'scout') && !i.isRead
        ).length;
        if (approachCount > 0) savedItem.badge = approachCount;
    }

    // Check if we are in Company Dashboard or Baby Base
    const isCompanyDashboard = pathname?.startsWith('/dashboard/company');
    const isAdminDashboard = pathname?.startsWith('/admin');
    const isInterviewshipAdmin = pathname?.startsWith('/interviewship-admin');
    const isBabyBase = pathname?.startsWith('/babybase');
    const isPublicPage = pathname === '/' || pathname === '/welcome' || pathname?.startsWith('/login') || pathname?.startsWith('/register/trial') || pathname?.startsWith('/register/full') || pathname?.startsWith('/auth/reset-password') || pathname?.startsWith('/interviewship/forms/') || pathname?.startsWith('/s/');
    const isCommunication = pathname?.startsWith('/communication');

    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    // Check if user has any communication workspaces
    React.useEffect(() => {
        if (isAuthenticated && mounted) {
            fetch('/api/communication/workspaces')
                .then(r => r.ok ? r.json() : { data: [] })
                .then(d => {
                    const ws = d.data ?? d.workspaces ?? d ?? [];
                    setHasWorkspaces(Array.isArray(ws) && ws.length > 0);
                })
                .catch(() => setHasWorkspaces(false));
        }
    }, [isAuthenticated, mounted]);

    React.useEffect(() => {
        // Sync logout across tabs
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'eis-app-store-v3') {
                try {
                    // Check if local storage was cleared or auth status changed to unauthenticated
                    // Simple check: if key is removed or value is null/empty
                    if (!e.newValue) {
                        window.location.href = '/';
                    } else {
                        // Deep check if needed, but usually removing the key implies logout
                        const state = JSON.parse(e.newValue);
                        if (state.state?.authStatus === 'unauthenticated' && authStatus === 'authenticated') {
                            window.location.href = '/';
                        }
                    }
                } catch (err) {
                    console.error('Storage sync error:', err);
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [authStatus]);

    React.useEffect(() => {
        // Strict Session Check on Focus/Navigation
        const checkSession = async () => {
            // Only check if we think we are authenticated
            if (authStatus === 'authenticated') {
                const supabase = createClient();
                try {
                    const { data: { session } } = await supabase.auth.getSession();

                    // If no session found server-side, forcing logout
                    if (!session) {
                        console.log('UI: Session invalid on focus/nav, forcing logout');

                        // 1. Reset State
                        await logout();

                        // 2. Clear LocalStorage
                        try {
                            localStorage.removeItem('eis-app-store-v3');
                        } catch (e) { }

                        // 3. Only redirect if on a protected route
                        // Current path check
                        const currentPath = window.location.pathname;
                        const isProtectedRoute = authOnlyRoutes.some(route => currentPath.startsWith(route));

                        if (isProtectedRoute) {
                            window.location.href = '/welcome';
                        } else {
                            // If on public page (like top /), just stay there as guest
                            // The state change (logout) will trigger re-render
                            // Remove router.refresh() to avoid infinite server request loops
                            console.log('Session expired on public page, switching to guest view');
                        }
                    }
                } catch (error: any) {
                    // Ignore AbortError which happens often in dev/strict mode
                    if (error.name === 'AbortError' || error.message?.includes('aborted')) {
                        return;
                    }
                    console.error('Session check failed:', error);
                }
            }
        };

        window.addEventListener('focus', checkSession);
        window.addEventListener('visibilitychange', checkSession);
        checkSession(); // Check immediately on mount/nav change

        return () => {
            window.removeEventListener('focus', checkSession);
            window.removeEventListener('visibilitychange', checkSession);
        };
        return () => {
            window.removeEventListener('focus', checkSession);
            window.removeEventListener('visibilitychange', checkSession);
        };
    }, [pathname, authStatus]);

    // Safety check: If authenticated but no user found, fetch users
    React.useEffect(() => {
        if (mounted && authStatus === 'authenticated' && !currentUser && !useAppStore.getState().isFetchingUsers) {
            console.log('LayoutWrapper: Authenticated but no user found, fetching users...');
            useAppStore.getState().fetchUsers();
        }
    }, [mounted, authStatus, currentUser]);

    const [isLoggingOut, setIsLoggingOut] = React.useState(false);

    const handleLogout = async () => {
        setIsLoggingOut(true);

        // 1. Clear local state immediately for instant feedback
        try {
            localStorage.removeItem('eis-app-store-v3');
        } catch (e) { /* ignore */ }

        // 2. Client-side signOut (fast)
        const supabase = createClient();
        supabase.auth.signOut().catch(() => { /* ignore */ });

        // 3. Server Action (fire-and-forget, don't await)
        import('@/app/actions/auth').then(m => m.logoutAction()).catch(() => { /* ignore */ });

        // 4. Redirect immediately
        window.location.href = '/';
    };

    // メニュー項目（PC/モバイル共通）
    const renderNavItems = (onClick?: () => void, collapsed?: boolean) => (
        <nav className={`flex-1 ${collapsed ? 'p-2' : 'p-4'} space-y-1 overflow-y-auto`}>
            {navItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        onClick={onClick}
                        title={collapsed ? item.name : undefined}
                        className={`relative flex items-center ${collapsed ? 'justify-center p-3' : 'gap-3 px-4 py-3'} rounded-xl text-sm font-bold transition-colors ${isActive ? 'bg-zinc-100 text-eis-navy' : 'text-zinc-500 hover:bg-zinc-50'}`}
                    >
                        <item.icon size={20} />
                        {!collapsed && item.name}
                        {mounted && item.badge && (
                            <span className={`${collapsed ? 'absolute -top-1 -right-1' : 'absolute right-4'} bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full`}>
                                {item.badge}
                            </span>
                        )}
                    </Link>
                );
            })}
        </nav>
    );

    if (isCompanyDashboard || isPublicPage || isBabyBase || isAdminDashboard || isInterviewshipAdmin) {
        return <ErrorBoundary>{children}</ErrorBoundary>;
    }

    return (
        <div className={`${isCommunication ? 'h-screen' : 'min-h-screen'} bg-zinc-50 flex flex-col md:flex-row`}>
            {/* PC Sidebar */}
            <aside className={`hidden md:flex ${isSidebarCollapsed ? 'w-16' : 'w-64'} shrink-0 bg-white border-r border-zinc-200 flex-col h-screen sticky top-0 transition-all duration-300`}>
                <div className={`${isSidebarCollapsed ? 'p-2' : 'px-4 py-4'} border-b border-zinc-100 flex items-center ${isSidebarCollapsed ? 'justify-center' : 'justify-between'}`}>
                    {isSidebarCollapsed ? (
                        <div className="relative w-full flex justify-center">
                            <Link href="/" className="hover:opacity-80 transition-opacity">
                                <img src="/eis_logo_mark.png" alt="EIS Logo" className="h-8 w-auto" />
                            </Link>
                            <button
                                onClick={() => setIsSidebarCollapsed(false)}
                                className="absolute -right-0.5 -bottom-1.5 text-zinc-500 hover:text-blue-500 transition-colors"
                                title="メニューを展開"
                            >
                                <span className="text-[8px] leading-none">▶</span>
                            </button>
                        </div>
                    ) : (
                        <Link href="/" className="flex items-center group">
                            <img src="/eis_logo_mark.png" alt="EIS Logo" className="h-9 w-auto group-hover:opacity-80 transition-opacity" />
                            <span className="font-black text-eis-navy text-lg ml-2 tracking-tighter group-hover:text-blue-600 transition-colors">Ehime Base</span>
                        </Link>
                    )}
                    <button
                        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                        className={`${isSidebarCollapsed ? 'hidden' : ''} p-1.5 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors`}
                        title="メニューを折りたたむ"
                    >
                        <PanelLeftClose size={18} />
                    </button>
                </div>

                {renderNavItems(undefined, isSidebarCollapsed)}

                <div className={`${isSidebarCollapsed ? 'px-2' : 'px-4'} pb-4`}>
                    {mounted && isAuthenticated ? (
                        <button
                            onClick={handleLogout}
                            disabled={isLoggingOut}
                            title={isSidebarCollapsed ? 'ログアウト' : undefined}
                            className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center p-3' : 'gap-3 px-4 py-3'} text-sm font-bold text-white bg-eis-navy rounded-xl hover:bg-slate-800 transition-colors shadow-sm cursor-pointer disabled:opacity-50`}
                        >
                            {isLoggingOut ? <Loader2 size={20} className="animate-spin" /> : <LogOut size={20} />}
                            {!isSidebarCollapsed && (isLoggingOut ? 'ログアウト中...' : 'ログアウト')}
                        </button>
                    ) : mounted ? (
                        <Link
                            href="/welcome"
                            title={isSidebarCollapsed ? 'ログイン' : undefined}
                            className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center p-3' : 'gap-3 px-4 py-3'} text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors shadow-sm`}
                        >
                            <LogIn size={20} />
                            {!isSidebarCollapsed && 'ログイン'}
                        </Link>
                    ) : (
                        <div className="w-full h-[46px] rounded-xl bg-slate-100 animate-pulse" />
                    )}
                </div>

                {mounted && isAuthenticated && (
                    <div className={`${isSidebarCollapsed ? 'p-2' : 'p-4'} border-t border-zinc-100 mt-auto bg-zinc-50/50`}>
                        {currentUser ? (
                            <Link href="/mypage" className={`flex items-center ${isSidebarCollapsed ? 'justify-center p-1' : 'gap-3 px-2 py-2'} hover:bg-white rounded-xl transition-all group`}>
                                <img
                                    src={currentUser?.image || getFallbackAvatarUrl(currentUser?.id || '', currentUser?.gender)}
                                    alt={currentUser?.name}
                                    className={`${isSidebarCollapsed ? 'w-8 h-8' : 'w-10 h-10'} rounded-full object-cover border border-zinc-200 shadow-sm`}
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        if (!target.getAttribute('data-error-tried')) {
                                            target.setAttribute('data-error-tried', 'true');
                                            target.src = getFallbackAvatarUrl(currentUser?.id || '', currentUser?.gender);
                                        } else {
                                            // Hide or keep silhouette if it already failed (local path shouldn't fail though)
                                            target.src = '/images/defaults/default_user_avatar.png';
                                        }
                                    }}
                                />
                                {!isSidebarCollapsed && (
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-zinc-700 group-hover:text-blue-600">{currentUser?.name}</span>
                                        <span className="text-[10px] text-zinc-400 font-bold">{currentUser?.university || '未設定'}</span>
                                    </div>
                                )}
                            </Link>
                        ) : (
                            <div className="flex items-center gap-3 px-2 py-2">
                                <div className="w-10 h-10 rounded-full bg-slate-200 animate-pulse" />
                                <div className="flex flex-col gap-1.5">
                                    <div className="h-3 w-24 bg-slate-200 rounded animate-pulse" />
                                    <div className="h-2 w-16 bg-slate-200 rounded animate-pulse" />
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Version */}
                <div className={`${isSidebarCollapsed ? 'px-2 py-1' : 'px-4 py-1'} text-center`}>
                    <span className="text-[10px] text-zinc-300 font-mono">v{pkg.version}</span>
                </div>
            </aside>

            {/* Mobile Header */}
            <header className={`mobile-header md:hidden ${isCommunication ? 'h-11' : 'h-16'} bg-white border-b border-zinc-100 flex items-center justify-between ${isCommunication ? 'px-3' : 'px-6'} sticky top-0 z-50 shrink-0`}>
                <button onClick={() => setIsMenuOpen(true)}>
                    <Menu className="text-zinc-600" size={isCommunication ? 20 : 24} />
                </button>
                <Link href="/" className="flex items-center">
                    <img src="/eis_logo_mark.png" alt="EIS Logo" className={`${isCommunication ? 'h-6' : 'h-8'} w-auto`} />
                    <span className={`font-black text-eis-navy ${isCommunication ? 'text-sm' : 'text-lg'} ml-1.5 tracking-tighter`}>Ehime Base</span>
                </Link>
                <div className="w-6" />
            </header>

            {/* Mobile Side Menu Overlay */}
            <div
                className={`fixed inset-0 bg-black/50 z-[100] transition-opacity duration-300 md:hidden ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={() => setIsMenuOpen(false)}
            >
                <div
                    className={`absolute left-0 top-0 bottom-0 w-64 bg-white transition-transform duration-300 ease-out flex flex-col ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'
                        }`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="p-6 border-b border-zinc-100 flex items-center justify-center">
                        <Link href="/" className="flex items-center" onClick={() => setIsMenuOpen(false)}>
                            <img src="/eis_logo_mark.png" alt="EIS Logo" className="h-8 w-auto" />
                            <span className="font-black text-eis-navy text-lg ml-2 tracking-tighter">Ehime Base</span>
                        </Link>
                    </div>
                    {renderNavItems(() => setIsMenuOpen(false))}

                    <div className="px-4 pb-4">
                        {mounted && isAuthenticated ? (
                            <button
                                onClick={() => {
                                    setIsMenuOpen(false);
                                    // Small timeout to allow menu close animation if desired, but better to just logout.
                                    handleLogout();
                                }}
                                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-white bg-eis-navy rounded-xl cursor-pointer"
                            >
                                <LogOut size={20} />
                                ログアウト
                            </button>
                        ) : mounted ? (
                            <Link
                                href="/welcome"
                                onClick={() => setIsMenuOpen(false)}
                                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-white bg-blue-600 rounded-xl"
                            >
                                <LogIn size={20} />
                                ログイン
                            </Link>
                        ) : (
                            <div className="w-full h-[46px] rounded-xl bg-slate-100 animate-pulse" />
                        )}
                    </div>

                    {mounted && isAuthenticated && (
                        <div className="p-4 border-t border-zinc-100 bg-zinc-50">
                            {currentUser ? (
                                <Link href="/mypage" className="flex items-center gap-3 px-2 py-2" onClick={() => setIsMenuOpen(false)}>
                                    <img
                                        src={currentUser?.image || getFallbackAvatarUrl(currentUser?.id || '', currentUser?.gender)}
                                        alt={currentUser?.name}
                                        className="w-10 h-10 rounded-full object-cover border border-zinc-200"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            if (!target.getAttribute('data-error-tried')) {
                                                target.setAttribute('data-error-tried', 'true');
                                                target.src = getFallbackAvatarUrl(currentUser?.id || '', currentUser?.gender);
                                            } else {
                                                target.src = '/images/defaults/default_user_avatar.png';
                                            }
                                        }}
                                    />
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-zinc-700">{currentUser?.name}</span>
                                        <span className="text-[10px] text-zinc-400 font-bold">{currentUser?.university || 'EIS User'}</span>
                                    </div>
                                </Link>
                            ) : (
                                <div className="flex items-center gap-3 px-2 py-2">
                                    <div className="w-10 h-10 rounded-full bg-slate-200 animate-pulse" />
                                    <div className="flex flex-col gap-1.5">
                                        <div className="h-3 w-24 bg-slate-200 rounded animate-pulse" />
                                        <div className="h-2 w-16 bg-slate-200 rounded animate-pulse" />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    {/* Version */}
                    <div className="px-4 py-1 text-center">
                        <span className="text-[10px] text-zinc-300 font-mono">v{pkg.version}</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className={`flex-1 min-w-0 ${isCommunication ? 'overflow-hidden' : 'pb-24 md:pb-0 min-h-screen'}`} style={isCommunication ? { height: 'calc(100dvh - 44px)' } : undefined}>
                <ErrorBoundary>{children}</ErrorBoundary>
            </main>

            {/* メッセージ・コミュニケーション画面ではScrollToTop非表示 */}
            {!isCommunication && !pathname?.startsWith('/messages') && <ScrollToTop />}
            {/* Mobile Bottom Nav (コミュニケーション画面では非表示) */}
            {!isCommunication && <MobileBottomNav />}
        </div>
    );
}
