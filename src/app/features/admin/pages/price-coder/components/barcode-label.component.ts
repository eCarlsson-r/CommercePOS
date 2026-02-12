import { Component, inject, signal} from "@angular/core";
import { SlicePipe, DecimalPipe } from "@angular/common";
import { NgxBarcode6 } from 'ngx-barcode6';
import { SettingsService } from "@/services/settings.service";
import { ProductService } from "@/services/product.service";

@Component({
    selector: 'app-barcode-label',
    templateUrl: './barcode-label.component.html',
    styleUrls: ['./barcode-label.component.css'],
    imports: [NgxBarcode6, SlicePipe, DecimalPipe]
})
export class BarcodeLabelComponent {
    private settingsService = inject(SettingsService);
    private productService = inject(ProductService);
    printQueue = signal<any[]>([]);
    searchQuery = '';
    searchResults = signal<any[]>([]);
    ngOnInit() {
        this.settingsService.loadSettings();
    }

    generateLabels() {
        window.print();
    }
}