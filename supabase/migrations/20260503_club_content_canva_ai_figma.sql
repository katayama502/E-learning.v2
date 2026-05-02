-- ============================================
-- 部活動向け 中学生教材 追加コンテンツ
-- Canva応用 / 生成AI発展 / Figma入門
-- 3コース / 11モジュール / 34レッスン
-- Supabase ダッシュボード > SQL Editor で実行
-- ============================================

-- ──────────────────────────────────────────
-- CANVA 応用
-- ──────────────────────────────────────────
INSERT INTO courses (id, title, description, category, level, order_index, is_published)
VALUES (
    'aaaaaaaa-0000-0000-0000-000000000005',
    'Canva 応用',
    'プレゼン・動画編集・SNSデザイン・ロゴ制作など、Canvaをもっと使いこなそう',
    'Track', '初級〜中級', 4, true
) ON CONFLICT (id) DO NOTHING;

-- Module 13: プレゼンテーション作成
INSERT INTO course_curriculums (id, course_id, title, description, order_index)
VALUES (
    'bbbbbbbb-0000-0000-0000-000000000013',
    'aaaaaaaa-0000-0000-0000-000000000005',
    'プレゼンテーション作成',
    'Canvaで見栄えのいいプレゼン資料を効率よく作ろう',
    1
) ON CONFLICT (id) DO NOTHING;

INSERT INTO course_lessons (id, curriculum_id, title, description, youtube_url, type, order_index)
VALUES
(
    'cccccccc-0000-0000-0000-000000000026',
    'bbbbbbbb-0000-0000-0000-000000000013',
    '【最新】Canva公式Expertsが教える！プレゼン資料の作り方・活用法',
    'Canva公認専門家によるプレゼン資料作成の公式解説。構成からアニメーションまで。',
    'https://www.youtube.com/watch?v=pChdTth1dx8',
    'video', 1
),
(
    'cccccccc-0000-0000-0000-000000000027',
    'bbbbbbbb-0000-0000-0000-000000000013',
    'パワポいらず！Canvaで簡単！プレゼン資料の作り方',
    'PowerPointから乗り換えたい人向け。Canvaでプレゼン資料を一から作る方法。',
    'https://www.youtube.com/watch?v=MGbz0mDDPZ0',
    'video', 2
),
(
    'cccccccc-0000-0000-0000-000000000028',
    'bbbbbbbb-0000-0000-0000-000000000013',
    'CanvaのAIでプレゼンスライドを爆速作成！',
    'CanvaのAI機能を使ってプレゼン資料を一瞬で生成する方法を解説。',
    'https://www.youtube.com/watch?v=plHlvjLam0U',
    'video', 3
)
ON CONFLICT (id) DO NOTHING;

-- Module 14: 動画編集
INSERT INTO course_curriculums (id, course_id, title, description, order_index)
VALUES (
    'bbbbbbbb-0000-0000-0000-000000000014',
    'aaaaaaaa-0000-0000-0000-000000000005',
    '動画編集',
    'Canvaの動画編集機能を使って、クオリティの高い動画を作ろう',
    2
) ON CONFLICT (id) DO NOTHING;

INSERT INTO course_lessons (id, curriculum_id, title, description, youtube_url, type, order_index)
VALUES
(
    'cccccccc-0000-0000-0000-000000000029',
    'bbbbbbbb-0000-0000-0000-000000000014',
    'Canvaで動画編集！使い方を完全解説！初心者から上級者まで',
    'Canvaの動画編集機能を基礎から応用まで徹底解説。テキストアニメーションや音楽挿入も。',
    'https://www.youtube.com/watch?v=ArANkoPhBEo',
    'video', 1
),
(
    'cccccccc-0000-0000-0000-000000000030',
    'bbbbbbbb-0000-0000-0000-000000000014',
    '動画初心者でも簡単！Canva動画作成講座【2025年版】',
    '2025年最新版。はじめての動画作成でも迷わないCanva動画編集の手順を解説。',
    'https://www.youtube.com/watch?v=n7CRDe_C_LM',
    'video', 2
)
ON CONFLICT (id) DO NOTHING;

-- Module 15: SNSデザイン
INSERT INTO course_curriculums (id, course_id, title, description, order_index)
VALUES (
    'bbbbbbbb-0000-0000-0000-000000000015',
    'aaaaaaaa-0000-0000-0000-000000000005',
    'SNSデザイン',
    'InstagramやSNSで映えるデザインをCanvaで作ろう',
    3
) ON CONFLICT (id) DO NOTHING;

INSERT INTO course_lessons (id, curriculum_id, title, description, youtube_url, type, order_index)
VALUES
(
    'cccccccc-0000-0000-0000-000000000031',
    'bbbbbbbb-0000-0000-0000-000000000015',
    '超簡単！CanvaでSNSアイコンを作ってみよう！',
    'CanvaでオリジナルSNSアイコンを簡単に作る方法を解説。プロフ画像にも使える。',
    'https://www.youtube.com/watch?v=anZYK6jsATY',
    'video', 1
),
(
    'cccccccc-0000-0000-0000-000000000032',
    'bbbbbbbb-0000-0000-0000-000000000015',
    '【2025年最新】Instagram投稿デザインをCanvaで作る方法・完全解説',
    'Instagram投稿用の正方形・縦型デザインをCanvaで作る実践的な解説。',
    'https://www.youtube.com/watch?v=05Qx4VPlGUw',
    'video', 2
),
(
    'cccccccc-0000-0000-0000-000000000033',
    'bbbbbbbb-0000-0000-0000-000000000015',
    '【CanvaでリールやTikTok動画作成】縦型動画を作成・編集する方法を徹底解説',
    'Instagram・TikTok向けの縦型ショート動画をCanvaで作る方法を解説。',
    'https://www.youtube.com/watch?v=VuqUzzsOwAE',
    'video', 3
)
ON CONFLICT (id) DO NOTHING;

-- Module 16: ロゴ・ブランドデザイン
INSERT INTO course_curriculums (id, course_id, title, description, order_index)
VALUES (
    'bbbbbbbb-0000-0000-0000-000000000016',
    'aaaaaaaa-0000-0000-0000-000000000005',
    'ロゴ・ブランドデザイン',
    'Canvaを使ってオリジナルのロゴやブランドデザインを作ろう',
    4
) ON CONFLICT (id) DO NOTHING;

INSERT INTO course_lessons (id, curriculum_id, title, description, youtube_url, type, order_index)
VALUES
(
    'cccccccc-0000-0000-0000-000000000034',
    'bbbbbbbb-0000-0000-0000-000000000016',
    '【2024年】Canvaでロゴを作る方法【完全チュートリアル】',
    'CanvaでオリジナルロゴをゼロFromスクラッチで作る完全チュートリアル。',
    'https://www.youtube.com/watch?v=zh8C6BMszBo',
    'video', 1
),
(
    'cccccccc-0000-0000-0000-000000000035',
    'bbbbbbbb-0000-0000-0000-000000000016',
    '【初心者向け】Canvaでロゴを作ろう！要注意ポイントも解説',
    '初心者でも失敗しないCanvaロゴ作成。著作権の注意点も丁寧に解説。',
    'https://www.youtube.com/watch?v=ThbkRA4UQLo',
    'video', 2
)
ON CONFLICT (id) DO NOTHING;

-- Module 17: テンプレートカスタマイズ
INSERT INTO course_curriculums (id, course_id, title, description, order_index)
VALUES (
    'bbbbbbbb-0000-0000-0000-000000000017',
    'aaaaaaaa-0000-0000-0000-000000000005',
    'テンプレートカスタマイズ',
    'Canvaの豊富なテンプレートを自分らしくアレンジする技術を身につけよう',
    5
) ON CONFLICT (id) DO NOTHING;

INSERT INTO course_lessons (id, curriculum_id, title, description, youtube_url, type, order_index)
VALUES
(
    'cccccccc-0000-0000-0000-000000000036',
    'bbbbbbbb-0000-0000-0000-000000000017',
    'Canva公式テンプレートをカスタマイズする方法',
    'Canvaテンプレートを自分のブランドや目的に合わせてカスタマイズする手順を解説。',
    'https://www.youtube.com/watch?v=1mo7-RVU0tY',
    'video', 1
),
(
    'cccccccc-0000-0000-0000-000000000037',
    'bbbbbbbb-0000-0000-0000-000000000017',
    'Canvaのテンプレートをカスタマイズして自分だけのタイトル動画を作る',
    'テンプレートをベースに動画のタイトル画面・サムネイルを作るテクニック。',
    'https://www.youtube.com/watch?v=NCmwr0Il4U4',
    'video', 2
)
ON CONFLICT (id) DO NOTHING;

-- ──────────────────────────────────────────
-- 生成AI 発展
-- ──────────────────────────────────────────
INSERT INTO courses (id, title, description, category, level, order_index, is_published)
VALUES (
    'aaaaaaaa-0000-0000-0000-000000000006',
    '生成AI 発展',
    '生成AIの仕組みを理解し、画像生成・Copilot・NotebookLM・プロンプト設計まで活用の幅を広げよう',
    'Track', '初級〜中級', 5, true
) ON CONFLICT (id) DO NOTHING;

-- Module 18: 生成AIとは何か
INSERT INTO course_curriculums (id, course_id, title, description, order_index)
VALUES (
    'bbbbbbbb-0000-0000-0000-000000000018',
    'aaaaaaaa-0000-0000-0000-000000000006',
    '生成AIとは何か',
    'AIと生成AIの違いから仕組みまで、中学生でもわかるように学ぼう',
    1
) ON CONFLICT (id) DO NOTHING;

INSERT INTO course_lessons (id, curriculum_id, title, description, youtube_url, type, order_index)
VALUES
(
    'cccccccc-0000-0000-0000-000000000038',
    'bbbbbbbb-0000-0000-0000-000000000018',
    '生成AIを知ろう ─ 中学生向け生成AI入門講座（東京大学メタバース工学部）',
    '東京大学が中学生向けに提供する生成AI入門講座。仕組みから活用まで丁寧に解説。',
    'https://www.youtube.com/watch?v=zO-8QvgXbKI',
    'video', 1
),
(
    'cccccccc-0000-0000-0000-000000000039',
    'bbbbbbbb-0000-0000-0000-000000000018',
    '【完全版】生成AI超入門 ─ 生成AI時代に必須の7つの知識',
    '生成AIの基礎知識を7つのポイントに絞って体系的に解説した保存版。',
    'https://www.youtube.com/watch?v=42Ka682CRdI',
    'video', 2
),
(
    'cccccccc-0000-0000-0000-000000000040',
    'bbbbbbbb-0000-0000-0000-000000000018',
    '生成AIとは？AIとどう違うの？図解で簡単にわかりやすく解説',
    '図解を使ってAIと生成AIの違いを初心者にもわかりやすく説明。',
    'https://www.youtube.com/watch?v=YFtoy_tfYfc',
    'video', 3
)
ON CONFLICT (id) DO NOTHING;

-- Module 19: AI画像生成
INSERT INTO course_curriculums (id, course_id, title, description, order_index)
VALUES (
    'bbbbbbbb-0000-0000-0000-000000000019',
    'aaaaaaaa-0000-0000-0000-000000000006',
    'AI画像生成',
    'MidjourneyやStable Diffusionで好きな画像をAIで生成してみよう',
    2
) ON CONFLICT (id) DO NOTHING;

INSERT INTO course_lessons (id, curriculum_id, title, description, youtube_url, type, order_index)
VALUES
(
    'cccccccc-0000-0000-0000-000000000041',
    'bbbbbbbb-0000-0000-0000-000000000019',
    '【初心者向け】画像生成AI Midjourneyの始め方・使い方基礎講座',
    'Midjourney（ミッドジャーニー）のアカウント作成から最初の画像生成まで丁寧に解説。',
    'https://www.youtube.com/watch?v=cHkAITK52rU',
    'video', 1
),
(
    'cccccccc-0000-0000-0000-000000000042',
    'bbbbbbbb-0000-0000-0000-000000000019',
    '【2025年完全ガイド】無料でStable Diffusion！画像生成AIを徹底解説！',
    '無料で使えるStable Diffusionの環境構築から基本操作まで2025年最新版で解説。',
    'https://www.youtube.com/watch?v=WNMHFhf0yUI',
    'video', 2
)
ON CONFLICT (id) DO NOTHING;

-- Module 20: AIツール活用（Copilot・NotebookLM）
INSERT INTO course_curriculums (id, course_id, title, description, order_index)
VALUES (
    'bbbbbbbb-0000-0000-0000-000000000020',
    'aaaaaaaa-0000-0000-0000-000000000006',
    'AIツール活用（Copilot・NotebookLM）',
    'Microsoft CopilotとGoogle NotebookLMを使って学習や作業を効率化しよう',
    3
) ON CONFLICT (id) DO NOTHING;

INSERT INTO course_lessons (id, curriculum_id, title, description, youtube_url, type, order_index)
VALUES
(
    'cccccccc-0000-0000-0000-000000000043',
    'bbbbbbbb-0000-0000-0000-000000000020',
    'Copilot Chat 超入門 ─ 初心者でもすぐに使えるカンタン解説',
    'Microsoft Copilotの基本的な使い方を初心者向けにわかりやすく解説。',
    'https://www.youtube.com/watch?v=2RcuSvU2q0c',
    'video', 1
),
(
    'cccccccc-0000-0000-0000-000000000044',
    'bbbbbbbb-0000-0000-0000-000000000020',
    '【Google最強AI】NotebookLM完全ガイド！使い方と活用方法',
    'Google NotebookLMの全機能をこの1本で理解できる完全ガイド。',
    'https://www.youtube.com/watch?v=4shjUSh9DTQ',
    'video', 2
),
(
    'cccccccc-0000-0000-0000-000000000045',
    'bbbbbbbb-0000-0000-0000-000000000020',
    '【2026最新！】Google最強AI「NotebookLM」使い方・全機能・活用法を徹底解説！',
    '2026年最新版。NotebookLMの全機能と実践的な学習への活用方法を網羅。',
    'https://www.youtube.com/watch?v=Wok45BQMEV8',
    'video', 3
)
ON CONFLICT (id) DO NOTHING;

-- Module 21: プロンプトの書き方
INSERT INTO course_curriculums (id, course_id, title, description, order_index)
VALUES (
    'bbbbbbbb-0000-0000-0000-000000000021',
    'aaaaaaaa-0000-0000-0000-000000000006',
    'プロンプトの書き方',
    'AIへの指示（プロンプト）をうまく書いて、思い通りの回答を引き出そう',
    4
) ON CONFLICT (id) DO NOTHING;

INSERT INTO course_lessons (id, curriculum_id, title, description, youtube_url, type, order_index)
VALUES
(
    'cccccccc-0000-0000-0000-000000000046',
    'bbbbbbbb-0000-0000-0000-000000000021',
    '【脱初心者】AIへの指示出しがうまくいくプロンプトの基礎を徹底解説',
    'プロンプトの基本構造・コツ・NG例まで、初心者が脱初心者になるための解説。',
    'https://www.youtube.com/watch?v=3ZJJF_7UNSM',
    'video', 1
),
(
    'cccccccc-0000-0000-0000-000000000047',
    'bbbbbbbb-0000-0000-0000-000000000021',
    '【脱初心者】ChatGPTやGeminiのプロンプトのコツ！7つの最適解',
    'ChatGPT・Geminiで使えるプロンプトの書き方7つのポイントを実例付きで解説。',
    'https://www.youtube.com/watch?v=qcui5UQV45U',
    'video', 2
),
(
    'cccccccc-0000-0000-0000-000000000048',
    'bbbbbbbb-0000-0000-0000-000000000021',
    '9割の人が間違えている「プロンプトの正しい作り方」を徹底解説',
    'プロンプト設計の落とし穴と正しい作り方を基礎からわかりやすく解説。',
    'https://www.youtube.com/watch?v=MaptZezjq1k',
    'video', 3
)
ON CONFLICT (id) DO NOTHING;

-- Module 22: AIで音楽・コンテンツを作る
INSERT INTO course_curriculums (id, course_id, title, description, order_index)
VALUES (
    'bbbbbbbb-0000-0000-0000-000000000022',
    'aaaaaaaa-0000-0000-0000-000000000006',
    'AIで音楽・コンテンツを作る',
    'Suno AIなどを使って、AIで音楽や映像コンテンツを制作してみよう',
    5
) ON CONFLICT (id) DO NOTHING;

INSERT INTO course_lessons (id, curriculum_id, title, description, youtube_url, type, order_index)
VALUES
(
    'cccccccc-0000-0000-0000-000000000049',
    'bbbbbbbb-0000-0000-0000-000000000022',
    '【Suno AI 使い方】日本語で歌う！最新の音楽生成AIのクオリティが高すぎる',
    'テキストを入力するだけで楽曲を自動生成するSuno AIの使い方を解説。日本語対応。',
    'https://www.youtube.com/watch?v=KtRw0gtNZAc',
    'video', 1
),
(
    'cccccccc-0000-0000-0000-000000000050',
    'bbbbbbbb-0000-0000-0000-000000000022',
    'たった10分で曲が完成！AI「Suno」でプロ級の音楽を作ってみた！',
    '10分でプロ品質の楽曲が完成するSuno AIの実践動画。ジャンル指定・歌詞作成も解説。',
    'https://www.youtube.com/watch?v=ieIy47ATAA4',
    'video', 2
)
ON CONFLICT (id) DO NOTHING;

-- ──────────────────────────────────────────
-- Figma入門（UI/UXデザイン）
-- ──────────────────────────────────────────
INSERT INTO courses (id, title, description, category, level, order_index, is_published)
VALUES (
    'aaaaaaaa-0000-0000-0000-000000000007',
    'Figma入門',
    'UIデザインの業界標準ツール「Figma」を使ってアプリやWebのデザインを作ろう',
    'Track', '初級〜中級', 6, true
) ON CONFLICT (id) DO NOTHING;

-- Module 23: Figmaとは・基本操作
INSERT INTO course_curriculums (id, course_id, title, description, order_index)
VALUES (
    'bbbbbbbb-0000-0000-0000-000000000023',
    'aaaaaaaa-0000-0000-0000-000000000007',
    'Figmaとは・基本操作',
    'Figmaの概要と基本的な操作方法を覚えよう',
    1
) ON CONFLICT (id) DO NOTHING;

INSERT INTO course_lessons (id, curriculum_id, title, description, youtube_url, type, order_index)
VALUES
(
    'cccccccc-0000-0000-0000-000000000051',
    'bbbbbbbb-0000-0000-0000-000000000023',
    '【超入門】Figmaって何？特徴や使い始め方を解説【Webデザイン初心者必見】',
    'Figmaとは何か・なぜ人気なのかをわかりやすく解説。アカウント作成から最初の操作まで。',
    'https://www.youtube.com/watch?v=Gt2O4V3Kfxk',
    'video', 1
),
(
    'cccccccc-0000-0000-0000-000000000052',
    'bbbbbbbb-0000-0000-0000-000000000023',
    'Figmaの基本（Figma Basics 日本語版）をさわってみよう ─ 2024年新UIバージョン',
    'Figma公式の日本語チュートリアル。2024年の新UI対応版で基本操作を丁寧に解説。',
    'https://www.youtube.com/watch?v=5JKDySm7BMQ',
    'video', 2
),
(
    'cccccccc-0000-0000-0000-000000000053',
    'bbbbbbbb-0000-0000-0000-000000000023',
    '【2025最新】初心者向け！Figmaの基本とAIなど便利な使い方を完全解説',
    '2025年最新版。FigmaのAI機能も含めた基本操作を初心者向けに完全解説。',
    'https://www.youtube.com/watch?v=akd5pyd4TnU',
    'video', 3
)
ON CONFLICT (id) DO NOTHING;

-- Module 24: UIデザイン実践
INSERT INTO course_curriculums (id, course_id, title, description, order_index)
VALUES (
    'bbbbbbbb-0000-0000-0000-000000000024',
    'aaaaaaaa-0000-0000-0000-000000000007',
    'UIデザイン実践',
    'Figmaで実際にアプリ画面やWebページのデザインを作ってみよう',
    2
) ON CONFLICT (id) DO NOTHING;

INSERT INTO course_lessons (id, curriculum_id, title, description, youtube_url, type, order_index)
VALUES
(
    'cccccccc-0000-0000-0000-000000000054',
    'bbbbbbbb-0000-0000-0000-000000000024',
    'Figmaの使い方「完全攻略」基本編をわかりやすく解説！',
    'Figmaの基本操作を完全攻略。フレーム・コンポーネント・スタイルの使い方を解説。',
    'https://www.youtube.com/watch?v=k1gsIctjGEA',
    'video', 1
),
(
    'cccccccc-0000-0000-0000-000000000055',
    'bbbbbbbb-0000-0000-0000-000000000024',
    'Figmaの使い方：初心者向けWebデザイン入門',
    'WebデザインをFigmaで実践。レイアウト・配色・タイポグラフィの基礎も学べる。',
    'https://www.youtube.com/watch?v=HfkP06pZfAc',
    'video', 2
),
(
    'cccccccc-0000-0000-0000-000000000056',
    'bbbbbbbb-0000-0000-0000-000000000024',
    '【2024年最新版】初心者向け！Figmaの基本機能と便利な使い方を解説',
    '2024年版Figmaの基本機能をすべて網羅した初心者向け完全解説。',
    'https://www.youtube.com/watch?v=mXuaj3cr32Y',
    'video', 3
)
ON CONFLICT (id) DO NOTHING;

-- Module 25: プロトタイプ制作
INSERT INTO course_curriculums (id, course_id, title, description, order_index)
VALUES (
    'bbbbbbbb-0000-0000-0000-000000000025',
    'aaaaaaaa-0000-0000-0000-000000000007',
    'プロトタイプ制作',
    '画面遷移や動きをつけて、動くモックアップ（プロトタイプ）を作ってみよう',
    3
) ON CONFLICT (id) DO NOTHING;

INSERT INTO course_lessons (id, curriculum_id, title, description, youtube_url, type, order_index)
VALUES
(
    'cccccccc-0000-0000-0000-000000000057',
    'bbbbbbbb-0000-0000-0000-000000000025',
    '【Figma: プロトタイプ解説】デザインに画面遷移をつけるプロトタイピング機能',
    'Figmaのプロトタイプモードで画面遷移を設定する方法をわかりやすく解説。',
    'https://www.youtube.com/watch?v=iH8R8RTIyWI',
    'video', 1
),
(
    'cccccccc-0000-0000-0000-000000000058',
    'bbbbbbbb-0000-0000-0000-000000000025',
    '【Figma】デザインを人に届けるなら必須！プロトタイプ機能を徹底解説',
    'プロトタイプ機能の全操作を実践しながら学べる動画。チーム共有の方法も紹介。',
    'https://www.youtube.com/watch?v=ALBd_pAyUlw',
    'video', 2
),
(
    'cccccccc-0000-0000-0000-000000000059',
    'bbbbbbbb-0000-0000-0000-000000000025',
    '【Figma完全ガイド】ウェブデザイン初心者でも簡単！基本操作からプロトタイプまで徹底解説',
    'Figmaの基本操作からプロトタイプ作成まで一気通貫で学べる完全ガイド。',
    'https://www.youtube.com/watch?v=eVdeWp09QC4',
    'video', 3
)
ON CONFLICT (id) DO NOTHING;
