
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { cn } from '@/lib/utils';

const events = [
  {
    id: 1,
    title: 'Client Meeting',
    description: 'Discuss project requirements',
    date: new Date(2023, 4, 10, 14, 0),
    duration: 60, // minutes
    type: 'meeting'
  },
  {
    id: 2,
    title: 'Product Demo',
    description: 'Show new features to potential client',
    date: new Date(2023, 4, 12, 10, 30),
    duration: 45,
    type: 'demo'
  },
  {
    id: 3,
    title: 'Follow-up Call',
    description: 'Touch base with Acme Corp',
    date: new Date(2023, 4, 12, 15, 0),
    duration: 30,
    type: 'call'
  }
];

const CalendarPage = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'day'>('month');
  
  const eventTypes = {
    meeting: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' },
    demo: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200' },
    call: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200' },
    default: { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200' }
  };
  
  const getEventStyles = (type: string) => {
    return eventTypes[type as keyof typeof eventTypes] || eventTypes.default;
  };
  
  const formatTimeRange = (start: Date, durationMinutes: number) => {
    const end = new Date(start.getTime() + durationMinutes * 60000);
    return `${format(start, 'h:mm a')} - ${format(end, 'h:mm a')}`;
  };
  
  const todaysEvents = events.filter(event => 
    format(event.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
  ).sort((a, b) => a.date.getTime() - b.date.getTime());

  return (
    <div>
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold">Calendar</h1>
            <p className="text-muted-foreground">Schedule and manage your meetings and tasks</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Event
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-lg border shadow-sm lg:col-span-1">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(newDate) => newDate && setDate(newDate)}
            className="rounded-md"
          />
          
          <div className="mt-6">
            <h3 className="font-medium text-sm text-muted-foreground mb-3">UPCOMING</h3>
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => {
                const day = addDays(new Date(), i + 1);
                return (
                  <div key={i} className="flex items-center justify-between p-3 rounded-md border hover:bg-slate-50 cursor-pointer">
                    <div>
                      <p className="font-medium">{format(day, 'EEEE')}</p>
                      <p className="text-sm text-muted-foreground">{format(day, 'MMM d, yyyy')}</p>
                    </div>
                    <div className="text-sm bg-slate-100 px-2 py-0.5 rounded">
                      {Math.floor(Math.random() * 5)} events
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-lg border shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={() => setDate(addDays(date, -1))}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="font-medium text-lg">
                {format(date, 'EEEE, MMMM d, yyyy')}
              </div>
              <Button variant="outline" size="icon" onClick={() => setDate(addDays(date, 1))}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'day' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('day')}
              >
                Day
              </Button>
              <Button
                variant={viewMode === 'month' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('month')}
              >
                Month
              </Button>
            </div>
          </div>
          
          {todaysEvents.length > 0 ? (
            <div className="space-y-3">
              {todaysEvents.map((event) => {
                const styles = getEventStyles(event.type);
                return (
                  <Card key={event.id} className={cn("border", styles.border)}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className={cn("text-sm rounded-full px-2 py-0.5 inline-block mb-1", styles.bg, styles.text)}>
                            {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                          </div>
                          <h4 className="font-medium">{event.title}</h4>
                          <p className="text-sm text-muted-foreground">{event.description}</p>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {formatTimeRange(event.date, event.duration)}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <p>No events scheduled for this day</p>
              <Button variant="outline" className="mt-3">
                <Plus className="mr-2 h-4 w-4" />
                Add Event
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
