// 已移除 Sparkles 导入

interface Props {
    total: number
}

export default function HeroSection({ total }: Props) {
    return (
        <section className="pt-16 pb-10 px-6 text-center">
            <div className="max-w-2xl mx-auto">
                {/*作者移除*/}

                <h1 className="text-4xl sm:text-5xl font-bold text-textPrimary leading-tight mb-4">
                    阅界
                    <span className="text-accent">·</span>
                    收藏馆
                </h1>

                <p className="text-textSecondary text-lg leading-relaxed mb-8">
                    在信息的洪流里，沉淀真正值得阅读的声音。
                    <br className="hidden sm:block" />
                    科技 · 成长 · 心理 · 育儿 · 中医
                </p>

                <div className="inline-flex items-center gap-2 bg-white rounded-2xl px-5 py-3
                        shadow-sm border border-[#e8efe6]">
                    <span className="text-2xl font-bold text-textPrimary">{total}</span>
                    <span className="text-textSecondary text-sm">篇精选内容</span>
                </div>
            </div>
        </section>
    )
}
