import type { NavCategory, Language, FooterSection } from '@/types';

export const SITE_NAME = 'GTA5-Mods.com';
export const SITE_URL = 'https://www.gta5-mods.com';
export const SITE_DESCRIPTION = 'Your source for the latest GTA 5 car mods, scripts, tools and more.';
export const THEME_COLOR = '#dc2626';

export const NAV_CATEGORIES: NavCategory[] = [
  { slug: 'tools',     label: 'Tools',      image: '/images/tools.jpg' },
  { slug: 'vehicles',  label: 'Vehicles',   image: '/images/vehicles.jpg' },
  { slug: 'paintjobs', label: 'Paint Jobs', image: '/images/misc.jpg' },
  { slug: 'weapons',   label: 'Weapons',    image: '/images/weapons.jpg' },
  { slug: 'scripts',   label: 'Scripts',    image: '/images/scripts.jpg' },
  { slug: 'player',    label: 'Player',     image: '/images/player.jpg' },
  { slug: 'maps',      label: 'Maps',       image: '/images/maps.jpg' },
  { slug: 'misc',      label: 'Misc',       image: '/images/misc.jpg' },
];

export const LANGUAGES: Language[] = [
  { code: 'id', name: 'Bahasa Indonesia',   flagClass: 'famfamfam-flag-id',       path: '/id/' },
  { code: 'ms', name: 'Bahasa Melayu',      flagClass: 'famfamfam-flag-my',       path: '/ms/' },
  { code: 'bg', name: 'Български',          flagClass: 'famfamfam-flag-bg',       path: '/bg/' },
  { code: 'ca', name: 'Català',             flagClass: 'famfamfam-flag-catalonia', path: '/ca/' },
  { code: 'cs', name: 'Čeština',            flagClass: 'famfamfam-flag-cz',       path: '/cs/' },
  { code: 'da', name: 'Dansk',              flagClass: 'famfamfam-flag-dk',       path: '/da/' },
  { code: 'de', name: 'Deutsch',            flagClass: 'famfamfam-flag-de',       path: '/de/' },
  { code: 'el', name: 'Ελληνικά',           flagClass: 'famfamfam-flag-gr',       path: '/el/' },
  { code: 'en', name: 'English',            flagClass: 'famfamfam-flag-gb',       path: '/' },
  { code: 'es', name: 'Español',            flagClass: 'famfamfam-flag-es',       path: '/es/' },
  { code: 'fr', name: 'Français',           flagClass: 'famfamfam-flag-fr',       path: '/fr/' },
  { code: 'gl', name: 'Galego',             flagClass: 'famfamfam-flag-es-gl',    path: '/gl/' },
  { code: 'ko', name: '한국어',              flagClass: 'famfamfam-flag-kr',       path: '/ko/' },
  { code: 'hi', name: 'हिन्दी',              flagClass: 'famfamfam-flag-in',       path: '/hi/' },
  { code: 'it', name: 'Italiano',           flagClass: 'famfamfam-flag-it',       path: '/it/' },
  { code: 'hu', name: 'Magyar',             flagClass: 'famfamfam-flag-hu',       path: '/hu/' },
  { code: 'mk', name: 'Македонски',         flagClass: 'famfamfam-flag-mk',       path: '/mk/' },
  { code: 'nl', name: 'Nederlands',         flagClass: 'famfamfam-flag-nl',       path: '/nl/' },
  { code: 'no', name: 'Norsk',              flagClass: 'famfamfam-flag-no',       path: '/no/' },
  { code: 'pl', name: 'Polski',             flagClass: 'famfamfam-flag-pl',       path: '/pl/' },
  { code: 'pt', name: 'Português do Brasil',flagClass: 'famfamfam-flag-br',       path: '/pt/' },
  { code: 'ro', name: 'Română',             flagClass: 'famfamfam-flag-ro',       path: '/ro/' },
  { code: 'ru', name: 'Русский',            flagClass: 'famfamfam-flag-ru',       path: '/ru/' },
  { code: 'sl', name: 'Slovenščina',        flagClass: 'famfamfam-flag-si',       path: '/sl/' },
  { code: 'fi', name: 'Suomi',              flagClass: 'famfamfam-flag-fi',       path: '/fi/' },
  { code: 'sv', name: 'Svenska',            flagClass: 'famfamfam-flag-se',       path: '/sv/' },
  { code: 'vi', name: 'Tiếng Việt',         flagClass: 'famfamfam-flag-vn',       path: '/vi/' },
  { code: 'tr', name: 'Türkçe',             flagClass: 'famfamfam-flag-tr',       path: '/tr/' },
  { code: 'uk', name: 'Українська',         flagClass: 'famfamfam-flag-ua',       path: '/uk/' },
  { code: 'zh', name: '中文',               flagClass: 'famfamfam-flag-cn',       path: '/zh/' },
];

export const FOOTER_SECTIONS: FooterSection[] = [
  {
    links: [
      { label: 'GTA 5 Vehicle Mods',             href: '/vehicles' },
      { label: 'GTA 5 Weapon Mods',              href: '/weapons' },
      { label: 'GTA 5 Script Mods',              href: '/scripts' },
      { label: 'GTA 5 Map Mods',                 href: '/maps' },
    ],
  },
  {
    links: [
      { label: 'GTA 5 Modding Tools',            href: '/tools' },
      { label: 'GTA 5 Vehicle Paint Job Mods',   href: '/paintjobs' },
      { label: 'GTA 5 Player Mods',              href: '/player' },
      { label: 'GTA 5 Misc Mods',                href: '/misc' },
    ],
  },
  {
    links: [
      { label: 'Terms of Use',   href: '/terms' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Refund Policy',  href: '/refund' },
    ],
  },
];

export const DISCORD_URL = 'https://discord.gg/2PR7aMzD4U';
export const GTM_ID = 'GTM-KCVF2WQ';
