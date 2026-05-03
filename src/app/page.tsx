"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { GraduationCap, ArrowRight, BookOpen, Sparkles, Pencil } from "lucide-react";
import { useAppStore } from "@/lib/appStore";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const { authStatus, activeRole } = useAppStore();
  const router = useRouter();

  useEffect(() => {
    if (authStatus === "authenticated") {
      router.replace(activeRole === "admin" ? "/admin" : "/reskill");
    }
  }, [authStatus, activeRole]);

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-orange-100 rounded-full blur-3xl opacity-60" />
        <div className="absolute bottom-[-10%] left-[-5%] w-80 h-80 bg-amber-100 rounded-full blur-3xl opacity-60" />
      </div>

      <div className="relative z-10 w-full max-w-sm text-center">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-orange-500 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-orange-200">
            <GraduationCap size={40} />
          </div>
        </div>

        <p className="text-xs font-black text-orange-500 uppercase tracking-widest mb-2">CREAT BUKATSU</p>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-3 leading-tight">
          クリエット部活
        </h1>
        <p className="text-slate-500 font-bold text-base mb-10">
          やりたいを形に！
        </p>

        {/* Features */}
        <div className="space-y-3 mb-10 text-left">
          {[
            { icon: BookOpen, label: "コース動画で学ぶ", desc: "Canva・AI・プログラミング" },
            { icon: Pencil, label: "振り返りで定着", desc: "学んだことを記録しよう" },
            { icon: Sparkles, label: "つくる力を手に入れる", desc: "好きなことを形にしよう" },
          ].map(({ icon: Icon, label, desc }) => (
            <div key={label} className="flex items-center gap-4 bg-white rounded-2xl px-4 py-3 border border-slate-100 shadow-sm">
              <div className="w-9 h-9 bg-orange-50 rounded-xl flex items-center justify-center text-orange-500 shrink-0">
                <Icon size={18} />
              </div>
              <div>
                <p className="font-black text-slate-800 text-sm">{label}</p>
                <p className="text-slate-400 text-xs font-bold">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <Link
          href="/login"
          className="w-full flex items-center justify-center gap-2 bg-orange-500 text-white font-black py-4 px-6 rounded-2xl shadow-xl shadow-orange-200 hover:bg-orange-600 hover:-translate-y-0.5 transition-all active:scale-[0.98] group"
        >
          はじめる
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </Link>

        <p className="text-xs text-slate-300 font-bold mt-8">© 2026 クリエット部活</p>
      </div>
    </main>
  );
}
