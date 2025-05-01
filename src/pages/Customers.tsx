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
import { MoreHorizontal, Plus, Search, Filter, Trash, Edit, X, CheckCircle2, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { Calendar } from "@/components/ui/calendar";
import { format, isAfter, isBefore, startOfDay, endOfDay } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";

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
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({ from: undefined, to: undefined });
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);
  const [isEditStatusDialogOpen, setIsEditStatusDialogOpen] = useState(false);
  const [customerToEdit, setCustomerToEdit] = useState<Customer | null>(null);
  const [newStatus, setNewStatus] = useState<CustomerStatus>('active');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Additional filter states
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  
  // Get unique companies for the filter
  const companies = Array.from(new Set(customers.map(c => c.company)));

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

    // Company filter
    const matchesCompany = selectedCompanies.length === 0 || selectedCompanies.includes(customer.company);
    
    return matchesSearch && matchesStatus && matchesValue && matchesDate && matchesCompany;
  }).sort((a, b) => {
    // Sort by the selected field
    let comparison = 0;
    
    switch (sortBy) {
      case "name":
        comparison = a.name.localeCompare(b.name);
        break;
      case "company":
        comparison = a.company.localeCompare(b.company);
        break;
      case "value":
        comparison = a.value - b.value;
        break;
      case "lastContact":
        comparison = new Date(a.lastContact).getTime() - new Date(b.lastContact).getTime();
        break;
      default:
        comparison = a.name.localeCompare(b.name);
    }
    
    // Apply sort direction
    return sortDirection === "asc" ? comparison : -comparison;
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
    setDateRange({ from: undefined, to: undefined });
    setSelectedCompanies([]);
    setSortBy("name");
    setSortDirection("asc");
    toast({
      title: "Filters reset",
      description: "All customer filters have been cleared"
    });
  };

  const toggleCompanyFilter = (company: string) => {
    setSelectedCompanies(prev => 
      prev.includes(company) 
        ? prev.filter(c => c !== company) 
        : [...prev, company]
    );
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
            <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  <span>Filters</span>
                  {(statusFilter || valueRange[0] > 0 || valueRange[1] < 150000 || dateRange.from || dateRange.to || selectedCompanies.length > 0) && (
                    <Badge variant="secondary" className="ml-1 px-1 py-0 h-5">
                      {[
                        statusFilter ? 1 : 0,
                        valueRange[0] > 0 || valueRange[1] < 150000 ? 1 : 0,
                        dateRange.from || dateRange.to ? 1 : 0,
                        selectedCompanies.length > 0 ? 1 : 0
                      ].reduce((a, b) => a + b, 0)}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0" align="end">
                <div className="p-4 border-b">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Filters</h4>
                    <Button variant="ghost" size="sm" onClick={resetFilters} className="h-8 px-2 text-xs">
                      Reset all
                    </Button>
                  </div>
                </div>
                <div className="p-4 space-y-4">
                  <Accordion type="multiple" className="w-full">
                    <AccordionItem value="status">
                      <AccordionTrigger className="py-2">Status</AccordionTrigger>
                      <AccordionContent>
                        <div className="grid grid-cols-1 gap-2">
                          <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger>
                              <SelectValue placeholder="All Statuses" />
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
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="company">
                      <AccordionTrigger className="py-2">Company</AccordionTrigger>
                      <AccordionContent>
                        <div className="grid gap-2">
                          {companies.map(company => (
                            <div key={company} className="flex items-center space-x-2">
                              <Checkbox 
                                id={`company-${company}`} 
                                checked={selectedCompanies.includes(company)}
                                onCheckedChange={() => toggleCompanyFilter(company)}
                              />
                              <Label 
                                htmlFor={`company-${company}`}
                                className="text-sm font-normal"
                              >
                                {company}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="value">
                      <AccordionTrigger className="py-2">Value Range</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">${valueRange[0].toLocaleString()}</span>
                            <span className="text-sm">${valueRange[1].toLocaleString()}</span>
                          </div>
                          <Slider
                            value={valueRange}
                            max={150000}
                            step={1000}
                            onValueChange={(value) => setValueRange(value as [number, number])}
                          />
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="date">
                      <AccordionTrigger className="py-2">Last Contact</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          <div className="grid gap-2">
                            <div className="flex items-center justify-between">
                              <Label className="text-sm font-normal">Date Range</Label>
                              {(dateRange.from || dateRange.to) && (
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-8 px-2 text-xs"
                                  onClick={() => setDateRange({ from: undefined, to: undefined })}
                                >
                                  <X className="h-3 w-3 mr-1" />
                                  Clear
                                </Button>
                              )}
                            </div>
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
                                  selected={dateRange as any}
                                  onSelect={setDateRange as any}
                                  initialFocus
                                  className="pointer-events-auto"
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>

                <Separator />

                <div className="p-4 space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Sort By</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="name">Name</SelectItem>
                          <SelectItem value="company">Company</SelectItem>
                          <SelectItem value="value">Value</SelectItem>
                          <SelectItem value="lastContact">Last Contact</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Select value={sortDirection} onValueChange={(value) => setSortDirection(value as "asc" | "desc")}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="asc">Ascending</SelectItem>
                          <SelectItem value="desc">Descending</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                
                <div className="border-t p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      <Users className="inline h-3 w-3 mr-1" />
                      {filteredCustomers.length} customers
                    </div>
                    <Button size="sm" onClick={() => setIsFilterOpen(false)}>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Apply
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          
          {(statusFilter || valueRange[0] > 0 || valueRange[1] < 150000 || dateRange.from || dateRange.to || selectedCompanies.length > 0) && (
            <div className="flex flex-wrap gap-2 mt-2">
              {statusFilter && (
                <Badge variant="outline" className="flex gap-1 items-center px-3 py-1">
                  Status: {statusStyles[statusFilter as CustomerStatus]?.label || "All"}
                  <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => setStatusFilter(undefined)} />
                </Badge>
              )}
              
              {(valueRange[0] > 0 || valueRange[1] < 150000) && (
                <Badge variant="outline" className="flex gap-1 items-center px-3 py-1">
                  Value: ${valueRange[0].toLocaleString()} - ${valueRange[1].toLocaleString()}
                  <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => setValueRange([0, 150000])} />
                </Badge>
              )}
              
              {(dateRange.from || dateRange.to) && (
                <Badge variant="outline" className="flex gap-1 items-center px-3 py-1">
                  Date: {dateRange.from ? format(dateRange.from, "MM/dd/yyyy") : "Any"} 
                  {dateRange.to ? ` - ${format(dateRange.to, "MM/dd/yyyy")}` : ""}
                  <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => setDateRange({ from: undefined, to: undefined })} />
                </Badge>
              )}
              
              {selectedCompanies.map(company => (
                <Badge key={company} variant="outline" className="flex gap-1 items-center px-3 py-1">
                  Company: {company}
                  <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => toggleCompanyFilter(company)} />
                </Badge>
              ))}
              
              <Button variant="ghost" size="sm" onClick={resetFilters} className="h-8 text-xs">
                Clear all
              </Button>
            </div>
          )}
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
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((customer) => (
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
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No customers found matching your filters.
                </TableCell>
              </TableRow>
            )}
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
