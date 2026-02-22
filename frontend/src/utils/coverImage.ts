/**
 * 从 original_link 中提取 YouTube 视频 ID
 * 支持格式：
 *   https://www.youtube.com/watch?v=VIDEO_ID
 *   https://youtu.be/VIDEO_ID
 */
function extractYouTubeId(url: string): string | null {
    if (!url) return null
    const patterns = [
        /youtube\.com\/watch\?(?:.*&)?v=([^&\s]+)/,
        /youtu\.be\/([^?&\s]+)/,
        /youtube\.com\/embed\/([^?&\s]+)/,
    ]
    for (const p of patterns) {
        const m = url.match(p)
        if (m) return m[1]
    }
    return null
}

/**
 * 获取文章封面图 URL：
 * 1. 优先使用 cover_image 字段（飞书下载的本地图片）
 * 2. 若 cover_image 为空，尝试从 original_link 提取 YouTube 缩略图
 * 3. 否则返回 null（使用渐变占位）
 */
export function getCoverImage(
    coverImage: string,
    originalLink: string,
    quality: 'hq' | 'mq' = 'hq'
): string | null {
    if (coverImage && coverImage.trim()) return coverImage

    const videoId = extractYouTubeId(originalLink)
    if (videoId) {
        // hqdefault = 480×360，mqdefault = 320×180，maxresdefault 不一定有
        return `https://img.youtube.com/vi/${videoId}/${quality}default.jpg`
    }

    return null
}
