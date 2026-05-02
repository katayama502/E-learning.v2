"use client";

import React, { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useAppStore } from '@/lib/appStore';
import { toast } from 'sonner';
import { GraduationCap, Loader2, ArrowRight, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
    const supabase = createClient();
    const { authStatus } = useAppStore();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    // 既にログイン済みならリダイレクト
    React.useEffect(() => {
        const check = async () => {
            if (authStatus === 'authenticated') {
                const { data: { session } } = await supabase.auth.getSession();
                if (session) {
                    const { data: profile } = await supabase
                        .from('profiles')
                        .select('user_type')
                        .eq('id', session.user.id)
                        .maybeSingle();
                    window.location.href = profile?.user_type === 'admin' ? '/admin' : '/reskill';
                }
            }
        };
        check();
    }, [authStatus]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data, error } = await supabase.auth.signInWithPassword({ email, password });

            if (error) {
                toast.error(
                    error.message.includes('Invalid login credentials')
                        ? 'メールアドレスまたはパスワードが正しくありません'
                        : 'ログインに失敗しました'
                );
                setLoading(false);
                return;
            }

            if (!data.user) {
                toast.error('ユーザー情報の取得に失敗しました');
                setLoading(false);
                return;
            }

            // プロフィールを取得してロールを確認
            const { data: profile } = await supabase
                .from('profiles')
                .select('user_type')
                .eq('id', data.user.id)
                .maybeSingle();

            const isAdmin = profile?.user_type === 'admin';

            // AppStore を更新
            useAppStore.getState().loginAs(
                isAdmin ? 'admin' : 'seeker',
                data.user.id
            );

            toast.success('ログインしました');
            window.location.href = isAdmin ? '/admin' : '/reskill';
        } catch (err) {
            console.error('Login error:', err);
            toast.error('エラーが発生しました');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-slate-50">
            {/* Left: Visual */}
            <div className="relative overflow-hidden bg-slate-900 lg:h-auto min-h-[240px] p-8 lg:p-12 flex flex-col justify-between">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-600 via-indigo-800 to-slate-900" />
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-orange-400 rounded-full blur-3xl opacity-20" />
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 bg-indigo-400 rounded-full blur-3xl opacity-20" />

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-white/10 backdrop-blur rounded-xl flex items-center justify-center">
                            <GraduationCap size={24} className="text-white" />
                        </div>
                        <span className="text-white font-black text-xl tracking-tight">e-ラーニング</span>
                    </div>
                </div>

                <div className="relative z-10 space-y-4 hidden lg:block">
                    <h1 className="text-4xl font-black text-white leading-tight tracking-tight">
                        学ぶことで、<br />未来を変えよう。
                    </h1>
                    <p className="text-white/60 font-bold text-sm leading-relaxed">
                        自分のペースで、どこからでも。<br />
                        ITスキルからAIまで、幅広いカリキュラムを提供します。
                    </p>
                </div>

                <p className="relative z-10 text-white/30 text-xs font-bold hidden lg:block">
                    © 2026 e-ラーニングシステム
                </p>
            </div>

            {/* Right: Form */}
            <div className="flex items-center justify-center p-6 sm:p-12 -mt-10 lg:mt-0 relative z-20">
                <div className="w-full max-w-md bg-white lg:bg-transparent p-8 lg:p-0 rounded-[2rem] lg:rounded-none shadow-xl lg:shadow-none">
                    <div className="mb-8 lg:text-left text-center">
                        <div className="lg:hidden w-16 h-16 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <GraduationCap size={32} />
                        </div>
                        <h2 className="text-2xl lg:text-3xl font-black text-slate-800 tracking-tight">ログイン</h2>
                        <p className="text-slate-500 font-bold text-sm mt-1">アカウント情報を入力してください</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <label className="text-sm font-black text-slate-700 block mb-1.5">メールアドレス</label>
                            <input
                                type="email" required value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="name@example.com"
                                className="w-full px-4 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-slate-800 outline-none focus:border-orange-300 focus:ring-4 focus:ring-orange-400/10 transition-all placeholder:text-slate-300"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-black text-slate-700 block mb-1.5">パスワード</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'} required value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full px-4 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-slate-800 outline-none focus:border-orange-300 focus:ring-4 focus:ring-orange-400/10 transition-all placeholder:text-slate-300 pr-12"
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            <div className="text-right mt-2">
                                <Link href="/auth/forgot-password"
                                    className="text-xs font-bold text-slate-400 hover:text-orange-500 transition-colors">
                                    パスワードをお忘れの方
                                </Link>
                            </div>
                        </div>

                        <button
                            type="submit" disabled={loading}
                            className="w-full py-4 bg-orange-500 text-white font-black rounded-2xl shadow-xl shadow-orange-100 hover:bg-orange-600 hover:shadow-2xl hover:-translate-y-0.5 transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2 group mt-2"
                        >
                            {loading
                                ? <Loader2 size={20} className="animate-spin" />
                                : <>ログインする <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>
                            }
                        </button>
                    </form>

                    <p className="text-xs text-slate-400 font-bold text-center mt-8">
                        アカウントをお持ちでない方は管理者にお問い合わせください
                    </p>
                </div>
            </div>
        </div>
    );
}
