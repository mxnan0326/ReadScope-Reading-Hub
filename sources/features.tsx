/**
 * 技能栈展示组件
 */

import { Badge } from '@/components/ui/badge'
import { profileData } from '@/lib/data/profile-data'
import { Sparkles, Cpu, Palette, Code } from 'lucide-react'

export default function SkillsSection() {
  // 按类别分组技能
  const aiTools = profileData.skills.filter(s =>
    ['Midjourney', 'Stable Diffusion', 'DALL-E', 'Suno', 'Runway', 'AI', 'Claude', 'GPT'].some(t => s.toLowerCase().includes(t.toLowerCase()))
  )

  const devTools = profileData.skills.filter(s =>
    ['Next', 'React', 'TypeScript', 'Python', 'Tailwind', 'Node', 'Vue'].some(t => s.toLowerCase().includes(t.toLowerCase()))
  )

  const otherTools = profileData.skills.filter(s =>
    !aiTools.includes(s) && !devTools.includes(s)
  )

  return (
    <section id="about" className="py-16 md:py-24 bg-muted/30">
      <div className="mx-auto max-w-5xl px-6">
        {/* 标题 */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-6 w-6 text-primary" />
            <h2 className="text-3xl font-bold">技能栈</h2>
          </div>
          <p className="text-muted-foreground">
            我使用的工具和技术
          </p>
        </div>

        {/* 技能分类展示 */}
        <div className="grid gap-8 md:grid-cols-3">
          {/* AI 工具 */}
          {aiTools.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-purple-500" />
                <h3 className="font-semibold">AI 创作</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {aiTools.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="text-sm">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* 开发工具 */}
          {devTools.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Code className="h-5 w-5 text-blue-500" />
                <h3 className="font-semibold">开发工具</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {devTools.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="text-sm">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* 其他工具 */}
          {otherTools.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Cpu className="h-5 w-5 text-green-500" />
                <h3 className="font-semibold">其他工具</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {otherTools.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="text-sm">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 全部技能展示（如果分类不适用） */}
        {aiTools.length === 0 && devTools.length === 0 && otherTools.length === 0 && (
          <div className="flex flex-wrap gap-2 justify-center max-w-2xl mx-auto">
            {profileData.skills.map((skill, index) => (
              <Badge key={index} variant="outline" className="text-sm">
                {skill}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
