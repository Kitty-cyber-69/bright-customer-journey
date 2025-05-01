
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
import { MoreHorizontal, Plus, Search, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

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

const customers: Customer[] = [
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
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = 
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = !statusFilter || statusFilter === "all" || customer.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

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
          <div className="flex items-center gap-2">
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
                  <Badge variant="secondary" className={cn(statusStyles[customer.status].className)}>
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
                      <DropdownMenuItem>Edit Customer</DropdownMenuItem>
                      <DropdownMenuItem>Add Deal</DropdownMenuItem>
                      <DropdownMenuItem>View History</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Customers;
