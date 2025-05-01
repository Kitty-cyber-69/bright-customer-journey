
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChevronLeft, 
  ChevronRight, 
  LayoutDashboard, 
  Users, 
  LineChart, 
  ListTodo, 
  Settings,
  CalendarDays
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Users, label: 'Customers', path: '/customers' },
    { icon: CalendarDays, label: 'Calendar', path: '/calendar' },
    { icon: ListTodo, label: 'Pipeline', path: '/pipeline' },
    { icon: LineChart, label: 'Analytics', path: '/analytics' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <aside className={cn(
      "h-screen sticky top-0 bg-sidebar border-r border-sidebar-border transition-all duration-300",
      collapsed ? "w-[70px]" : "w-[240px]"
    )}>
      <div className="p-4 flex items-center justify-between border-b border-sidebar-border">
        {!collapsed && (
          <div className="font-bold text-xl text-crm-blue-800">
            SalesCRM
          </div>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          className={cn("ml-auto")}
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>
      <nav className="p-2">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link 
                to={item.path}
                className={cn(
                  "flex items-center gap-3 p-2.5 rounded-md text-slate-600 hover:text-crm-blue-700 hover:bg-crm-blue-50 transition-colors",
                  window.location.pathname === item.path && "bg-crm-blue-50 text-crm-blue-700 font-medium"
                )}
              >
                <item.icon size={20} />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
