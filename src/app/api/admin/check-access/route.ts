import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
    try {
        const supabase = await createClient();

        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ isAdmin: false });
        }

        const { data: profile } = await supabase
            .from('profiles')
            .select('user_type')
            .eq('id', user.id)
            .maybeSingle();

        return NextResponse.json({ isAdmin: profile?.user_type === 'admin' });
    } catch {
        return NextResponse.json({ isAdmin: false });
    }
}
