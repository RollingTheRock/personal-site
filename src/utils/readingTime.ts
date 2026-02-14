/**
 * 计算文章阅读时间
 * 中文按每分钟 300 字计算
 * 英文按每分钟 200 词计算
 */

export interface ReadingTimeResult {
  minutes: number;
  words: number;
  text: string;
}

export function calculateReadingTime(content: string): ReadingTimeResult {
  // 移除 Markdown 语法符号
  const cleanContent = content
    .replace(/```[\s\S]*?```/g, '') // 代码块
    .replace(/`[^`]+`/g, '') // 行内代码
    .replace(/!\[.*?\]\(.*?\)/g, '') // 图片
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // 链接，保留文本
    .replace(/[#*\-_>]/g, '') // Markdown 符号
    .trim();

  // 统计中文字符（包括中文标点）
  const chineseChars = (cleanContent.match(/[\u4e00-\u9fa5\u3000-\u303f\uff00-\uffef]/g) || []).length;

  // 统计英文单词
  const englishWords = (cleanContent.match(/[a-zA-Z]+/g) || []).length;

  // 计算阅读时间（分钟）
  const chineseMinutes = chineseChars / 300;
  const englishMinutes = englishWords / 200;
  const totalMinutes = Math.ceil(chineseMinutes + englishMinutes);

  // 最少 1 分钟
  const minutes = Math.max(1, totalMinutes);

  return {
    minutes,
    words: chineseChars + englishWords,
    text: `${minutes} 分钟阅读`,
  };
}

/**
 * 格式化阅读时间显示
 */
export function formatReadingTime(minutes: number): string {
  if (minutes < 1) {
    return '小于 1 分钟';
  }
  return `${minutes} 分钟阅读`;
}
