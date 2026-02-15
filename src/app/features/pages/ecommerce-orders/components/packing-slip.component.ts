import { Component, Input, ViewEncapsulation } from "@angular/core";

@Component({
    selector: 'app-packing-slip',
    templateUrl: './packing-slip.component.html',
    styleUrl: './packing-slip.component.css',
    encapsulation: ViewEncapsulation.None
})
export class PackingSlipComponent {
    @Input() order: any;
};