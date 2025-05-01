
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Plus, ChevronLeft, ChevronRight, Edit, Trash, Mail } from 'lucide-react';
import { format, addDays, isSameDay } from 'date-fns';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
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
  const { toast } = useToast();
  const [date, setDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'day'>('month');
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<CalendarEvent | null>(null);
  
  // For email reminders
  const [emailJsConfig, setEmailJsConfig] = useState({
    serviceId: '',
    templateId: '',
    userId: '',
    enabled: false
  });
  
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

    // Send email reminder if configured
    if (emailJsConfig.enabled && emailJsConfig.serviceId && emailJsConfig.templateId && emailJsConfig.userId) {
      toast({
        title: "Email Reminder",
        description: "Email reminder would be set up (requires EmailJS configuration)"
      });
    }
  };

  const saveEmailJsConfig = () => {
    setEmailJsConfig({...emailJsConfig, enabled: true});
    toast({
      title: "Email config saved",
      description: "Your EmailJS configuration has been saved"
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
          <Button onClick={handleAddEvent}>
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
            className="rounded-md pointer-events-auto"
          />
          
          <div className="mt-6">
            <h3 className="font-medium text-sm text-muted-foreground mb-3">UPCOMING</h3>
            <div className="space-y-3">
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
                      <p className="font-medium">{event.title}</p>
                      <p className="text-sm text-muted-foreground">{format(event.date, 'MMM d, yyyy')}</p>
                    </div>
                    <div 
                      className={cn("text-sm px-2 py-0.5 rounded", 
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
            <Card>
              <CardHeader className="pb-3">
                <h4 className="text-sm font-semibold">EmailJS Configuration</h4>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="serviceId">Service ID</Label>
                  <Input 
                    id="serviceId" 
                    value={emailJsConfig.serviceId}
                    onChange={(e) => setEmailJsConfig({...emailJsConfig, serviceId: e.target.value})}
                    placeholder="EmailJS Service ID"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="templateId">Template ID</Label>
                  <Input 
                    id="templateId"
                    value={emailJsConfig.templateId}
                    onChange={(e) => setEmailJsConfig({...emailJsConfig, templateId: e.target.value})}
                    placeholder="EmailJS Template ID"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="userId">User ID</Label>
                  <Input 
                    id="userId"
                    value={emailJsConfig.userId}
                    onChange={(e) => setEmailJsConfig({...emailJsConfig, userId: e.target.value})}
                    placeholder="EmailJS User ID"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={saveEmailJsConfig}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Save Email Config
                </Button>
              </CardFooter>
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
            <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value as 'day' | 'month')}>
              <ToggleGroupItem value="day">Day</ToggleGroupItem>
              <ToggleGroupItem value="month">Month</ToggleGroupItem>
            </ToggleGroup>
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
                          <p className="text-sm mt-1 text-muted-foreground">
                            {formatTimeRange(event.date, event.duration)}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="icon" variant="outline" onClick={() => handleEditEvent(event)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="outline" className="text-red-500" 
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
            <div className="text-center py-12 text-muted-foreground">
              <p>No events scheduled for this day</p>
              <Button variant="outline" className="mt-3" onClick={handleAddEvent}>
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
