import { EmployeeService } from '@/services/employee.service';
import { BranchService } from '@/services/branch.service';
import { Component, inject } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs/operators';
import { LucideAngularModule } from "lucide-angular";

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  imports: [LucideAngularModule]
})
export class EmployeeListComponent {
  private employeeService = inject(EmployeeService);
  branchService = inject(BranchService);

  // Automatically refresh employee list when the branch is switched in the header
  employees = toSignal(
    toObservable(this.branchService.selectedBranch).pipe(
      switchMap(branch => this.employeeService.getEmployees(branch?.id))
    ),
    { initialValue: [] }
  );
}