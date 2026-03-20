export function MessageBubble({
  isOwn,
  content,
  time,
}: {
  isOwn: boolean
  content: string
  time: string
}) {
  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} group`}>
      <div className={`flex flex-col max-w-[85%] md:max-w-[70%] ${isOwn ? 'items-end' : 'items-start'}`}>
        <div
          className={`px-4 py-2.5 shadow-sm relative ${
            isOwn
              ? 'bg-indigo-600 text-white rounded-2xl rounded-tr-sm shadow-indigo-600/10'
              : 'bg-white border border-slate-100 text-slate-800 rounded-2xl rounded-tl-sm'
          }`}
        >
          <p className="text-[15px] leading-relaxed break-words">{content}</p>
        </div>
        <div className="flex items-center gap-1 mt-1 px-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-[11px] font-medium text-slate-400">{time}</span>
          {isOwn && (
            <svg className="w-3 h-3 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      </div>
    </div>
  )
}
