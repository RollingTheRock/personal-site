// Site metadata
export const SITE_TITLE = 'RollingTheRock';
export const SITE_DESCRIPTION = '探索技术、分享思考、记录成长';
export const SITE_URL = 'https://rollingtherock.github.io';

// Author info
export const AUTHOR = {
  name: 'RollingTheRock',
  email: '2891887360@qq.com',
  avatar: '/images/avatar.jpg',
  bio: '探索技术、分享思考、记录成长',
  location: 'China',
};

// Social links
export const GITHUB_URL = 'https://github.com/RollingTheRock';
export const TWITTER_URL = 'https://twitter.com/RollingTheRock';

// Skills & expertise
export const SKILLS = {
  languages: ['Python', 'JavaScript', 'TypeScript'],
  frontend: ['React', 'Astro', 'Tailwind CSS', 'HTML/CSS'],
  backend: ['Node.js', 'FastAPI', 'PostgreSQL'],
  tools: ['Git', 'Docker', 'Linux', 'GitHub Actions'],
  ai: ['DeepSeek', 'OpenAI API', 'NLP', 'Data Analysis'],
};

// Timeline/experience
export const TIMELINE = [
  {
    year: '2024',
    title: '创建 AI 日报邮件系统',
    description: '自动化抓取 AI 论文并生成中文摘要，每日发送邮件订阅',
    type: 'project',
  },
  {
    year: '2024',
    title: '建立个人网站',
    description: '使用 Astro + Tailwind CSS 构建博客、项目展示平台',
    type: 'project',
  },
  {
    year: '持续',
    title: '技术学习与实践',
    description: '关注 AI、Web 开发、自动化工具等领域，持续输出学习笔记',
    type: 'education',
  },
];

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
