'use client'

interface ScoreMeterProps {
  score: number
}

export function ScoreMeter({ score }: ScoreMeterProps) {
  const getScoreColor = (score: number) => {
    if (score <= 3) return 'text-red-500'
    if (score <= 5) return 'text-orange-500'
    if (score <= 7) return 'text-yellow-500'
    return 'text-green-500'
  }

  const getScoreLabel = (score: number) => {
    if (score <= 2) return 'Disaster'
    if (score <= 3) return 'Rough'
    if (score <= 4) return 'Needs Work'
    if (score <= 5) return 'Mediocre'
    if (score <= 6) return 'Decent'
    if (score <= 7) return 'Good'
    if (score <= 8) return 'Great'
    if (score <= 9) return 'Excellent'
    return 'Perfect'
  }

  const getScoreEmoji = (score: number) => {
    if (score <= 2) return '💀'
    if (score <= 3) return '😬'
    if (score <= 4) return '😕'
    if (score <= 5) return '😐'
    if (score <= 6) return '🙂'
    if (score <= 7) return '😊'
    if (score <= 8) return '😄'
    if (score <= 9) return '🤩'
    return '🏆'
  }

  return (
    <div className='flex flex-col items-center gap-2'>
      <div className='relative'>
        <svg className='w-32 h-32 transform -rotate-90'>
          <circle
            cx='64'
            cy='64'
            r='56'
            stroke='currentColor'
            strokeWidth='8'
            fill='none'
            className='text-secondary'
          />
          <circle
            cx='64'
            cy='64'
            r='56'
            stroke='currentColor'
            strokeWidth='8'
            fill='none'
            strokeDasharray={`${(score / 10) * 352} 352`}
            className={getScoreColor(score)}
            strokeLinecap='round'
          />
        </svg>
        <div className='absolute inset-0 flex flex-col items-center justify-center'>
          <span className={`text-4xl font-black ${getScoreColor(score)}`}>
            {score}
          </span>
          <span className='text-xs text-muted-foreground'>/10</span>
        </div>
      </div>
      <div className='flex items-center gap-2'>
        <span className='text-2xl'>{getScoreEmoji(score)}</span>
        <span className='font-semibold text-lg'>{getScoreLabel(score)}</span>
      </div>
    </div>
  )
}
