import { getSupabase } from './supabaseClient';
import { CmsState } from '../types/cms';
import { DEFAULT_CMS_STATE } from '../data/defaultCmsData';

const CMS_LOCAL_KEY = 'mds_cms_data_cache';

export async function fetchCmsFromSupabase(): Promise<CmsState> {
  let currentState: CmsState = { ...DEFAULT_CMS_STATE };

  // Try loading local cached overrides first if present
  try {
    const cached = localStorage.getItem(CMS_LOCAL_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      currentState = { ...currentState, ...parsed };
    }
  } catch (e) {
    console.warn('Failed to parse local CMS cache:', e);
  }

  const supabase = getSupabase() as any;
  if (!supabase) {
    return currentState;
  }

  try {
    // 1. Fetch main CMS JSON from website_cms table
    const { data: cmsRow, error: cmsError } = await supabase
      .from('website_cms')
      .select('cms_json')
      .limit(1)
      .maybeSingle();

    if (!cmsError && cmsRow && cmsRow.cms_json && typeof cmsRow.cms_json === 'object') {
      const remoteJson = cmsRow.cms_json as Partial<CmsState>;
      currentState = {
        ...currentState,
        ...remoteJson,
        hero: { ...currentState.hero, ...(remoteJson.hero || {}) },
        nav: { ...currentState.nav, ...(remoteJson.nav || {}) },
        seo: { ...currentState.seo, ...(remoteJson.seo || {}) },
        theme: { ...currentState.theme, ...(remoteJson.theme || {}) },
        site: { ...currentState.site, ...(remoteJson.site || {}) },
        certificate: { ...currentState.certificate, ...(remoteJson.certificate || {}) }
      };
    }

    // 2. Fetch structured speakers table if populated
    const { data: speakersData } = await supabase
      .from('speakers')
      .select('*')
      .order('order_index', { ascending: true });

    if (speakersData && speakersData.length > 0) {
      const mappedSpeakers = speakersData.map((s: any) => {
        const existing: any = currentState.speakers.find((p) => p.id === s.id) || currentState.speakers[0] || {};
        return {
          ...existing,
          id: s.id,
          name: s.name,
          title: s.title || '',
          bio: s.bio || '',
          photoUrl: s.photo_url || existing.photoUrl || '',
          achievements: Array.isArray(s.achievements) ? s.achievements : existing.achievements || []
        };
      });
      currentState.speakers = mappedSpeakers;
    }

    // 3. Fetch structured workshops table if populated
    const { data: workshopsData } = await supabase
      .from('workshops')
      .select('*')
      .order('session_number', { ascending: true });

    if (workshopsData && workshopsData.length > 0) {
      const mappedWorkshops = workshopsData.map((w: any) => {
        const existing = currentState.workshops.find((item) => item.id === w.id) || currentState.workshops[0] || {};
        return {
          ...existing,
          id: w.id,
          sessionNumber: w.session_number,
          title: w.title,
          description: w.description || '',
          speakerId: w.speaker_id || undefined,
          speakerName: w.speaker_name || '',
          date: w.date || '',
          time: w.time || '',
          isPublished: w.is_published
        };
      });
      currentState.workshops = mappedWorkshops;
    }

    // 4. Fetch announcements table if populated
    const { data: announcementsData } = await supabase
      .from('announcements')
      .select('*')
      .order('created_at', { ascending: false });

    if (announcementsData && announcementsData.length > 0) {
      currentState.announcements = announcementsData.map((a: any) => ({
        id: a.id,
        title: a.title,
        message: a.content,
        type: (a.category as any) || 'notice',
        active: true,
        date: a.date || new Date(a.created_at || Date.now()).toISOString().split('T')[0]
      }));
    }

    // Cache latest successful state locally
    try {
      localStorage.setItem(CMS_LOCAL_KEY, JSON.stringify(currentState));
    } catch {}

    return currentState;
  } catch (err) {
    console.warn('Error querying CMS from Supabase, falling back to cached state:', err);
    return currentState;
  }
}

export async function saveCmsToSupabase(updatedState: CmsState): Promise<boolean> {
  // Always update localStorage immediately
  try {
    localStorage.setItem(CMS_LOCAL_KEY, JSON.stringify(updatedState));
  } catch (e) {
    console.warn('Failed to save CMS to localStorage:', e);
  }

  const supabase = getSupabase() as any;
  if (!supabase) {
    return true; // Local update succeeds
  }

  try {
    // Check if main website_cms record exists
    const { data: existing } = await supabase
      .from('website_cms')
      .select('id')
      .limit(1)
      .maybeSingle();

    if (existing && existing.id) {
      await supabase
        .from('website_cms')
        .update({
          cms_json: updatedState,
          updated_at: new Date().toISOString()
        })
        .eq('id', existing.id);
    } else {
      await supabase.from('website_cms').insert({
        cms_json: updatedState,
        updated_at: new Date().toISOString()
      });
    }

    return true;
  } catch (err) {
    console.warn('Error saving CMS to Supabase:', err);
    return true; // Retain local state
  }
}
