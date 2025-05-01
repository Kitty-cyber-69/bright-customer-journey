
import { BarChart3, Users, CreditCard, TrendingUp } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: "Jan", value: 40000 },
  { name: "Feb", value: 30000 },
  { name: "Mar", value: 45000 },
  { name: "Apr", value: 52000 },
  { name: "May", value: 61000 },
  { name: "Jun", value: 58000 },
  { name: "Jul", value: 71000 },
];

const activities = [
  {
    type: 'call' as const,
    title: 'Call with Michael Scott',
    description: 'Discussed paper supply needs for next quarter',
    time: '1 hour ago',
    user: {
      name: 'John Smith',
      initials: 'JS',
    },
  },
  {
    type: 'email' as const,
    title: 'Email to Acme Inc.',
    description: 'Sent proposal for enterprise solution',
    time: '3 hours ago',
    user: {
      name: 'Sarah Davis',
      initials: 'SD',
    },
  },
  {
    type: 'meeting' as const,
    title: 'Product demo',
    description: 'Presented new features to Dunder Mifflin',
    time: 'Yesterday',
    user: {
      name: 'John Smith',
      initials: 'JS',
    },
  },
  {
    type: 'task' as const,
    title: 'Follow up with client',
    description: 'Send additional information requested by client',
    time: 'Yesterday',
    user: {
      name: 'Sarah Davis',
      initials: 'SD',
    },
  },
];

const Dashboard = () => {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Your sales performance at a glance</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard 
          title="Total Revenue" 
          value="$358,642" 
          icon={<CreditCard size={18} />}
          change={12.5}
        />
        <StatCard 
          title="Active Customers" 
          value="2,542" 
          icon={<Users size={18} />}
          change={-2.7}
        />
        <StatCard 
          title="Conversion Rate" 
          value="32.8%" 
          icon={<TrendingUp size={18} />}
          change={4.1}
        />
        <StatCard 
          title="Deals Won" 
          value="342" 
          icon={<BarChart3 size={18} />}
          change={8.3}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="name" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#888', fontSize: 12 }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#888', fontSize: 12 }}
                    tickFormatter={(value) => `$${value.toLocaleString()}`}
                  />
                  <CartesianGrid vertical={false} stroke="#EEE" />
                  <Tooltip 
                    formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
                    contentStyle={{ 
                      borderRadius: '0.375rem',
                      boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
                      border: '1px solid #e5e7eb'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorRevenue)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <ActivityFeed
          title="Recent Activities"
          activities={activities}
          className="h-full"
        />
      </div>
    </div>
  );
};

export default Dashboard;
