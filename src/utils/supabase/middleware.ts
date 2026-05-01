import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        request.cookies.set(name, value)
                    )
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // IMPORTANT: Avoid writing any logic between createServerClient and
    // supabase.auth.getUser(). A simple mistake could make it very hard to debug
    // issues with users being randomly logged out.

    // Do not run getUser on auth callback to avoid interference with code exchange
    if (request.nextUrl.pathname.startsWith('/auth')) {
        return supabaseResponse
    }

    // 旧管理画面 /admin/interviewship/* は廃止 → /interviewship-admin/* にリダイレクト
    if (request.nextUrl.pathname.startsWith('/admin/interviewship')) {
        const newPath = request.nextUrl.pathname.replace('/admin/interviewship', '/interviewship-admin');
        const target = new URL(newPath + request.nextUrl.search, request.url);
        return NextResponse.redirect(target);
    }

    const pathname = request.nextUrl.pathname

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (
        !user &&
        !pathname.startsWith('/login')
    ) {
        // no user, potentially redirect to login page
        // for now we just return the response
    }

    // ===== インタビューシップ管理画面アクセスガード =====
    // /interviewship-admin/* は interviewship_admins テーブルにエントリがあるユーザーのみ
    if (pathname.startsWith('/interviewship-admin')) {
        if (!user) {
            const loginUrl = new URL('/login/interviewship-admin', request.url)
            loginUrl.searchParams.set('redirectTo', pathname)
            return NextResponse.redirect(loginUrl)
        }

        const { data: adminRow } = await supabase
            .from('interviewship_admins')
            .select('role')
            .eq('user_id', user.id)
            .maybeSingle()

        if (!adminRow) {
            const forbiddenUrl = new URL('/403', request.url)
            forbiddenUrl.searchParams.set('from', 'interviewship-admin')
            return NextResponse.redirect(forbiddenUrl)
        }
    }

    // ===== Ehime Base マスター管理画面アクセスガード =====
    // /admin/* は profiles.user_type = 'admin' のマスター管理者のみ
    // （インタビューシップ管理者は /interviewship-admin に限定）
    if (pathname.startsWith('/admin')) {
        if (!user) {
            const loginUrl = new URL('/login', request.url)
            loginUrl.searchParams.set('redirectTo', pathname)
            return NextResponse.redirect(loginUrl)
        }

        const { data: profileRow } = await supabase
            .from('profiles')
            .select('user_type')
            .eq('id', user.id)
            .maybeSingle()

        if (profileRow?.user_type !== 'admin') {
            return NextResponse.redirect(new URL('/403', request.url))
        }
    }

    // ===== 企業ダッシュボードのアクセス制限（access_tier ベース）=====
    // interviewship_only の企業は /dashboard/company/interviewship-profile
    // と /dashboard/company/account のみアクセス可能
    if (pathname.startsWith('/dashboard/company') && user) {
        // 許可ルート（interviewship_only でもアクセス可）
        const allowedForInterviewshipOnly = [
            '/dashboard/company/interviewship-profile',
            '/dashboard/company/account',
        ]
        const isAllowed = allowedForInterviewshipOnly.some(p => pathname.startsWith(p))

        if (!isAllowed) {
            // ユーザーが所属する組織の access_tier を取得
            const { data: membership } = await supabase
                .from('organization_members')
                .select('organization_id, organizations(access_tier)')
                .eq('user_id', user.id)
                .maybeSingle()

            const orgData = membership?.organizations as { access_tier?: string } | null
            if (orgData?.access_tier === 'interviewship_only') {
                return NextResponse.redirect(
                    new URL('/dashboard/company/interviewship-profile', request.url)
                )
            }
        }
    }

    // IMPORTANT: You *must* return the supabaseResponse object as it is. If you're
    // creating a new Response object with NextResponse.next() make sure to:
    // 1. Pass the request in it, like so:
    //    const myNewResponse = NextResponse.next({ request })
    // 2. Copy over the cookies, like so:
    //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
    // 3. Change the myNewResponse object to fit your needs, but avoid changing
    //    the cookies!
    // 4. Finally:
    //    return myNewResponse
    return supabaseResponse
}
