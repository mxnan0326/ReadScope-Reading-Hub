interface Props {
    tags: string[]
    selected: string | null
    onSelect: (tag: string | null) => void
}

export default function TagFilter({ tags, selected, onSelect }: Props) {
    return (
        <div className="px-6 pb-6">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => onSelect(null)}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200
              ${!selected
                                ? 'bg-accent text-white shadow-sm shadow-accent/30'
                                : 'bg-white text-textSecondary border border-[#e8efe6] hover:border-accent/40 hover:text-accent'
                            }`}
                    >
                        全部
                    </button>
                    {tags.map(tag => (
                        <button
                            key={tag}
                            onClick={() => onSelect(tag === selected ? null : tag)}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200
                ${selected === tag
                                    ? 'bg-accent text-white shadow-sm shadow-accent/30'
                                    : 'bg-white text-textSecondary border border-[#e8efe6] hover:border-accent/40 hover:text-accent'
                                }`}
                        >
                            {tag}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}
