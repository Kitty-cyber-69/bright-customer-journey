
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  Edit, 
  Trash, 
  CalendarDays 
} from 'lucide-react';
import { format, addDays, isSameDay } from 'date-fns';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from "@/hooks/use-toast";
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

// Types for events
interface CalendarEvent {
  id: number;
  title: string;
  description: string;
  date: Date;
  duration: number; // minutes
  type: 'meeting' | 'demo' | 'call';
}

// Sample event data
const initialEvents: CalendarEvent[] = [
  {
    id: 1,
    title: 'Client Meeting',
    description: 'Discuss project requirements',
    date: new Date(2025, 4, 10, 14, 0),
    duration: 60, // minutes
    type: 'meeting'
  },
  {
    id: 2,
    title: 'Product Demo',
    description: 'Show new features to potential client',
    date: new Date(2025, 4, 12, 10, 30),
    duration: 45,
    type: 'demo'
  },
  {
    id: 3,
    title: 'Follow-up Call',
    description: 'Touch base with Acme Corp',
    date: new Date(2025, 4, 12, 15, 0),
    duration: 30,
    type: 'call'
  }
];

const CalendarPage = () => {
  const { toast } = useToast();
  const [date, setDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'day'>('month');
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<CalendarEvent | null>(null);
  
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
    isSameDay(event.date, date)
  ).sort((a, b) => a.date.getTime() - b.date.getTime());

  const handleAddEvent = () => {
    setCurrentEvent({
      id: Date.now(),
      title: '',
      description: '',
      date: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 9, 0),
      duration: 30,
      type: 'meeting'
    });
    setIsEventDialogOpen(true);
  };

  const handleEditEvent = (event: CalendarEvent) => {
    setCurrentEvent({...event});
    setIsEventDialogOpen(true);
  };

  const handleDeleteEvent = (eventId: number) => {
    setEvents(events.filter(event => event.id !== eventId));
    toast({
      title: "Event deleted",
      description: "Event has been removed from your calendar"
    });
  };

  const handleSaveEvent = () => {
    if (!currentEvent?.title) {
      toast({
        title: "Error",
        description: "Please enter an event title",
        variant: "destructive"
      });
      return;
    }
    
    if (currentEvent.id) {
      setEvents(events.map(event => 
        event.id === currentEvent.id ? currentEvent : event
      ));
    } else {
      setEvents([...events, {...currentEvent, id: Date.now()}]);
    }
    
    setIsEventDialogOpen(false);
    toast({
      title: currentEvent.id ? "Event updated" : "Event created",
      description: `Your event "${currentEvent.title}" has been ${currentEvent.id ? 'updated' : 'added'}`
    });
  };

  return (
    <div>
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold">Calendar</h1>
            <p className="text-muted-foreground">Schedule and manage your meetings and tasks</p>
          </div>
          <Button onClick={handleAddEvent} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Event
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-lg border shadow-sm lg:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold flex items-center">
              <CalendarDays className="mr-2 h-4 w-4" />
              May 2025
            </h2>
          </div>
          
          <Calendar
            mode="single"
            selected={date}
            onSelect={(newDate) => newDate && setDate(newDate)}
            className="rounded-md"
          />
          
          <div className="mt-6">
            <h3 className="font-medium text-sm text-muted-foreground mb-3">UPCOMING</h3>
            <div className="space-y-2">
              {events
                .filter(event => event.date > new Date())
                .sort((a, b) => a.date.getTime() - b.date.getTime())
                .slice(0, 3)
                .map((event) => (
                  <div 
                    key={event.id} 
                    className="flex items-center justify-between p-3 rounded-md border hover:bg-slate-50 cursor-pointer"
                    onClick={() => setDate(event.date)}
                  >
                    <div>
                      <p className="font-medium text-sm">{event.title}</p>
                      <p className="text-xs text-muted-foreground">{format(event.date, 'MMM d, yyyy')}</p>
                    </div>
                    <div 
                      className={cn("text-xs px-2 py-1 rounded", 
                        getEventStyles(event.type).bg, 
                        getEventStyles(event.type).text
                      )}
                    >
                      {format(event.date, 'h:mm a')}
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className="mt-6">
            <h3 className="font-medium text-sm text-muted-foreground mb-3">EMAIL REMINDERS</h3>
            <Card className="bg-slate-50 border-slate-200">
              <CardHeader className="pb-2">
                <h4 className="text-sm font-semibold">EmailJS Configuration</h4>
              </CardHeader>
              <CardContent className="text-sm text-slate-500">
                Configure EmailJS to receive reminders for your upcoming events
              </CardContent>
            </Card>
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
              <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value as 'day' | 'month')}>
                <ToggleGroupItem value="day">Day</ToggleGroupItem>
                <ToggleGroupItem value="month">Month</ToggleGroupItem>
              </ToggleGroup>
              <Button size="sm" variant="outline" onClick={handleAddEvent}>
                <Plus className="h-4 w-4 mr-2" />
                Add Event
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
                          <div className={cn("text-xs rounded-full px-2 py-0.5 inline-block mb-1", styles.bg, styles.text)}>
                            {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                          </div>
                          <h4 className="font-medium">{event.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                          <p className="text-xs mt-2 text-muted-foreground flex items-center">
                            <CalendarDays className="h-3 w-3 mr-1" />
                            {formatTimeRange(event.date, event.duration)}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="icon" variant="ghost" onClick={() => handleEditEvent(event)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost" className="text-red-500" 
                            onClick={() => handleDeleteEvent(event.id)}>
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 text-muted-foreground bg-slate-50 rounded-lg border-dashed border-2 border-slate-200">
              <CalendarDays className="h-12 w-12 mx-auto mb-3 text-slate-300" />
              <p>No events scheduled for this day</p>
              <Button variant="outline" className="mt-4" onClick={handleAddEvent}>
                <Plus className="mr-2 h-4 w-4" />
                Add Event
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Event Dialog */}
      <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{currentEvent?.id ? 'Edit Event' : 'Create New Event'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input 
                id="title" 
                value={currentEvent?.title || ''} 
                onChange={(e) => currentEvent && setCurrentEvent({...currentEvent, title: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select 
                value={currentEvent?.type}
                onValueChange={(value) => currentEvent && setCurrentEvent({...currentEvent, type: value as 'meeting' | 'demo' | 'call'})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="meeting">Meeting</SelectItem>
                  <SelectItem value="demo">Demo</SelectItem>
                  <SelectItem value="call">Call</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date & Time</Label>
              <Input 
                id="date" 
                type="datetime-local"
                value={currentEvent?.date ? format(currentEvent.date, "yyyy-MM-dd'T'HH:mm") : ''} 
                onChange={(e) => {
                  if (currentEvent && e.target.value) {
                    const newDate = new Date(e.target.value);
                    setCurrentEvent({...currentEvent, date: newDate});
                  }
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input 
                id="duration" 
                type="number" 
                min={15}
                step={15}
                value={currentEvent?.duration || 30} 
                onChange={(e) => currentEvent && setCurrentEvent({...currentEvent, duration: parseInt(e.target.value)})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                value={currentEvent?.description || ''} 
                onChange={(e) => currentEvent && setCurrentEvent({...currentEvent, description: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEventDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveEvent}>{currentEvent?.id ? 'Update Event' : 'Create Event'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CalendarPage;
