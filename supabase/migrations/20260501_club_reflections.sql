-- ============================================
-- 部活振り返り機能
-- Supabase ダッシュボード > SQL Editor で実行
-- ============================================

-- 振り返り投稿テーブル
CREATE TABLE IF NOT EXISTS club_reflections (
  id            UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       UUID        REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title         TEXT        NOT NULL,
  content       TEXT        NOT NULL,
  mood          TEXT        CHECK (mood IN ('great','good','neutral','tough','hard')) DEFAULT 'good',
  practice_date DATE        NOT NULL DEFAULT CURRENT_DATE,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- 管理者コメントテーブル
CREATE TABLE IF NOT EXISTS club_reflection_comments (
  id            UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  reflection_id UUID        REFERENCES club_reflections(id) ON DELETE CASCADE NOT NULL,
  user_id       UUID        REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content       TEXT        NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- RLS を有効化
ALTER TABLE club_reflections ENABLE ROW LEVEL SECURITY;
ALTER TABLE club_reflection_comments ENABLE ROW LEVEL SECURITY;

-- 振り返り: 本人は全操作可
CREATE POLICY "own_reflections_select" ON club_reflections FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "own_reflections_insert" ON club_reflections FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own_reflections_update" ON club_reflections FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "own_reflections_delete" ON club_reflections FOR DELETE USING (auth.uid() = user_id);

-- コメント: 本人の振り返りに紐づくコメントを閲覧可
CREATE POLICY "comments_select_own" ON club_reflection_comments
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM club_reflections WHERE id = reflection_id AND user_id = auth.uid())
  );

-- ※ Service Role (管理者側) は RLS をバイパスするため追加設定不要

-- updated_at 自動更新トリガー
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$;

CREATE TRIGGER club_reflections_updated_at
  BEFORE UPDATE ON club_reflections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
