import { CmsState } from '../types/cms';
import { MDS_WORKSHOPS, MDS_PROFESSORS, ACADEMY_BLOG_POSTS, ACADEMY_FAQS } from './academyData';

export const DEFAULT_CMS_STATE: CmsState = {
  hero: {
    headline: "THE ELITE DEBATE MASTERCLASS",
    subheading: "Moulvibazar Debating Society • Elite Workshop Series",
    description: "A 10-session masterclass engineered for championship WUDC & Asian Parliamentary debate mastery, led by 10 distinguished speakers.",
    primaryButtonText: "Register Now",
    primaryButtonUrl: "registration",
    secondaryButtonText: "View Curriculum",
    secondaryButtonUrl: "workshops",
    badgeText: "Moulvibazar Debating Society • Elite Workshop Series",
    heroIllustration: "debate_hall",
    illustrationUrl: "",
    backgroundImageUrl: "",
    startDate: "10 August 2026",
    googleMeetInfo: "Google Meet",
    certificateIncluded: true,
    registrationFee: "BDT 200",
    workshopsCount: "10 Workshops",
    speakersCount: "10 Speakers",
    countdownTarget: "2026-08-10T18:00:00",
    animationsEnabled: true
  },
  nav: {
    logoText: "MDS",
    logoSubtext: "Moulvibazar Debating Society",
    items: [
      { id: 'nav-1', label: 'Grand Hall', url: 'home', iconName: 'Compass', displayOrder: 1 },
      { id: 'nav-2', label: 'Scroll Classes', url: 'workshops', iconName: 'Scroll', displayOrder: 2 },
      { id: 'nav-3', label: 'Professors', url: 'professors', iconName: 'Compass', displayOrder: 3 },
      { id: 'nav-4', label: 'Spell-Forge', url: 'spellforge', iconName: 'Cpu', displayOrder: 4 },
      { id: 'nav-5', label: 'Post Office', url: 'registration', iconName: 'UserCheck', displayOrder: 5 },
      { id: 'nav-6', label: 'My Chamber', url: 'dashboard', iconName: 'Trophy', displayOrder: 6 }
    ],
    socialLinks: {
      facebook: "https://facebook.com/moulvibazar.debating.society",
      instagram: "https://instagram.com/moulvibazardebatingsociety",
      discord: "https://discord.gg/mds-workshop",
      youtube: "https://youtube.com/@moulvibazardebatingsociety"
    }
  },
  workshops: MDS_WORKSHOPS,
  speakers: MDS_PROFESSORS,
  gallery: [
    {
      id: 'g-1',
      title: 'Grand Championship Trophy Ceremony',
      category: 'Tournaments',
      imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80',
      featured: true,
      displayOrder: 1
    },
    {
      id: 'g-2',
      title: 'Debate Strategy Workshop Session',
      category: 'Workshops',
      imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop&q=80',
      featured: true,
      displayOrder: 2
    },
    {
      id: 'g-3',
      title: 'MDS Scribes Library Study Session',
      category: 'Academy Life',
      imageUrl: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&auto=format&fit=crop&q=80',
      featured: false,
      displayOrder: 3
    }
  ],
  certificate: {
    templateName: "MDS Gold Sealed Certificate of Mastery",
    title: "CERTIFICATE OF DEBATE MASTERY",
    subtitle: "This is to certify that the scholar has successfully completed the 10-Session Elite Masterclass Series",
    signatoryName: "MDS Chancellor",
    signatoryTitle: "MDS Executive Committee",
    backgroundPattern: "gold_borders",
    qrCodeEnabled: true,
    verificationBaseUrl: "https://mds.academy/verify-certificate"
  },
  sessionVideos: [
    { id: 'v-1', sessionNumber: 1, title: 'Motion Analysis & Case Deconstruction', assignedSpeaker: 'MDS Trainer', videoType: 'youtube', embedUrl: 'https://www.youtube.com/embed/S2C_A3S8k8I' },
    { id: 'v-2', sessionNumber: 2, title: 'Mystical Framing & Arena Definition', assignedSpeaker: 'MDS Trainer', videoType: 'youtube', embedUrl: 'https://www.youtube.com/embed/L1c9mch3jA4' },
    { id: 'v-3', sessionNumber: 3, title: 'Alchemical Characterization & Actor Motivation', assignedSpeaker: 'MDS Trainer', videoType: 'youtube', embedUrl: 'https://www.youtube.com/embed/pCqJ2zP2KzY' },
    { id: 'v-4', sessionNumber: 4, title: 'Impact Calculus & The Scale of Justice', assignedSpeaker: 'MDS Trainer', videoType: 'youtube', embedUrl: 'https://www.youtube.com/embed/kJQP7kiw5Fk' },
    { id: 'v-5', sessionNumber: 5, title: 'Disenchanting Rebuttals & Spellbreaking', assignedSpeaker: 'MDS Trainer', videoType: 'youtube', embedUrl: 'https://www.youtube.com/embed/S2C_A3S8k8I' },
    { id: 'v-6', sessionNumber: 6, title: 'The Great Extension Speech & Secret Runes', assignedSpeaker: 'MDS Trainer', videoType: 'youtube', embedUrl: 'https://www.youtube.com/embed/L1c9mch3jA4' },
    { id: 'v-7', sessionNumber: 7, title: 'Speech Architecture & Rhetorical Flow', assignedSpeaker: 'MDS Trainer', videoType: 'youtube', embedUrl: 'https://www.youtube.com/embed/pCqJ2zP2KzY' },
    { id: 'v-8', sessionNumber: 8, title: 'Entering the Judge’s Mind & Scrying Ballots', assignedSpeaker: 'MDS Trainer', videoType: 'youtube', embedUrl: 'https://www.youtube.com/embed/kJQP7kiw5Fk' },
    { id: 'v-9', sessionNumber: 9, title: 'Advanced Prep Room Rituals & Strategy', assignedSpeaker: 'MDS Trainer', videoType: 'youtube', embedUrl: 'https://www.youtube.com/embed/S2C_A3S8k8I' },
    { id: 'v-10', sessionNumber: 10, title: 'Championship Strategy & Grand Arcanum', assignedSpeaker: 'MDS Trainer', videoType: 'youtube', embedUrl: 'https://www.youtube.com/embed/L1c9mch3jA4' }
  ],
  announcements: [
    {
      id: 'ann-1',
      title: 'Early Bird Registration Open',
      message: 'Seats for the 10-Session Masterclass are limited to 100 scholars. Register now to secure your spot!',
      type: 'banner',
      active: true,
      linkText: 'Register Now',
      linkUrl: 'registration',
      date: 'July 20, 2026'
    }
  ],
  media: [
    {
      id: 'm-1',
      name: 'Academy Hero Banner.jpg',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800',
      size: '1.2 MB',
      uploadedAt: '2026-07-20'
    },
    {
      id: 'm-2',
      name: 'Workshop Curriculum Syllabus.pdf',
      type: 'pdf',
      url: '#',
      size: '2.4 MB',
      uploadedAt: '2026-07-21'
    }
  ],
  seo: {
    metaTitle: "MDS - Moulvibazar Debating Society Workshop 2026",
    metaDescription: "Master WUDC & Asian Parliamentary debate with 10 distinguished speakers in a 10-session masterclass by Moulvibazar Debating Society.",
    ogImageUrl: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200",
    faviconUrl: "/favicon.ico",
    analyticsCode: "G-MDS2026WORKSHOP"
  },
  theme: {
    primaryColor: "#D4AF37",
    secondaryColor: "#120E2A",
    fontDisplay: "Cinzel",
    fontSans: "Plus Jakarta Sans",
    darkMode: true,
    animationToggle: true,
    particleToggle: true
  },
  site: {
    academyName: "Moulvibazar Debating Society",
    organizationName: "Moulvibazar Debating Society (MDS)",
    email: "mdsworkshop@gmail.com",
    phone: "+880 1700-000000",
    address: "Moulvibazar, Sylhet, Bangladesh",
    copyrightText: "© 2026 Moulvibazar Debating Society (MDS). All logical rights preserved.",
    facebookUrl: "https://facebook.com/moulvibazar.debating.society",
    instagramUrl: "https://instagram.com/moulvibazardebatingsociety",
    discordUrl: "https://discord.gg/mds-workshop",
    googleMeetUrl: "https://meet.google.com/mds-elite-debate"
  },
  contentBlocks: [
    {
      id: 'cb-1',
      key: 'portal_section',
      heading: 'The Portal of Scribes',
      subheading: 'Scroll downwards or click below to trigger the golden seal and cross the barrier.',
      paragraph: 'Explore the 10-session workshop world constructed by elite adjudicators and champions.'
    },
    {
      id: 'cb-2',
      key: 'professors_section',
      heading: 'Academy Dormitory Professors',
      subheading: 'Learn from national debate champions, WUDC participants, and chief adjudicators.'
    }
  ],
  emailTemplates: [
    {
      id: 'et-1',
      type: 'registration_confirmation',
      subject: 'Welcome to MDS Elite Debate Workshop - Admission Pass Confirmed!',
      body: 'Dear {{studentName}},\n\nYour registration for the MDS Elite Debate Masterclass is confirmed!\nYour Admission Code is: {{admissionCode}}.\n\nWe look forward to seeing you at Workshop 1 on 10 August 2026 via Google Meet.\n\nWarm regards,\nMDS Chancellor',
      enabled: true
    },
    {
      id: 'et-2',
      type: 'workshop_reminder',
      subject: 'Reminder: Upcoming MDS Debate Workshop Today!',
      body: 'Dear {{studentName}},\n\nYour next workshop "{{workshopTitle}}" starts in 1 hour via Google Meet.\nMeeting Link: {{meetingLink}}\n\nGet your speech scrolls ready!',
      enabled: true
    }
  ],
  blogPosts: ACADEMY_BLOG_POSTS,
  faqs: ACADEMY_FAQS
};
