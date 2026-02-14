// Site metadata
export const SITE_TITLE = 'RollingTheRock';
export const SITE_DESCRIPTION = '探索技术、分享思考、记录成长';
export const SITE_URL = 'https://rollingtherock.github.io';

// Social links
export const GITHUB_URL = 'https://github.com/RollingTheRock';
export const TWITTER_URL = 'https://twitter.com/RollingTheRock';

// Giscus configuration
export const GISCUS_CONFIG = {
  repo: 'RollingTheRock/personal-site' as `${string}/${string}`,
  repoId: '', // Will be filled after setting up Giscus
  category: 'Comments',
  categoryId: '', // Will be filled after setting up Giscus
  mapping: 'pathname' as const,
  reactionsEnabled: '1',
  emitMetadata: '0',
  inputPosition: 'top' as const,
  lang: 'zh-CN',
};

// Navigation
export const NAV_LINKS = [
  { href: '/', label: '首页' },
  { href: '/blog', label: '博客' },
  { href: '/projects', label: '项目' },
  { href: '/videos', label: '视频' },
  { href: '/about', label: '关于' },
];

// Content settings
export const POSTS_PER_PAGE = 10;
export const FEATURED_POSTS_COUNT = 3;
export const FEATURED_PROJECTS_COUNT = 3;

// Buttondown newsletter URL
export const BUTTONDOWN_URL = 'https://buttondown.email/api/emails/embed-subscribe/rollingtherock';
