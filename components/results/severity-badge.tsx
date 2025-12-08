'use client'

import { XCircle, AlertTriangle, AlertCircle } from 'lucide-react'

interface SeverityBadgeProps {
  index: number
  total: number
}

export function SeverityBadge({ index, total }: SeverityBadgeProps) {
  const severity =
    index < total / 3
      ? 'critical'
      : index < (total * 2) / 3
      ? 'warning'
      : 'minor'

  const config = {
    critical: {
      icon: XCircle,
      color: 'text-red-500 bg-red-500/10 border-red-500/30',
      label: 'Critical',
    },
    warning: {
      icon: AlertTriangle,
      color: 'text-orange-500 bg-orange-500/10 border-orange-500/30',
      label: 'Warning',
    },
    minor: {
      icon: AlertCircle,
      color: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30',
      label: 'Minor',
    },
  }

  const { icon: Icon, color, label } = config[severity]

  return (
    <div
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${color}`}
    >
      <Icon className='w-3 h-3' />
      {label}
    </div>
  )
}
