
import { ReactNode } from 'react';
import { Phone, Mail, Calendar, MessageSquare, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type ActivityType = 'call' | 'email' | 'meeting' | 'note' | 'task';

interface ActivityItemProps {
  type: ActivityType;
  title: string;
  description: string;
  time: string;
  user?: {
    name: string;
    avatar?: string;
    initials: string;
  };
  done?: boolean;
}

const iconMap: Record<ActivityType, ReactNode> = {
  call: <Phone size={16} />,
  email: <Mail size={16} />,
  meeting: <Calendar size={16} />,
  note: <MessageSquare size={16} />,
  task: <Clock size={16} />,
};

const ActivityItem = ({ type, title, description, time, user, done }: ActivityItemProps) => {
  return (
    <div className="activity-item">
      <div className={cn(
        "p-2 rounded-full", 
        {
          'bg-blue-100 text-blue-600': type === 'call',
          'bg-purple-100 text-purple-600': type === 'email',
          'bg-amber-100 text-amber-600': type === 'meeting',
          'bg-green-100 text-green-600': type === 'note',
          'bg-slate-100 text-slate-600': type === 'task',
        }
      )}>
        {iconMap[type]}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <h4 className="font-medium text-sm">{title}</h4>
          <span className="text-xs text-slate-500 whitespace-nowrap ml-2">{time}</span>
        </div>
        <p className="text-sm text-slate-600 mt-0.5 line-clamp-2">{description}</p>
        {user && (
          <div className="mt-1.5 flex items-center">
            <Avatar className="h-5 w-5 mr-1.5">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="text-[10px]">{user.initials}</AvatarFallback>
            </Avatar>
            <span className="text-xs text-slate-500">{user.name}</span>
          </div>
        )}
      </div>
    </div>
  );
};

interface ActivityFeedProps {
  title?: string;
  activities: ActivityItemProps[];
  className?: string;
}

const ActivityFeed = ({ title = "Recent Activity", activities, className }: ActivityFeedProps) => {
  return (
    <div className={cn("bg-white rounded-lg border shadow-sm p-5", className)}>
      <h3 className="font-semibold mb-4">{title}</h3>
      <div className="space-y-1">
        {activities.map((activity, i) => (
          <ActivityItem key={i} {...activity} />
        ))}
      </div>
    </div>
  );
};

export default ActivityFeed;
