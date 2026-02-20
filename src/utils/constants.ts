// Site metadata
export const SITE_TITLE = 'RollingTheRock';
export const SITE_DESCRIPTION = '探索技术、分享思考、记录成长';
export const SITE_URL = 'https://rollingtherock.blog';

// Author info
export const AUTHOR = {
  name: '王若如',
  email: '2891887360@qq.com',
  avatar: '/images/avatar.jpg',
  bio: '中南财经政法大学在读。脑子里同时跑着五个线程，偶尔死锁。',
  location: '武汉, 中国',
};

// Social links
export const GITHUB_URL = 'https://github.com/RollingTheRock';
export const TWITTER_URL = 'https://x.com/2Anrewru_3';

// Skills & expertise
export const SKILLS = {
  languages: ['C++', 'Python', 'Java', 'JavaScript', 'TypeScript', 'Solidity'],
  frontend: ['React', 'Astro', 'Tailwind CSS', 'HTML/CSS'],
  backend: ['Spring Boot', 'Node.js', 'FastAPI', 'PostgreSQL'],
  blockchain: ['Smart Contracts', 'zkSNARKs', 'Zero Knowledge Proofs'],
  ai: ['LLM', 'RAG', 'Data Curation', 'Prompt Engineering', 'Deep Learning'],
  agent: ['LangChain', 'LangGraph', 'GitHub Actions', 'Notion API'],
};

// Timeline/experience
export const TIMELINE = [
  {
    year: '2024 - 至今',
    title: '中南财经政法大学',
    description: '区块链研究、算法竞赛、软件工程学习',
  },
  {
    year: '持续',
    title: 'ACM 算法竞赛',
    description: '从 WA 进化到 AC，偶尔退化回 WA 的循环中',
  },
  {
    year: '持续',
    title: 'AI & 数据科学',
    description: '刚入门就发现门里面还有门，目前还在找钥匙',
  },
  {
    year: '持续',
    title: '个人博客写作',
    description: '用输出倒逼输入，顺便治疗拖延症（效果待定）',
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

// Category color mapping
export const CATEGORY_COLOR_MAP: Record<string, string> = {
  '思考': '#A855F7',
  '技术': '#06B6D4',
  'ACM': '#06B6D4',
  '基础算法': '#06B6D4',
  '项目': '#06B6D4',
  '生活': '#F97316',
  '随笔': '#F97316',
};

export const DEFAULT_BRAND_COLOR = '#A855F7';

// Get brand color by category
export function getBrandColor(categories: string[] = []): string {
  const firstCategory = categories[0];
  return CATEGORY_COLOR_MAP[firstCategory] || DEFAULT_BRAND_COLOR;
}

// Format date to Chinese style (e.g., "2026年1月23日")
export function formatDateCN(date: Date): string {
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
}

// Buttondown newsletter URL
export const BUTTONDOWN_URL = 'https://buttondown.email/api/emails/embed-subscribe/rollingtherock';
