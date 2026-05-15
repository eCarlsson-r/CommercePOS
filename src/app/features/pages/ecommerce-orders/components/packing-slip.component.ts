import { Component, Input, ViewEncapsulation } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";

@Component({
    selector: 'app-packing-slip',
    imports: [TranslateModule],
    templateUrl: './packing-slip.component.html',
    styleUrl: './packing-slip.component.css',
    encapsulation: ViewEncapsulation.None
})
export class PackingSlipComponent {
    @Input() order: any;
};