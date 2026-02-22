/**
 * 联系方式 Footer 组件
 */

import Link from 'next/link'
import { Mail, Github, Linkedin, Twitter } from 'lucide-react'
import { profileData, siteConfig } from '@/lib/data/profile-data'

export default function Footer() {
  return (
    <footer id="contact" className="border-t bg-muted/50">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          {/* 左侧：个人信息 */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-foreground">
              {profileData.name}
            </h3>
            <p className="text-sm text-muted-foreground">
              {profileData.title}
            </p>
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} {siteConfig.name}
            </p>
          </div>

          {/* 中间：快速链接 */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground">
              快速导航
            </h4>
            <nav className="flex flex-col space-y-2">
              <Link
                href="#works"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                作品展示
              </Link>
              <Link
                href="#about"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                关于我
              </Link>
              <Link
                href="#contact"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                联系方式
              </Link>
            </nav>
          </div>

          {/* 右侧：联系方式和社交链接 */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground">
              联系我
            </h4>

            {/* 邮箱 */}
            <a
              href={`mailto:${profileData.email}`}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Mail className="h-4 w-4" />
              {profileData.email}
            </a>

            {/* 社交链接 */}
            <div className="flex flex-wrap gap-4">
              {profileData.socialLinks.github && (
                <Link
                  href={profileData.socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  title="GitHub"
                >
                  <Github className="h-5 w-5" />
                </Link>
              )}

              {profileData.socialLinks.linkedin && (
                <Link
                  href={profileData.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  title="LinkedIn"
                >
                  <Linkedin className="h-5 w-5" />
                </Link>
              )}

              {profileData.socialLinks.twitter && (
                <Link
                  href={profileData.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  title="Twitter"
                >
                  <Twitter className="h-5 w-5" />
                </Link>
              )}

              {profileData.socialLinks.bilibili && (
                <Link
                  href={profileData.socialLinks.bilibili}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                  title="Bilibili"
                >
                  📺 B站
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* 底部分隔线和版权 */}
        <div className="mt-8 border-t pt-8 text-center">
          <p className="text-xs text-muted-foreground">
            {siteConfig.description}
          </p>
        </div>
      </div>
    </footer>
  )
}
