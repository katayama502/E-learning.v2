-- ============================================
-- 部活動向け 中学生教材 YouTube コンテンツ追加
-- STEP 0 + 3トラック / 12モジュール / 25レッスン
-- Supabase ダッシュボード > SQL Editor で実行
-- ============================================

-- ──────────────────────────────────────────
-- STEP 0: 共通入門（全員受講）
-- ──────────────────────────────────────────
INSERT INTO courses (id, title, description, category, level, order_index, is_published)
VALUES (
    'aaaaaaaa-0000-0000-0000-000000000001',
    'STEP 0 共通入門',
    'Scratch・Canva・Googleワークスペースなど、部活で使うツールの基礎を学びます',
    'Track', '初級', 0, true
) ON CONFLICT (id) DO NOTHING;

-- Module 1: Scratch入門
INSERT INTO course_curriculums (id, course_id, title, description, order_index)
VALUES (
    'bbbbbbbb-0000-0000-0000-000000000001',
    'aaaaaaaa-0000-0000-0000-000000000001',
    'Scratch入門',
    'ビジュアルプログラミングでプログラミングの基礎を学ぼう',
    1
) ON CONFLICT (id) DO NOTHING;

INSERT INTO course_lessons (id, curriculum_id, title, description, youtube_url, type, order_index)
VALUES
(
    'cccccccc-0000-0000-0000-000000000001',
    'bbbbbbbb-0000-0000-0000-000000000001',
    '【中学生のための】Scratch入門① 初期設定と基本操作',
    'Scratchのアカウント作成から基本操作まで丁寧に解説。中学生向けのプログラミング入門。',
    'https://www.youtube.com/watch?v=B8T3GpO3k90',
    'video', 1
),
(
    'cccccccc-0000-0000-0000-000000000002',
    'bbbbbbbb-0000-0000-0000-000000000001',
    'はじめてのScratchプログラミング入門 ─ 基本と使い方',
    'スクラッチの基本操作からキャラクター動作・ゲーム制作まで解説します。',
    'https://www.youtube.com/watch?v=awf_cM1UJLk',
    'video', 2
)
ON CONFLICT (id) DO NOTHING;

-- Module 2: Canva入門
INSERT INTO course_curriculums (id, course_id, title, description, order_index)
VALUES (
    'bbbbbbbb-0000-0000-0000-000000000002',
    'aaaaaaaa-0000-0000-0000-000000000001',
    'Canva入門',
    'デザインやスライドを無料で作れるCanvaの使い方を基礎から学ぼう',
    2
) ON CONFLICT (id) DO NOTHING;

INSERT INTO course_lessons (id, curriculum_id, title, description, youtube_url, type, order_index)
VALUES
(
    'cccccccc-0000-0000-0000-000000000003',
    'bbbbbbbb-0000-0000-0000-000000000002',
    '超初心者OK！Canva使い方入門・基礎をわかりやすく解説',
    '最新版Canvaの使い方を初心者向けに丁寧に解説。テンプレート活用から画像編集まで。',
    'https://www.youtube.com/watch?v=wVf1wuIFH3A',
    'video', 1
),
(
    'cccccccc-0000-0000-0000-000000000004',
    'bbbbbbbb-0000-0000-0000-000000000002',
    '超初心者向け！Canvaの使い方・基礎をわかりやすく解説！（2024年最新版）',
    '日本公認のCanva専門家が基本操作を網羅的に解説。',
    'https://www.youtube.com/watch?v=7XzOsVxAi1M',
    'video', 2
)
ON CONFLICT (id) DO NOTHING;

-- Module 3: Googleワークスペース入門
INSERT INTO course_curriculums (id, course_id, title, description, order_index)
VALUES (
    'bbbbbbbb-0000-0000-0000-000000000003',
    'aaaaaaaa-0000-0000-0000-000000000001',
    'Googleワークスペース入門',
    'GoogleドキュメントとGoogleスプレッドシートの基本を身につけよう',
    3
) ON CONFLICT (id) DO NOTHING;

INSERT INTO course_lessons (id, curriculum_id, title, description, youtube_url, type, order_index)
VALUES
(
    'cccccccc-0000-0000-0000-000000000005',
    'bbbbbbbb-0000-0000-0000-000000000003',
    'Googleスプレッドシートの使い方・初心者入門講座【完全版】',
    'スプレッドシートの基本操作から関数・グラフまで、初心者向けに完全解説。',
    'https://www.youtube.com/watch?v=tbWD-VG35RM',
    'video', 1
),
(
    'cccccccc-0000-0000-0000-000000000006',
    'bbbbbbbb-0000-0000-0000-000000000003',
    'Googleスプレッドシートの使い方（初心者向け）集計・グラフ・関数',
    '集計・グラフ・関数の使い方を実例で丁寧に解説します。',
    'https://www.youtube.com/watch?v=rglDju_CsVM',
    'video', 2
)
ON CONFLICT (id) DO NOTHING;

-- ──────────────────────────────────────────
-- TRACK 1: Webデザイン・HP制作
-- ──────────────────────────────────────────
INSERT INTO courses (id, title, description, category, level, order_index, is_published)
VALUES (
    'aaaaaaaa-0000-0000-0000-000000000002',
    'Webデザイン・HP制作',
    'HTML/CSSを学び、CanvaやGoogle Sitesを使ってオリジナルWebサイトを作ろう',
    'Track', '初級', 1, true
) ON CONFLICT (id) DO NOTHING;

-- Module 4: Webデザイン概論
INSERT INTO course_curriculums (id, course_id, title, description, order_index)
VALUES (
    'bbbbbbbb-0000-0000-0000-000000000004',
    'aaaaaaaa-0000-0000-0000-000000000002',
    'Webデザイン概論',
    'Webデザインとは何か？どんな仕事があるのかを理解しよう',
    1
) ON CONFLICT (id) DO NOTHING;

INSERT INTO course_lessons (id, curriculum_id, title, description, youtube_url, type, order_index)
VALUES
(
    'cccccccc-0000-0000-0000-000000000007',
    'bbbbbbbb-0000-0000-0000-000000000004',
    '初心者向けWEBデザインの始め方「ゼロから完全解説」',
    'Webデザインの全体像・必要なスキル・学習ロードマップをゼロから解説。',
    'https://www.youtube.com/watch?v=FcLXoTBbycg',
    'video', 1
),
(
    'cccccccc-0000-0000-0000-000000000008',
    'bbbbbbbb-0000-0000-0000-000000000004',
    '【入門講座】Webデザインの作り方 Part.1',
    'ゼロからWebデザインを実践する入門講座シリーズ第1回。',
    'https://www.youtube.com/watch?v=ByBwonNGnTs',
    'video', 2
)
ON CONFLICT (id) DO NOTHING;

-- Module 5: HTML/CSS基礎
INSERT INTO course_curriculums (id, course_id, title, description, order_index)
VALUES (
    'bbbbbbbb-0000-0000-0000-000000000005',
    'aaaaaaaa-0000-0000-0000-000000000002',
    'HTML/CSS基礎',
    'Webページの構造を作るHTMLとデザインするCSSの基礎を学ぼう',
    2
) ON CONFLICT (id) DO NOTHING;

INSERT INTO course_lessons (id, curriculum_id, title, description, youtube_url, type, order_index)
VALUES
(
    'cccccccc-0000-0000-0000-000000000009',
    'bbbbbbbb-0000-0000-0000-000000000005',
    '宇宙一簡単なHTML/CSS入門講座！プログラミング初心者でもこれ1本でOK',
    '2025年版。HTML・CSSの基礎から実践まで、初心者に特化して徹底解説。',
    'https://www.youtube.com/watch?v=LXUlkEBLayU',
    'video', 1
),
(
    'cccccccc-0000-0000-0000-000000000010',
    'bbbbbbbb-0000-0000-0000-000000000005',
    '【最短最速】これ1本でHTML・CSS基礎を習得【永久保存版】',
    '効率重視でHTML・CSSの基礎を最短で身につける動画。',
    'https://www.youtube.com/watch?v=NNdEgCN1ZWo',
    'video', 2
)
ON CONFLICT (id) DO NOTHING;

-- Module 6: Canvaでデザイン制作
INSERT INTO course_curriculums (id, course_id, title, description, order_index)
VALUES (
    'bbbbbbbb-0000-0000-0000-000000000006',
    'aaaaaaaa-0000-0000-0000-000000000002',
    'Canvaでデザイン制作',
    'Canvaを使ってWebバナーやサイトのビジュアルを作ろう',
    3
) ON CONFLICT (id) DO NOTHING;

INSERT INTO course_lessons (id, curriculum_id, title, description, youtube_url, type, order_index)
VALUES
(
    'cccccccc-0000-0000-0000-000000000011',
    'bbbbbbbb-0000-0000-0000-000000000006',
    '初級者必見！Canvaの基本操作大全',
    'Canvaの基本操作を網羅的に解説。Webデザインに使えるテクニック満載。',
    'https://www.youtube.com/watch?v=zZHb3OlEKJ4',
    'video', 1
)
ON CONFLICT (id) DO NOTHING;

-- Module 7: Google Sitesでサイト公開
INSERT INTO course_curriculums (id, course_id, title, description, order_index)
VALUES (
    'bbbbbbbb-0000-0000-0000-000000000007',
    'aaaaaaaa-0000-0000-0000-000000000002',
    'Google Sitesでサイト公開',
    'コーディング不要でWebサイトを作成・公開できるGoogle Sitesを使いこなそう',
    4
) ON CONFLICT (id) DO NOTHING;

INSERT INTO course_lessons (id, curriculum_id, title, description, youtube_url, type, order_index)
VALUES
(
    'cccccccc-0000-0000-0000-000000000012',
    'bbbbbbbb-0000-0000-0000-000000000007',
    '【Google Sites】無料で簡単にウェブサイトが作成できるGoogleサイト',
    'Google Sitesの基本機能と共同編集の使い方を解説。',
    'https://www.youtube.com/watch?v=cP6sjDRJtRg',
    'video', 1
),
(
    'cccccccc-0000-0000-0000-000000000013',
    'bbbbbbbb-0000-0000-0000-000000000007',
    'Googleサイト 基本の使い方① ─ サイトはどう作り始めるの？',
    '画面を見ながらGoogleサイトの作り方の基本を解説。',
    'https://www.youtube.com/watch?v=tQh99AmR8cs',
    'video', 2
),
(
    'cccccccc-0000-0000-0000-000000000014',
    'bbbbbbbb-0000-0000-0000-000000000007',
    'Googleサイト 基本の使い方② ─ さまざまな機能でサイトを作ろう',
    'プレビュー・画像カルーセルなど応用機能を使ってサイトを仕上げる。',
    'https://www.youtube.com/watch?v=dEfcJ0K9jt4',
    'video', 3
)
ON CONFLICT (id) DO NOTHING;

-- ──────────────────────────────────────────
-- TRACK 2: プログラミング
-- ──────────────────────────────────────────
INSERT INTO courses (id, title, description, category, level, order_index, is_published)
VALUES (
    'aaaaaaaa-0000-0000-0000-000000000003',
    'プログラミング',
    'Scratch・Python・GASを使って、本格的なプログラミングを体験しよう',
    'Track', '初級〜中級', 2, true
) ON CONFLICT (id) DO NOTHING;

-- Module 8: Scratch発展
INSERT INTO course_curriculums (id, course_id, title, description, order_index)
VALUES (
    'bbbbbbbb-0000-0000-0000-000000000008',
    'aaaaaaaa-0000-0000-0000-000000000003',
    'Scratch発展',
    'ScratchでゲームやアニメーションなどScratch中級テクニックを学ぼう',
    1
) ON CONFLICT (id) DO NOTHING;

INSERT INTO course_lessons (id, curriculum_id, title, description, youtube_url, type, order_index)
VALUES
(
    'cccccccc-0000-0000-0000-000000000015',
    'bbbbbbbb-0000-0000-0000-000000000008',
    'はじめてのScratchプログラミング入門 ─ 基本と使い方（復習）',
    'Scratchの基本操作からゲーム制作まで。STEP 0の復習もかねて取り組もう。',
    'https://www.youtube.com/watch?v=awf_cM1UJLk',
    'video', 1
)
ON CONFLICT (id) DO NOTHING;

-- Module 9: Python入門
INSERT INTO course_curriculums (id, course_id, title, description, order_index)
VALUES (
    'bbbbbbbb-0000-0000-0000-000000000009',
    'aaaaaaaa-0000-0000-0000-000000000003',
    'Python入門',
    '世界で最も人気の言語Pythonを中学生でもわかるレベルから学ぼう',
    2
) ON CONFLICT (id) DO NOTHING;

INSERT INTO course_lessons (id, curriculum_id, title, description, youtube_url, type, order_index)
VALUES
(
    'cccccccc-0000-0000-0000-000000000016',
    'bbbbbbbb-0000-0000-0000-000000000009',
    '習得したい言語第1位！Pythonとは？｜中学生でもわかるPython入門',
    'Pythonとは何か・なぜ人気なのかから始まる中学生向けPython入門シリーズ第1回。',
    'https://www.youtube.com/watch?v=rPCm-v_W4Ng',
    'video', 1
),
(
    'cccccccc-0000-0000-0000-000000000017',
    'bbbbbbbb-0000-0000-0000-000000000009',
    '子どもPythonチャレンジ: Lesson1 はじめてのPython',
    '子ども向けに手を動かしながらPythonプログラミングを体験する入門動画。',
    'https://www.youtube.com/watch?v=2oJUkJF6DEs',
    'video', 2
)
ON CONFLICT (id) DO NOTHING;

-- Module 10: Google Apps Script入門
INSERT INTO course_curriculums (id, course_id, title, description, order_index)
VALUES (
    'bbbbbbbb-0000-0000-0000-000000000010',
    'aaaaaaaa-0000-0000-0000-000000000003',
    'Google Apps Script入門',
    'Googleサービスを自動化・カスタマイズできるGASをプログラミングで使いこなそう',
    3
) ON CONFLICT (id) DO NOTHING;

INSERT INTO course_lessons (id, curriculum_id, title, description, youtube_url, type, order_index)
VALUES
(
    'cccccccc-0000-0000-0000-000000000018',
    'bbbbbbbb-0000-0000-0000-000000000010',
    '【完全版】これ1本でGoogle Apps Script（GAS）の基礎を習得！',
    'GASの基本から実用的なスクリプト作成まで、初心者向けに速習。',
    'https://www.youtube.com/watch?v=w2r-Q2FabY0',
    'video', 1
),
(
    'cccccccc-0000-0000-0000-000000000019',
    'bbbbbbbb-0000-0000-0000-000000000010',
    'Google Apps Scriptの使い方｜GAS初心者が10分でプログラム実行',
    '10分でGASの最初のプログラムを実行するまでをわかりやすく解説。',
    'https://www.youtube.com/watch?v=bVHZlXkmzVU',
    'video', 2
)
ON CONFLICT (id) DO NOTHING;

-- ──────────────────────────────────────────
-- TRACK 3: AI・データ活用
-- ──────────────────────────────────────────
INSERT INTO courses (id, title, description, category, level, order_index, is_published)
VALUES (
    'aaaaaaaa-0000-0000-0000-000000000004',
    'AI・データ活用',
    'ChatGPT等のAIツールを体験し、スプレッドシートでデータ分析の基礎を学ぼう',
    'Track', '初級', 3, true
) ON CONFLICT (id) DO NOTHING;

-- Module 11: AIツール体験・ChatGPT入門
INSERT INTO course_curriculums (id, course_id, title, description, order_index)
VALUES (
    'bbbbbbbb-0000-0000-0000-000000000011',
    'aaaaaaaa-0000-0000-0000-000000000004',
    'AIツール体験・ChatGPT入門',
    'ChatGPTの使い方を学び、AIを日常や学習に活用する方法を体験しよう',
    1
) ON CONFLICT (id) DO NOTHING;

INSERT INTO course_lessons (id, curriculum_id, title, description, youtube_url, type, order_index)
VALUES
(
    'cccccccc-0000-0000-0000-000000000020',
    'bbbbbbbb-0000-0000-0000-000000000011',
    '【AI学習】ChatGPTとは？使い方や始め方、できることを紹介！',
    'AIとは何かから始まり、ChatGPTの基本的な使い方を中学生でもわかるように解説。',
    'https://www.youtube.com/watch?v=4cGUwFZavDk',
    'video', 1
),
(
    'cccccccc-0000-0000-0000-000000000021',
    'bbbbbbbb-0000-0000-0000-000000000011',
    '【2025年最新版】超初心者OK！ChatGPTの使い方・基礎をわかりやすく解説！',
    '2025年最新版。資料付きでChatGPTの基礎操作を丁寧に解説。',
    'https://www.youtube.com/watch?v=J9QdxiZb8P4',
    'video', 2
),
(
    'cccccccc-0000-0000-0000-000000000022',
    'bbbbbbbb-0000-0000-0000-000000000011',
    'ChatGPT 2025年最新入門 ─ 6つのステップで基礎から応用までマスター！',
    '6ステップで基礎から応用機能まで体系的に学べる保存版。',
    'https://www.youtube.com/watch?v=UIyokWUJHck',
    'video', 3
)
ON CONFLICT (id) DO NOTHING;

-- Module 12: スプレッドシートでデータ分析
INSERT INTO course_curriculums (id, course_id, title, description, order_index)
VALUES (
    'bbbbbbbb-0000-0000-0000-000000000012',
    'aaaaaaaa-0000-0000-0000-000000000004',
    'スプレッドシートでデータ分析',
    'Googleスプレッドシートでデータを集計・可視化・分析するスキルを身につけよう',
    2
) ON CONFLICT (id) DO NOTHING;

INSERT INTO course_lessons (id, curriculum_id, title, description, youtube_url, type, order_index)
VALUES
(
    'cccccccc-0000-0000-0000-000000000023',
    'bbbbbbbb-0000-0000-0000-000000000012',
    '1時間で覚えるGoogleスプレッドシートによるデータ分析・超入門！',
    'フィルタリングから回帰分析まで、データ分析の基礎を1時間で体験。',
    'https://www.youtube.com/watch?v=t4FLfC0-GJw',
    'video', 1
),
(
    'cccccccc-0000-0000-0000-000000000024',
    'bbbbbbbb-0000-0000-0000-000000000012',
    '【データ活用】ピボットテーブルの使い方 ─ 関数不要のデータ分析ツール',
    'ピボットテーブルを使えば関数なしで本格的なデータ集計・分析ができる。',
    'https://www.youtube.com/watch?v=G6nNjc-psUM',
    'video', 2
),
(
    'cccccccc-0000-0000-0000-000000000025',
    'bbbbbbbb-0000-0000-0000-000000000012',
    'Googleスプレッドシートのピボットテーブルの使い方',
    'ピボットテーブルを実際に操作しながら学ぶ実践的な動画。',
    'https://www.youtube.com/watch?v=a9jlyRVpTdw',
    'video', 3
)
ON CONFLICT (id) DO NOTHING;
