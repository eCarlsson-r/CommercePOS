import { Branch } from "./branch.model";

export interface Employee {
  id: number | null;
  name: string;
  email: string;
  role: string;
  status: string;
  join_date: string;
  quit_reason: string | null;
  quit_date: string | null;
  branch: Branch;
  mobile: string;
  username: string;
  password: string;
  type: string;
}
