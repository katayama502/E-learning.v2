"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard, BookOpen, Calendar, Users, BookHeart,
    LogOut, GraduationCap, Menu, X, ShieldCheck, ChevronRight,
} from 'lucide-react';
import { useAppStore } from '@/lib/appStore';

const navItems = [
    { name: 'ダッシュボード', icon: LayoutDashboard, href: '/reskill' },
    { name: 'コース一覧', icon: BookOpen, href: '/reskill/courses' },
    { name: 'イベント', icon: Calendar, href: '/reskill/events' },
    { name: '先生一覧', icon: Users, href: '/reskill/instructors' },
    { name: '振り返り', icon: BookHeart, href: '/reskill/reflections' },
];

export default function ReskillLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { logout, activeRole } = useAppStore();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const isActive = (href: string) =>
        href === '/reskill'
            ? pathname === '/reskill'
            : pathname?.startsWith(href);

    const handleLogout = async () => {
        await logout();
        window.location.replace('/');
    };

    return (
        <div className="h-screen flex overflow-hidden bg-slate-50">
            {/* ── Desktop Sidebar ── */}
            <aside className="hidden md:flex flex-col w-60 bg-white border-r border-slate-100 shrink-0 shadow-sm">
                {/* Logo */}
                <div className="p-5 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white shrink-0 shadow-md shadow-orange-100">
                            <GraduationCap size={20} />
                        </div>
                        <div className="min-w-0">
                            <p className="font-black text-slate-900 leading-none text-sm tracking-tight">クリエット部活</p>
                            <p className="text-[10px] font-bold text-orange-500 mt-0.5">やりたいを形に！</p>
                        </div>
                    </div>
                </div>

                {/* Nav */}
                <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${
                                isActive(item.href)
                                    ? 'bg-orange-500 text-white shadow-md shadow-orange-100'
                                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                            }`}
                        >
                            <item.icon size={17} />
                            {item.name}
                        </Link>
                    ))}

                    {activeRole === 'admin' && (
                        <Link
                            href="/admin"
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-amber-600 hover:bg-amber-50 transition-all mt-2"
                        >
                            <ShieldCheck size={17} />
                            管理画面
                            <ChevronRight size={13} className="ml-auto opacity-50" />
                        </Link>
                    )}
                </nav>

                {/* Logout */}
                <div className="p-3 border-t border-slate-100">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-xl transition-all"
                    >
                        <LogOut size={17} />
                        ログアウト
                    </button>
                </div>
            </aside>

            {/* ── Content Area ── */}
            <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
                {/* Mobile Header */}
                <header className="md:hidden h-14 bg-white border-b border-slate-100 flex items-center justify-between px-4 shrink-0 shadow-sm">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white">
                            <GraduationCap size={16} />
                        </div>
                        <div>
                            <p className="font-black text-slate-900 text-sm leading-none">クリエット部活</p>
                            <p className="text-[9px] font-bold text-orange-500">やりたいを形に！</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setMobileMenuOpen(true)}
                        className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-slate-50 text-slate-600"
                    >
                        <Menu size={20} />
                    </button>
                </header>

                {/* Mobile Menu Overlay */}
                {mobileMenuOpen && (
                    <div className="md:hidden fixed inset-0 z-50 bg-black/30 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}>
                        <div
                            className="absolute right-0 top-0 bottom-0 w-64 bg-white shadow-2xl flex flex-col"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between p-5 border-b border-slate-100">
                                <p className="font-black text-slate-900">メニュー</p>
                                <button onClick={() => setMobileMenuOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-50">
                                    <X size={18} />
                                </button>
                            </div>
                            <nav className="flex-1 p-3 space-y-0.5">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-bold transition-all ${
                                            isActive(item.href)
                                                ? 'bg-orange-500 text-white'
                                                : 'text-slate-600 hover:bg-slate-50'
                                        }`}
                                    >
                                        <item.icon size={17} />
                                        {item.name}
                                    </Link>
                                ))}
                                {activeRole === 'admin' && (
                                    <Link
                                        href="/admin"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-bold text-amber-600 hover:bg-amber-50 transition-all"
                                    >
                                        <ShieldCheck size={17} />
                                        管理画面
                                    </Link>
                                )}
                            </nav>
                            <div className="p-3 border-t border-slate-100">
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-3 py-3 text-sm font-bold text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-xl"
                                >
                                    <LogOut size={17} />
                                    ログアウト
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
