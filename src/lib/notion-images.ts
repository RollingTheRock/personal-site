/**
 * Notion Image Download Utility
 * Downloads images from Notion API to local storage to avoid expired URLs
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const IMAGE_DIR = 'dist/images/notion';

// Ensure directory exists
function ensureDir() {
  if (!fs.existsSync(IMAGE_DIR)) {
    fs.mkdirSync(IMAGE_DIR, { recursive: true });
  }
}

/**
 * Download image from URL and save to local storage
 * Returns local path if successful, original URL if failed
 */
export async function downloadNotionImage(url: string): Promise<string> {
  if (!url) return '';

  // Skip if already a local URL
  if (url.startsWith('/images/') || url.startsWith('./') || url.startsWith('http://localhost')) {
    return url;
  }

  // Skip external URLs (not from Notion)
  if (!url.includes('amazonaws.com') && !url.includes('notion.so') && !url.includes('notion-static.com')) {
    return url;
  }

  ensureDir();

  try {
    // Use URL hash as filename (without query params)
    const hash = crypto.createHash('md5').update(url.split('?')[0]).digest('hex');
    const ext = getExtension(url);
    const filename = `${hash}${ext}`;
    const filepath = path.join(IMAGE_DIR, filename);

    // Return cached path if already downloaded
    if (fs.existsSync(filepath)) {
      return `/images/notion/${filename}`;
    }

    // Download image
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.0'
      }
    });

    if (!res.ok) {
      console.warn(`Failed to download image (${res.status}): ${url.substring(0, 100)}...`);
      return url; // fallback to original URL
    }

    const buffer = Buffer.from(await res.arrayBuffer());

    // Validate it's an image (check magic bytes)
    if (!isValidImage(buffer)) {
      console.warn(`Invalid image data from: ${url.substring(0, 100)}...`);
      return url;
    }

    fs.writeFileSync(filepath, buffer);
    console.log(`Downloaded image: ${filename}`);

    return `/images/notion/${filename}`;
  } catch (error) {
    console.warn(`Error downloading image: ${error}`);
    return url; // fallback to original URL
  }
}

/**
 * Get file extension from URL
 */
function getExtension(url: string): string {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const ext = path.extname(pathname).toLowerCase();

    // Validate common image extensions
    const validExts = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp'];
    if (validExts.includes(ext)) {
      return ext;
    }

    // Try to detect from content-type in URL or default to .png
    if (url.includes('.jpg') || url.includes('.jpeg')) return '.jpg';
    if (url.includes('.png')) return '.png';
    if (url.includes('.gif')) return '.gif';
    if (url.includes('.webp')) return '.webp';
    if (url.includes('.svg')) return '.svg';

    return '.png';
  } catch {
    return '.png';
  }
}

/**
 * Validate image by checking magic bytes
 */
function isValidImage(buffer: Buffer): boolean {
  if (buffer.length < 4) return false;

  // JPEG: FF D8 FF
  if (buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF) return true;

  // PNG: 89 50 4E 47
  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) return true;

  // GIF: 47 49 46 38
  if (buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x38) return true;

  // WebP: RIFF....WEBP
  if (buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46) {
    if (buffer.length >= 12 && buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50) {
      return true;
    }
  }

  // SVG: starts with <?xml or <svg
  const header = buffer.toString('utf8', 0, 100).toLowerCase();
  if (header.includes('<?xml') || header.includes('<svg')) return true;

  return false;
}

/**
 * Process image URL - returns local path for Notion images, original for others
 */
export async function processImageUrl(url: string | undefined): Promise<string> {
  if (!url) return '';
  return downloadNotionImage(url);
}
