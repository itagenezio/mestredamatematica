-- 🛡️ BACKEND SCHEMA & SECURITY POLICIES (Supabase)

-- 1. Tabela de Estudantes
CREATE TABLE public.students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID DEFAULT auth.uid(), -- Link with Supabase Auth if used
    name TEXT NOT NULL,
    grade TEXT NOT NULL, -- "6", "7", etc
    total_xp INTEGER DEFAULT 0,
    total_games INTEGER DEFAULT 0,
    achievements TEXT[] DEFAULT '{}', -- Array of achievement IDs
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 🔒 Habilitar RLS
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

-- 📜 Políticas RLS
CREATE POLICY "Public profiles are viewable by everyone."
ON public.students FOR SELECT
USING (true);

CREATE POLICY "Users can update their own profile."
ON public.students FOR UPDATE
USING (true); -- Simplified for local/offline focus, in prod use auth.uid() = user_id

CREATE POLICY "Users can insert their own profile."
ON public.students FOR INSERT
WITH CHECK (true);

-- 2. Tabela de Resultados de Jogos
CREATE TABLE public.game_results (
    id TEXT PRIMARY KEY, -- Using client-generated ID for offline sync
    student_id UUID REFERENCES public.students(id),
    difficulty TEXT NOT NULL,
    correct_answers INTEGER NOT NULL,
    total_time INTEGER NOT NULL,
    score INTEGER NOT NULL,
    xp_earned INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.game_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Game results are viewable by everyone."
ON public.game_results FOR SELECT
USING (true);

CREATE POLICY "Anyone can insert game results."
ON public.game_results FOR INSERT
WITH CHECK (true);

-- 3. Tabela de Conquistas (Informação de referência)
CREATE TABLE public.achievements (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    icon TEXT
);

-- Seed básico de conquistas
INSERT INTO public.achievements (id, title, description, icon) VALUES
('first_game', 'Primeiro Passo', 'Concluiu sua primeira batalha matemática!', '🚀'),
('perfectionist', 'Perfeccionista', 'Acertou todas as questões em uma partida fácil.', '💎'),
('speedster', 'Velocista', 'Terminou uma partida em menos de 30 segundos.', '⚡'),
('math_master', 'Mestre dos Cálculos', 'Venceu uma partida no nível Difícil.', '🧠'),
('xp_collector', 'Colecionador de XP', 'Alcançou 1000 pontos de XP total.', '💰'),
('marathoner', 'Maratonista', 'Concluiu 10 partidas totais.', '🏃');

-- 4. Função para atualizar timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_students_updated_at
BEFORE UPDATE ON public.students
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();
