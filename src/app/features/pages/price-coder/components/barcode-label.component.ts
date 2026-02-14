import { Component, inject, signal, input } from "@angular/core";
import { SlicePipe, DecimalPipe } from "@angular/common";
import { NgxBarcode6 } from 'ngx-barcode6';
import { generateCostCode } from "@/utils/number";
import { SettingsService } from "@/services/settings.service";

@Component({
    selector: 'app-barcode-label',
    templateUrl: './barcode-label.component.html',
    styleUrls: ['./barcode-label.component.css'],
    standalone: true,
    imports: [NgxBarcode6, SlicePipe, DecimalPipe]
})
export class BarcodeLabelComponent {
    private settingsService = inject(SettingsService);
    
    // Accept printQueue as an input signal from the parent component
    printQueue = input<any[]>([]);

    ngOnInit() {
        this.settingsService.loadSettings();
    }

    generateCostCode(price: number) {
        return generateCostCode(price, this.settingsService);
    }
}