
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  LineChart, 
  BarChart, 
  Line, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

const monthlyData = [
  { name: "Jan", revenue: 42000, target: 45000, deals: 12 },
  { name: "Feb", revenue: 47500, target: 45000, deals: 15 },
  { name: "Mar", revenue: 51000, target: 50000, deals: 18 },
  { name: "Apr", revenue: 58000, target: 50000, deals: 21 },
  { name: "May", revenue: 57000, target: 55000, deals: 19 },
  { name: "Jun", revenue: 61500, target: 55000, deals: 22 },
  { name: "Jul", revenue: 68000, target: 60000, deals: 25 },
  { name: "Aug", revenue: 72000, target: 60000, deals: 28 },
  { name: "Sep", revenue: 76000, target: 65000, deals: 30 },
  { name: "Oct", revenue: 81000, target: 65000, deals: 32 },
  { name: "Nov", revenue: 86000, target: 70000, deals: 35 },
  { name: "Dec", revenue: 95000, target: 70000, deals: 40 },
];

const sourcesData = [
  { name: "Website", value: 35 },
  { name: "Referrals", value: 25 },
  { name: "Direct", value: 20 },
  { name: "Social", value: 15 },
  { name: "Other", value: 5 },
];

const COLORS = ['#3B82F6', '#8B5CF6', '#EC4899', '#F97316', '#10B981'];

const salesByRep = [
  { name: "John Smith", value: 350000 },
  { name: "Sarah Davis", value: 310000 },
  { name: "Michael Johnson", value: 290000 },
  { name: "Emily Brown", value: 270000 },
  { name: "David Wilson", value: 220000 },
];

const Analytics = () => {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">Track your sales performance and metrics</p>
      </div>
      
      <Tabs defaultValue="overview" className="mb-8">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="leads">Leads</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Revenue vs Target</CardTitle>
                <CardDescription>Monthly revenue performance compared to targets</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" tick={{ fill: '#888', fontSize: 12 }} />
                      <YAxis 
                        tickFormatter={(value) => `$${value/1000}k`}
                        tick={{ fill: '#888', fontSize: 12 }} 
                      />
                      <Tooltip 
                        formatter={(value: number) => [`$${value.toLocaleString()}`, 'Amount']}
                        contentStyle={{ 
                          borderRadius: '0.375rem',
                          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
                          border: '1px solid #e5e7eb'
                        }}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#3B82F6" 
                        strokeWidth={3} 
                        activeDot={{ r: 6 }} 
                        name="Actual Revenue"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="target" 
                        stroke="#9CA3AF" 
                        strokeWidth={2} 
                        strokeDasharray="5 5" 
                        name="Target"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Lead Sources</CardTitle>
                <CardDescription>Distribution of customer acquisition channels</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={sourcesData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {sourcesData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: number) => [`${value}%`, 'Percentage']}
                        contentStyle={{ 
                          borderRadius: '0.375rem',
                          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
                          border: '1px solid #e5e7eb'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="revenue">
          <Card>
            <CardHeader>
              <CardTitle>Revenue by Month</CardTitle>
              <CardDescription>Monthly revenue breakdown for the current year</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => `$${value/1000}k`} />
                    <Tooltip 
                      formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
                      contentStyle={{ 
                        borderRadius: '0.375rem',
                        boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
                        border: '1px solid #e5e7eb'
                      }}
                    />
                    <Bar dataKey="revenue" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="leads">
          <Card>
            <CardHeader>
              <CardTitle>Deals Closed by Month</CardTitle>
              <CardDescription>Number of successful deals per month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="deals" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="team">
          <Card>
            <CardHeader>
              <CardTitle>Sales by Representative</CardTitle>
              <CardDescription>Top performing team members by revenue</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={salesByRep} 
                    layout="vertical" 
                    margin={{ top: 20, right: 30, left: 50, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                    <XAxis type="number" tickFormatter={(value) => `$${value/1000}k`} />
                    <YAxis type="category" dataKey="name" width={100} />
                    <Tooltip 
                      formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
                      contentStyle={{ 
                        borderRadius: '0.375rem',
                        boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
                        border: '1px solid #e5e7eb'
                      }}
                    />
                    <Bar dataKey="value" fill="#10B981" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;
