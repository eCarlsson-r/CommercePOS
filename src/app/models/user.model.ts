import { Employee } from './employee.model';
import { Customer } from './customer.model';

export interface User {
  id: number;
  username: string;
  role: string;
  employee?: Employee;
  customer?: Customer;
}
