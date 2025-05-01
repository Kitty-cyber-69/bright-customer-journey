
import { cn } from "@/lib/utils";

interface PipelineItemProps {
  title: string;
  company: string;
  value: number;
  daysInStage?: number;
  probability?: number;
  onClick?: () => void;
}

const PipelineItem = ({ title, company, value, daysInStage, probability, onClick }: PipelineItemProps) => {
  return (
    <div className="pipeline-card mb-3 animate-fade-in" onClick={onClick}>
      <h4 className="text-sm font-medium">{title}</h4>
      <p className="text-xs text-muted-foreground mb-2">{company}</p>
      <div className="flex justify-between items-center">
        <span className="font-semibold">${value.toLocaleString()}</span>
        {probability && (
          <span 
            className={cn(
              "text-xs px-2 py-0.5 rounded-full",
              probability >= 70 ? "bg-green-100 text-green-800" :
              probability >= 40 ? "bg-amber-100 text-amber-800" :
              "bg-red-100 text-red-800"
            )}
          >
            {probability}%
          </span>
        )}
      </div>
      {daysInStage && (
        <div className="mt-2 text-xs text-slate-500">
          {daysInStage} days in stage
        </div>
      )}
    </div>
  );
};

interface PipelineStageProps {
  title: string;
  count: number;
  totalValue: number;
  items: Omit<PipelineItemProps, "onClick">[];
}

const PipelineStage = ({ title, count, totalValue, items }: PipelineStageProps) => {
  return (
    <div className="w-72 shrink-0 bg-slate-50 rounded-md p-3 border">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-medium">{title}</h3>
        <span className="text-xs bg-slate-200 px-2 py-0.5 rounded-full">{count}</span>
      </div>
      <div className="text-sm text-muted-foreground mb-3">
        ${totalValue.toLocaleString()}
      </div>
      <div className="space-y-3">
        {items.map((item, i) => (
          <PipelineItem key={i} {...item} onClick={() => console.log('Item clicked', item)} />
        ))}
      </div>
    </div>
  );
};

export default PipelineStage;
