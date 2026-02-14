// Site metadata
export const SITE_TITLE = 'RollingTheRock';
export const SITE_DESCRIPTION = '探索技术、分享思考、记录成长';
export const SITE_URL = 'https://rollingtherock.github.io';

// Author info
export const AUTHOR = {
  name: '王若如',
  email: '2891887360@qq.com',
  avatar: '/images/avatar.jpg',
  bio: '中南财经政法大学在读。白天研究区块链，晚上刷算法题，凌晨思考维特根斯坦到底在说什么（至今没想明白）。',
  location: '武汉, 中国',
};

// Social links
export const GITHUB_URL = 'https://github.com/RollingTheRock';
export const TWITTER_URL = 'https://twitter.com/RollingTheRock';

// Skills & expertise
export const SKILLS = {
  languages: ['C++', 'Python', 'Java', 'Solidity'],
  frontend: ['React', 'Astro', 'Tailwind CSS', 'HTML/CSS'],
  backend: ['Spring Boot', 'Node.js', 'FastAPI', 'PostgreSQL'],
  blockchain: ['Smart Contracts', 'zkSNARKs', 'Zero Knowledge Proofs'],
  ai: ['Machine Learning', 'Reinforcement Learning', 'Deep Learning'],
};

// Timeline/experience
export const TIMELINE = [
  {
    year: '2024-至今',
    title: '中南财经政法大学',
    description: '区块链研究、算法竞赛、软件工程学习',
    type: 'education',
  },
  {
    year: '持续',
    title: 'ACM 算法竞赛',
    description: '从 WA 进化到 AC，偶尔退化回 WA 的循环中',
    type: 'education',
  },
  {
    year: '持续',
    title: '个人博客写作',
    description: '用输出倒逼输入，记录技术成长与思考',
    type: 'project',
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
