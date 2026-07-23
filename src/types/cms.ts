import { Workshop, Professor, StudentProfile, BlogPost } from '../types';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'superadmin' | 'editor';
}

export interface HeroContent {
  headline: string;
  subheading: string;
  description: string;
  primaryButtonText: string;
  primaryButtonUrl: string;
  secondaryButtonText: string;
  secondaryButtonUrl: string;
  badgeText: string;
  heroIllustration: 'debate_hall' | 'academy_illustration' | 'podium' | 'library' | 'fantasy_art';
  illustrationUrl?: string;
  backgroundImageUrl?: string;
  startDate: string;
  googleMeetInfo: string;
  certificateIncluded: boolean;
  registrationFee: string;
  workshopsCount: string;
  speakersCount: string;
  countdownTarget: string;
  animationsEnabled: boolean;
}

export interface NavItem {
  id: string;
  label: string;
  url: string;
  iconName: string;
  displayOrder: number;
  isExternal?: boolean;
}

export interface NavContent {
  logoText: string;
  logoSubtext: string;
  logoImageUrl?: string;
  items: NavItem[];
  socialLinks: {
    facebook?: string;
    instagram?: string;
    discord?: string;
    youtube?: string;
    twitter?: string;
    linkedin?: string;
  };
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  featured: boolean;
  displayOrder: number;
}

export interface CertificateSettings {
  templateName: string;
  title: string;
  subtitle: string;
  signatoryName: string;
  signatoryTitle: string;
  signatoryImage?: string;
  logoUrl?: string;
  backgroundPattern: 'gold_borders' | 'classic_parchment' | 'modern_gothic';
  qrCodeEnabled: boolean;
  verificationBaseUrl: string;
}

export interface AnnouncementItem {
  id: string;
  title: string;
  message: string;
  type: 'notice' | 'popup' | 'banner' | 'event_update';
  active: boolean;
  linkText?: string;
  linkUrl?: string;
  date: string;
}

export interface MediaItem {
  id: string;
  name: string;
  type: 'image' | 'video' | 'pdf' | 'document';
  url: string;
  size: string;
  uploadedAt: string;
}

export interface SeoSettings {
  metaTitle: string;
  metaDescription: string;
  ogImageUrl: string;
  faviconUrl: string;
  analyticsCode?: string;
  customHeaderScripts?: string;
}

export interface ThemeSettings {
  primaryColor: string; // e.g. '#D4AF37'
  secondaryColor: string; // e.g. '#120E2A'
  fontDisplay: string;
  fontSans: string;
  darkMode: boolean;
  animationToggle: boolean;
  particleToggle: boolean;
}

export interface SiteSettings {
  academyName: string;
  organizationName: string;
  email: string;
  phone: string;
  address: string;
  copyrightText: string;
  facebookUrl: string;
  instagramUrl: string;
  discordUrl: string;
  googleMeetUrl: string;
}

export interface ContentBlock {
  id: string;
  key: string; // unique identifier e.g. 'faq_heading', 'professors_subtitle'
  heading: string;
  subheading?: string;
  paragraph?: string;
  buttonText?: string;
  buttonUrl?: string;
  imageUrl?: string;
}

export interface EmailTemplate {
  id: string;
  type: 'registration_confirmation' | 'workshop_reminder' | 'certificate_delivery' | 'password_reset';
  subject: string;
  body: string;
  enabled: boolean;
}

export interface WorkshopSessionVideo {
  id: string;
  sessionNumber: number;
  title: string;
  assignedSpeaker: string;
  videoType: 'youtube' | 'gdrive';
  embedUrl: string;
}

export interface CmsState {
  hero: HeroContent;
  nav: NavContent;
  workshops: Workshop[];
  speakers: Professor[];
  gallery: GalleryItem[];
  certificate: CertificateSettings;
  sessionVideos?: WorkshopSessionVideo[];
  announcements: AnnouncementItem[];
  media: MediaItem[];
  seo: SeoSettings;
  theme: ThemeSettings;
  site: SiteSettings;
  contentBlocks: ContentBlock[];
  emailTemplates: EmailTemplate[];
  blogPosts: BlogPost[];
  faqs: { q: string; a: string }[];
}
