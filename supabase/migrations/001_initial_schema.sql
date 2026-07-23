-- Supabase Database Schema Migration for MDS Academy
-- Primary Auth Reference: Kinde User ID (kinde_user_id)

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kinde_user_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  profile_picture TEXT,
  registration_status TEXT NOT NULL DEFAULT 'Pending' CHECK (registration_status IN ('Pending', 'Approved', 'Rejected', 'Suspended')),
  role TEXT NOT NULL DEFAULT 'Student' CHECK (role IN ('Guest', 'Student', 'Approved Student', 'Admin', 'Super Admin')),
  chamber_access BOOLEAN NOT NULL DEFAULT FALSE,
  course_completed BOOLEAN NOT NULL DEFAULT FALSE,
  institution TEXT DEFAULT 'Moulvibazar Debating Society',
  debate_format TEXT DEFAULT 'BP',
  experience_years INT DEFAULT 0,
  admission_code TEXT,
  completed_sessions JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for kinde_user_id lookup
CREATE INDEX IF NOT EXISTS idx_profiles_kinde_user_id ON public.profiles(kinde_user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- 2. Registrations Table
CREATE TABLE IF NOT EXISTS public.registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kinde_user_id TEXT REFERENCES public.profiles(kinde_user_id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  institution TEXT,
  debate_format TEXT,
  experience_years INT DEFAULT 0,
  admission_letter_code TEXT,
  status TEXT DEFAULT 'Pending',
  approval_status TEXT DEFAULT 'Pending' CHECK (approval_status IN ('Pending', 'Approved', 'Rejected', 'Suspended')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Speakers Table
CREATE TABLE IF NOT EXISTS public.speakers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  title TEXT,
  bio TEXT,
  photo_url TEXT,
  achievements JSONB DEFAULT '[]'::jsonb,
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Workshops Table
CREATE TABLE IF NOT EXISTS public.workshops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_number INT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  speaker_id UUID REFERENCES public.speakers(id) ON DELETE SET NULL,
  speaker_name TEXT,
  date TEXT,
  time TEXT,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Workshop Sessions (Videos embed links)
CREATE TABLE IF NOT EXISTS public.workshop_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workshop_id UUID REFERENCES public.workshops(id) ON DELETE CASCADE,
  session_number INT NOT NULL,
  title TEXT NOT NULL,
  assigned_speaker TEXT,
  video_type TEXT CHECK (video_type IN ('youtube', 'gdrive')) DEFAULT 'youtube',
  embed_url TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Certificates Table
CREATE TABLE IF NOT EXISTS public.certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subtitle TEXT,
  signatory_name TEXT,
  signatory_title TEXT,
  template_url TEXT,
  qr_code_enabled BOOLEAN DEFAULT TRUE,
  verification_base_url TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Attendance Table
CREATE TABLE IF NOT EXISTS public.attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kinde_user_id TEXT REFERENCES public.profiles(kinde_user_id) ON DELETE CASCADE,
  session_number INT NOT NULL,
  marked_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Announcements Table
CREATE TABLE IF NOT EXISTS public.announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  date TEXT,
  category TEXT DEFAULT 'General',
  is_pinned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. Resources Table
CREATE TABLE IF NOT EXISTS public.resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  category TEXT DEFAULT 'Guide',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. Gallery Table
CREATE TABLE IF NOT EXISTS public.gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT,
  image_url TEXT NOT NULL,
  category TEXT DEFAULT 'Event',
  caption TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. Settings Table
CREATE TABLE IF NOT EXISTS public.settings (
  id TEXT PRIMARY KEY DEFAULT 'global_settings',
  site_name TEXT DEFAULT 'Moulvibazar Debating Society Academy',
  contact_email TEXT DEFAULT 'contact@mds.academy',
  hero_title TEXT,
  hero_subtitle TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. Media Library Table
CREATE TABLE IF NOT EXISTS public.media_library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  bucket TEXT NOT NULL,
  mime_type TEXT,
  size_bytes BIGINT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 13. Student Progress Table
CREATE TABLE IF NOT EXISTS public.student_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kinde_user_id TEXT REFERENCES public.profiles(kinde_user_id) ON DELETE CASCADE,
  completed_sessions JSONB DEFAULT '[]'::jsonb,
  xp INT DEFAULT 150,
  coins INT DEFAULT 50,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 14. Payments Table
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kinde_user_id TEXT,
  amount NUMERIC(10, 2),
  currency TEXT DEFAULT 'BDT',
  status TEXT DEFAULT 'Completed',
  transaction_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 15. Email Logs Table
CREATE TABLE IF NOT EXISTS public.email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  status TEXT DEFAULT 'Sent',
  sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 16. Website CMS State Table
CREATE TABLE IF NOT EXISTS public.website_cms (
  id TEXT PRIMARY KEY DEFAULT 'cms_state',
  cms_json JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Storage Buckets Configuration SQL
-- speaker-photos, gallery-images, hero-images, certificate-templates, pdf-resources, documents, media
INSERT INTO storage.buckets (id, name, public) VALUES
  ('speaker-photos', 'speaker-photos', true),
  ('gallery-images', 'gallery-images', true),
  ('hero-images', 'hero-images', true),
  ('certificate-templates', 'certificate-templates', true),
  ('pdf-resources', 'pdf-resources', true),
  ('documents', 'documents', true),
  ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;
