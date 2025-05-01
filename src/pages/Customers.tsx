
import { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { MoreHorizontal, Plus, Search, Filter, Trash, Edit } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { Calendar } from "@/components/ui/calendar";
import { format, isAfter, isBefore, startOfDay, endOfDay } from "date-fns";

type CustomerStatus = 'active' | 'inactive' | 'lead' | 'churned';

interface Customer {
  id: number;
  name: string;
  email: string;
  company: string;
  status: CustomerStatus;
  value: number;
  lastContact: string;
}

const initialCustomers: Customer[] = [
  {
    id: 1,
    name: "Michael Scott",
    email: "michael@dundermifflin.com",
    company: "Dunder Mifflin",
    status: "active",
    value: 125000,
    lastContact: "2023-04-28",
  },
  {
    id: 2,
    name: "Jim Halpert",
    email: "jim@athlead.com",
    company: "Athlead",
    status: "active",
    value: 89000,
    lastContact: "2023-04-25",
  },
  {
    id: 3,
    name: "Pam Beesly",
    email: "pam@dundermifflin.com",
    company: "Dunder Mifflin",
    status: "inactive",
    value: 12000,
    lastContact: "2023-03-15",
  },
  {
    id: 4,
    name: "Dwight Schrute",
    email: "dwight@schrutefarms.com",
    company: "Schrute Farms",
    status: "lead",
    value: 0,
    lastContact: "2023-04-22",
  },
  {
    id: 5,
    name: "Angela Martin",
    email: "angela@dundermifflin.com",
    company: "Dunder Mifflin",
    status: "active",
    value: 45000,
    lastContact: "2023-04-26",
  },
  {
    id: 6,
    name: "Andy Bernard",
    email: "andy@cornell.edu",
    company: "Cornell University",
    status: "churned",
    value: 0,
    lastContact: "2023-02-10",
  },
  {
    id: 7,
    name: "Stanley Hudson",
    email: "stanley@dundermifflin.com",
    company: "Dunder Mifflin",
    status: "active",
    value: 67000,
    lastContact: "2023-04-20",
  },
  {
    id: 8,
    name: "Kelly Kapoor",
    email: "kelly@dundermifflin.com",
    company: "Dunder Mifflin",
    status: "inactive",
    value: 8000,
    lastContact: "2023-03-25",
  },
];

const statusStyles: Record<CustomerStatus, { label: string, className: string }> = {
  active: { label: "Active", className: "bg-green-100 text-green-800" },
  inactive: { label: "Inactive", className: "bg-slate-100 text-slate-800" },
  lead: { label: "Lead", className: "bg-blue-100 text-blue-800" },
  churned: { label: "Churned", className: "bg-red-100 text-red-800" },
};

const Customers = () => {
  const { toast } = useToast();
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [valueRange, setValueRange] = useState<[number, number]>([0, 150000]);
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);
  const [isEditStatusDialogOpen, setIsEditStatusDialogOpen] = useState(false);
  const [customerToEdit, setCustomerToEdit] = useState<Customer | null>(null);
  const [newStatus, setNewStatus] = useState<CustomerStatus>('active');
  
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = 
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = !statusFilter || statusFilter === "all" || customer.status === statusFilter;
    
    const matchesValue = 
      (customer.status === "lead" || customer.status === "churned") || 
      (customer.value >= valueRange[0] && customer.value <= valueRange[1]);
    
    let matchesDate = true;
    if (dateRange.from) {
      matchesDate = matchesDate && isAfter(new Date(customer.lastContact), startOfDay(dateRange.from));
    }
    if (dateRange.to) {
      matchesDate = matchesDate && isBefore(new Date(customer.lastContact), endOfDay(dateRange.to));
    }
    
    return matchesSearch && matchesStatus && matchesValue && matchesDate;
  });

  const confirmDelete = (customer: Customer) => {
    setCustomerToDelete(customer);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (customerToDelete) {
      setCustomers(customers.filter(c => c.id !== customerToDelete.id));
      toast({
        title: "Customer deleted",
        description: `${customerToDelete.name} has been removed from your customer list`
      });
      setIsDeleteDialogOpen(false);
      setCustomerToDelete(null);
    }
  };

  const openEditStatusDialog = (customer: Customer) => {
    setCustomerToEdit(customer);
    setNewStatus(customer.status);
    setIsEditStatusDialogOpen(true);
  };

  const handleStatusUpdate = () => {
    if (customerToEdit && newStatus) {
      setCustomers(customers.map(c => 
        c.id === customerToEdit.id ? {...c, status: newStatus} : c
      ));
      toast({
        title: "Status updated",
        description: `${customerToEdit.name}'s status is now ${statusStyles[newStatus].label}`
      });
      setIsEditStatusDialogOpen(false);
      setCustomerToEdit(null);
    }
  };

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter(undefined);
    setValueRange([0, 150000]);
    setDateRange({});
    toast({
      title: "Filters reset",
      description: "All customer filters have been cleared"
    });
  };

  return (
    <div>
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold">Customers</h1>
            <p className="text-muted-foreground">Manage your customer relationships</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Customer
          </Button>
        </div>
        
        <div className="flex flex-col gap-3">
          <div className="flex gap-3 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search customers..." 
                className="pl-9" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <span>{statusFilter ? statusStyles[statusFilter as CustomerStatus]?.label || "All Statuses" : "All Statuses"}</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="lead">Lead</SelectItem>
                <SelectItem value="churned">Churned</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium whitespace-nowrap">Value Range:</span>
              <div className="flex-1">
                <Slider
                  value={valueRange}
                  max={150000}
                  step={1000}
                  onValueChange={(value) => setValueRange(value as [number, number])}
                />
              </div>
              <span className="text-sm whitespace-nowrap">${valueRange[0].toLocaleString()} - ${valueRange[1].toLocaleString()}</span>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium whitespace-nowrap">Last Contact:</span>
              <div className="flex-1">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left">
                      {dateRange.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                          </>
                        ) : (
                          format(dateRange.from, "LLL dd, y")
                        )
                      ) : (
                        <span>Pick a date range</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="range"
                      selected={dateRange}
                      onSelect={setDateRange}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button variant="outline" size="sm" onClick={resetFilters}>Reset Filters</Button>
          </div>
        </div>
      </div>
      
      <div className="border rounded-lg bg-white overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Last Contact</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {customer.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{customer.name}</div>
                      <div className="text-sm text-muted-foreground">{customer.company}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant="secondary" 
                    className={cn(statusStyles[customer.status].className)}
                    onClick={() => openEditStatusDialog(customer)}
                  >
                    {statusStyles[customer.status].label}
                  </Badge>
                </TableCell>
                <TableCell>
                  {customer.status === "lead" || customer.status === "churned" 
                    ? "-" 
                    : `$${customer.value.toLocaleString()}`}
                </TableCell>
                <TableCell>
                  {new Date(customer.lastContact).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Profile</DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Customer
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openEditStatusDialog(customer)}>
                        Change Status
                      </DropdownMenuItem>
                      <DropdownMenuItem>Add Deal</DropdownMenuItem>
                      <DropdownMenuItem>View History</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-red-600"
                        onClick={() => confirmDelete(customer)}
                      >
                        <Trash className="h-4 w-4 mr-2" />
                        Delete Customer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Customer</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {customerToDelete?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Status Dialog */}
      <Dialog open={isEditStatusDialogOpen} onOpenChange={setIsEditStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Customer Status</DialogTitle>
            <DialogDescription>
              Change the status for {customerToEdit?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={newStatus} onValueChange={(value) => setNewStatus(value as CustomerStatus)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="lead">Lead</SelectItem>
                  <SelectItem value="churned">Churned</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditStatusDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleStatusUpdate}>Update Status</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Customers;
