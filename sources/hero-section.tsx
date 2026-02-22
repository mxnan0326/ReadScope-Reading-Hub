/**
 * Hero + 个人介绍区组件
 */

import { HeroHeader } from '@/components/header'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { profileData } from '@/lib/data/profile-data'

export default function HeroSection() {
  // 获取名字的首字母作为头像 fallback
  const initials = profileData.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <>
      <HeroHeader />

      {/* Hero 个人介绍区 */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background -z-10" />

        <div className="mx-auto max-w-5xl px-6">
          <div className="flex flex-col items-center text-center space-y-8">
            {/* 头像 */}
            <Avatar className="h-24 w-24 md:h-32 md:w-32 ring-4 ring-primary/10">
              <AvatarImage src={profileData.avatar} alt={profileData.name} />
              <AvatarFallback className="text-2xl md:text-3xl bg-primary/10">
                {initials}
              </AvatarFallback>
            </Avatar>

            {/* 标题和简介 */}
            <div className="space-y-4 max-w-2xl">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                {profileData.name}
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground">
                {profileData.title}
              </p>

              {/* 自我介绍 */}
              <div className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {profileData.bio}
              </div>
            </div>

            {/* CTA 按钮 */}
            <div className="flex items-center gap-4 flex-wrap justify-center">
              <Button asChild size="lg">
                <Link href="#works">
                  查看作品
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href={`mailto:${profileData.email}`}>
                  联系我
                </Link>
              </Button>
            </div>

            {/* 技能标签预览 */}
            {profileData.skills.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-center max-w-2xl">
                {profileData.skills.slice(0, 6).map((skill, index) => (
                  <Badge key={index} variant="secondary" className="text-sm">
                    {skill}
                  </Badge>
                ))}
                {profileData.skills.length > 6 && (
                  <Badge variant="outline" className="text-sm">
                    +{profileData.skills.length - 6}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
