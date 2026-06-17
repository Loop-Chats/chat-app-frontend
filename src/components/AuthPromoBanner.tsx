import type { LucideIcon } from 'lucide-react'
import { MessageSquare, Trophy, Users } from 'lucide-react'

type PromoFeature = {
  icon: LucideIcon
  title: string
  description: string
  iconColor: string
  iconBg: string
}

interface AuthPromoBannerProps {
  badgeText?: string
  title?: string
  highlight?: string
  description?: string
  features?: PromoFeature[]
}

const defaultFeatures: PromoFeature[] = [
  {
    icon: MessageSquare,
    title: 'Low-Latency Chat',
    description: 'Real-time data streaming built for intense matches.',
    iconColor: 'text-primary',
    iconBg: 'bg-primary/10',
  },
  {
    icon: Users,
    title: 'Guild Management',
    description: 'Organize parties, channels, and custom squads seamlessly.',
    iconColor: 'text-secondary',
    iconBg: 'bg-secondary/10',
  },
  {
    icon: Trophy,
    title: 'Level Up Experience',
    description: 'Customize user profiles, ranks, and show off achievements.',
    iconColor: 'text-accent',
    iconBg: 'bg-accent/10',
  },
]

const AuthPromoBanner = ({
  badgeText = '// Sync Network',
  title = 'Join Our',
  highlight = 'Community',
  description = 'Connect with players around the globe, coordinate live raid strategies, and share clips instantly.',
  features = defaultFeatures,
}: AuthPromoBannerProps) => (
  <div className="hidden lg:flex flex-col items-center justify-center bg-gradient-to-br from-base-200 via-base-300 to-primary/10 p-12 relative overflow-hidden">
    <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/5 blur-3xl rounded-full pointer-events-none" />
    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 blur-3xl rounded-full pointer-events-none" />

    <div className="max-w-md text-center space-y-8 relative z-10">
      <div className="space-y-3">
        <div className="badge badge-outline badge-primary font-mono tracking-widest text-xs py-2 px-3 uppercase">
          {badgeText}
        </div>
        <h2 className="text-4xl font-extrabold tracking-tight text-base-content font-mono uppercase">
          {title} <span className="text-primary drop-shadow-[0_0_10px_rgba(116,185,255,0.3)]">{highlight}</span>
        </h2>
        <p className="text-base-content/60 text-base leading-relaxed">{description}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 text-left">
        {features.map((feature) => {
          const Icon = feature.icon
          return (
            <div key={feature.title} className="flex items-center gap-4 bg-base-100/40 border border-base-100 p-4 rounded-xl backdrop-blur-sm">
              <div className={`p-3 ${feature.iconBg} rounded-lg ${feature.iconColor}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm uppercase font-mono text-base-content/90">{feature.title}</h4>
                <p className="text-xs text-base-content/60">{feature.description}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  </div>
)

export default AuthPromoBanner
