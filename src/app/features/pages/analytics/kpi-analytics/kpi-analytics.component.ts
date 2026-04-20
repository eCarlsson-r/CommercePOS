import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

interface KPIMetric {
  label: string;
  value: number | string;
  unit: string;
  category: string;
  trend?: 'up' | 'down' | 'neutral';
}

@Component({
  selector: 'app-kpi-analytics',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  template: `
    <div class="p-6 space-y-6">
      <div class="flex justify-between items-center">
        <h1 class="text-3xl font-bold">{{ 'analytics.kpi' | translate }}</h1>
        <div class="flex gap-4">
          <label class="text-sm font-semibold">
            Days:
            <input 
              type="number" 
              [(ngModel)]="days" 
              (change)="onDaysChange()" 
              min="1" 
              max="365"
              class="ml-2 px-3 py-2 border border-gray-300 rounded w-20"
            />
          </label>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Commercial KPIs -->
        <div class="col-span-full">
          <h2 class="text-2xl font-bold mb-4">{{ 'analytics.commercial' | translate }}</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div *ngFor="let metric of commercialKPIs" class="kpi-card">
              <div class="text-gray-600 text-sm">{{ metric.label }}</div>
              <div class="text-3xl font-bold mt-2">{{ metric.value }}</div>
              <div class="text-gray-500 text-xs mt-1">{{ metric.unit }}</div>
            </div>
          </div>
        </div>

        <!-- Operational KPIs -->
        <div class="col-span-full">
          <h2 class="text-2xl font-bold mb-4">{{ 'analytics.operational' | translate }}</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div *ngFor="let metric of operationalKPIs" class="kpi-card">
              <div class="text-gray-600 text-sm">{{ metric.label }}</div>
              <div class="text-3xl font-bold mt-2">{{ metric.value }}</div>
              <div class="text-gray-500 text-xs mt-1">{{ metric.unit }}</div>
            </div>
          </div>
        </div>

        <!-- Governance KPIs -->
        <div class="col-span-full">
          <h2 class="text-2xl font-bold mb-4">{{ 'analytics.governance' | translate }}</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div *ngFor="let metric of governanceKPIs" class="kpi-card">
              <div class="text-gray-600 text-sm">{{ metric.label }}</div>
              <div class="text-3xl font-bold mt-2">{{ metric.value }}</div>
              <div class="text-gray-500 text-xs mt-1">{{ metric.unit }}</div>
            </div>
          </div>
        </div>
      </div>

      <div *ngIf="isLoading" class="text-center py-8">
        <p>{{ 'common.loading' | translate }}</p>
      </div>

      <div *ngIf="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {{ error }}
      </div>
    </div>
  `,
  styles: [`
    .kpi-card {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 0.5rem;
      padding: 1.5rem;
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    }
  `]
})
export class KPIAnalyticsComponent implements OnInit, OnDestroy {
  commercialKPIs: KPIMetric[] = [];
  operationalKPIs: KPIMetric[] = [];
  governanceKPIs: KPIMetric[] = [];

  days = 30;
  isLoading = false;
  error: string | null = null;

  private destroy$ = new Subject<void>();

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadKPIMetrics();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onDaysChange(): void {
    this.loadKPIMetrics();
  }

  private loadKPIMetrics(): void {
    this.isLoading = true;
    this.error = null;

    this.http.get<any>(`/api/analytics/kpi/commercial?days=${this.days}`)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.commercialKPIs = [
            { 
              label: 'Conversion Uplift', 
              value: (data.conversion_uplift?.value || 0).toFixed(2), 
              unit: '%',
              category: 'commercial'
            },
            { 
              label: 'Average Order Value', 
              value: (data.average_order_value?.value || 0).toFixed(2), 
              unit: 'USD',
              category: 'commercial'
            },
            { 
              label: 'Visual Search Rate', 
              value: (data.visual_search_discovery_rate?.rate || 0).toFixed(2), 
              unit: '%',
              category: 'commercial'
            }
          ];
        },
        error: (err) => {
          console.error('Failed to load commercial KPIs:', err);
          this.error = 'Failed to load commercial KPIs';
        }
      });

    this.http.get<any>(`/api/analytics/kpi/operational?days=${this.days}`)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.operationalKPIs = [
            { 
              label: 'AI P95 Latency', 
              value: (data.ai_p95_latency_ms?.p95 || 0).toFixed(0), 
              unit: 'ms',
              category: 'operational'
            },
            { 
              label: 'AI Cost Per Order', 
              value: (data.ai_cost_per_order?.cost_per_order || 0).toFixed(4), 
              unit: 'USD',
              category: 'operational'
            },
            { 
              label: 'Support Deflection', 
              value: (data.support_deflection_rate?.rate || 0).toFixed(2), 
              unit: '%',
              category: 'operational'
            }
          ];
        },
        error: (err) => {
          console.error('Failed to load operational KPIs:', err);
        }
      });

    this.http.get<any>(`/api/analytics/kpi/governance?days=${this.days}`)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.governanceKPIs = [
            { 
              label: 'Prompt Drift Incidents', 
              value: (data.prompt_drift_incidents?.value || 0).toFixed(0), 
              unit: 'count',
              category: 'governance'
            },
            { 
              label: 'Hallucination Rate', 
              value: (data.hallucination_rate?.value || 0).toFixed(2), 
              unit: '%',
              category: 'governance'
            },
            { 
              label: 'Fallback Success', 
              value: (data.feature_disable_fallback_success?.value || 0).toFixed(2), 
              unit: '%',
              category: 'governance'
            }
          ];
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Failed to load governance KPIs:', err);
          this.isLoading = false;
        }
      });
  }
}
