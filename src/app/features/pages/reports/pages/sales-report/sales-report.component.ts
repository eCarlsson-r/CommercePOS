import { Component, inject, signal, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { LucideAngularModule } from "lucide-angular";
import { BranchService } from "@/services/branch.service";
import { Branch } from "@/models/branch.model";
import { EmployeeService } from "@/services/employee.service";
import { SalesA4Component } from "../../components/sales-a4.component";
import { Employee } from "@/models/employee.model";

@Component({
    selector: 'app-sales-report',
    templateUrl: './sales-report.component.html',
    imports: [CommonModule, FormsModule, LucideAngularModule, SalesA4Component]
})
export class SalesReportComponent {
    private branchService = inject(BranchService);
    private employeeService = inject(EmployeeService);
    branches = signal<Branch[]>([]);
    employees = signal<Employee[]>([]);
    reportData = signal<any[]>([]);
    branchId = signal<number>(0);
    employeeId = signal<number>(0);
    startDate = signal<string>('');
    endDate = signal<string>('');

    ngOnInit(): void {
        this.branchService.getBranches().subscribe((res) => {
            this.branches.set(res);
        });

        this.employeeService.getEmployees().subscribe((res) => {
            this.employees.set(res);
        });
    }

    onBranchChange() {
        const branch = this.branches().find((b) => b.id === Number(this.branchId()));
        this.report.branchName.set(branch?.name || 'All Branches');
    }

    onEmployeeChange() {
        const employee = this.employees().find((e) => e.id === Number(this.employeeId()));
        this.report.employeeName.set(employee?.name || 'All Employees');
    }

    @ViewChild(SalesA4Component) report!: SalesA4Component;

    generateReport() {
        this.report.loadReportData(Number(this.branchId()), Number(this.employeeId()), this.startDate(), this.endDate());
    }

    printReport() {
        this.report.printReport();
    }
}