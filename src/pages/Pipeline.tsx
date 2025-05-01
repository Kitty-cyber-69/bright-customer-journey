
import { useState } from 'react';
import PipelineStage from '@/components/pipeline/PipelineStage';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus } from 'lucide-react';

interface Stage {
  id: string;
  title: string;
  items: any[];
}

// Example pipeline data
const pipelineData = [
  {
    id: "lead",
    title: "Leads",
    items: [
      { title: "Website redesign", company: "Acme Corp", value: 12000, probability: 20 },
      { title: "Software implementation", company: "Globex", value: 24000, probability: 30, daysInStage: 5 },
      { title: "Consulting services", company: "Initech", value: 4500, probability: 25, daysInStage: 2 }
    ]
  },
  {
    id: "qualified",
    title: "Qualified",
    items: [
      { title: "Annual contract", company: "Massive Dynamic", value: 48000, probability: 50, daysInStage: 7 },
      { title: "Security upgrade", company: "Cyberdyne Systems", value: 36000, probability: 60, daysInStage: 3 }
    ]
  },
  {
    id: "proposal",
    title: "Proposal",
    items: [
      { title: "Enterprise package", company: "Stark Industries", value: 95000, probability: 75, daysInStage: 10 },
      { title: "Managed services", company: "Wayne Enterprises", value: 72000, probability: 80, daysInStage: 4 }
    ]
  },
  {
    id: "negotiation",
    title: "Negotiation",
    items: [
      { title: "Platform migration", company: "Umbrella Corp", value: 120000, probability: 90, daysInStage: 8 }
    ]
  },
  {
    id: "won",
    title: "Won",
    items: [
      { title: "Cloud storage solution", company: "Hooli", value: 65000, probability: 100, daysInStage: 0 },
      { title: "Data analysis tools", company: "Pied Piper", value: 42000, probability: 100, daysInStage: 0 }
    ]
  }
];

const Pipeline = () => {
  const [view, setView] = useState<string>("all");
  
  const calculateTotal = (stage: Stage) => {
    return stage.items.reduce((sum, item) => sum + item.value, 0);
  };

  return (
    <div>
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold">Sales Pipeline</h1>
            <p className="text-muted-foreground">Manage your deals through the sales process</p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={view} onValueChange={setView}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="View" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Deals</SelectItem>
                <SelectItem value="my">My Deals</SelectItem>
                <SelectItem value="team">Team Deals</SelectItem>
              </SelectContent>
            </Select>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Deal
            </Button>
          </div>
        </div>
        
        {/* Pipeline summary stats */}
        <div className="flex gap-6 mb-6">
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="text-sm text-muted-foreground">Total Pipeline Value</div>
            <div className="text-2xl font-bold">
              ${pipelineData.reduce((acc, stage) => acc + calculateTotal(stage), 0).toLocaleString()}
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="text-sm text-muted-foreground">Average Deal Size</div>
            <div className="text-2xl font-bold">
              ${Math.round(pipelineData.reduce((acc, stage) => acc + calculateTotal(stage), 0) / 
                pipelineData.reduce((acc, stage) => acc + stage.items.length, 0)).toLocaleString()}
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="text-sm text-muted-foreground">Total Deals</div>
            <div className="text-2xl font-bold">
              {pipelineData.reduce((acc, stage) => acc + stage.items.length, 0)}
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex gap-4 overflow-x-auto pb-6 px-1">
        {pipelineData.map((stage) => (
          <PipelineStage 
            key={stage.id}
            title={stage.title}
            count={stage.items.length}
            totalValue={calculateTotal(stage)}
            items={stage.items}
          />
        ))}
      </div>
    </div>
  );
};

export default Pipeline;
