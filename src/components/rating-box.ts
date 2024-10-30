import { RatingService } from "../services/rating-service";
import { SlotComponent } from "./component";
import { ComponentTemplate } from "./component-template";
import { TableRow } from "./table-row";

export class RatingBox extends SlotComponent {
    private static template = new ComponentTemplate(
        `<style>
            div {
                background: #f5f5f5;     
            }
        </style>
        <div class="box"><slot name="main"></slot></div>`);
    protected node = RatingBox.template.clone();

    constructor(private readonly ratingService: RatingService, private readonly createTableRow: () => TableRow) {
        super();
    }
    static inject = ['ratingService', 'table-row'] as const;

    protected onInit = () => {
        const header = this.createTableRow();
        this.mainSlot.appendChild(header);
        header.mainSlot.appendChild(this.createElement('div', 'Место'));
        header.mainSlot.appendChild(this.createElement('div', 'Баллы'));
        header.mainSlot.appendChild(this.createElement('div', 'Здания'));
        header.mainSlot.appendChild(this.createElement('div', 'Этажи'));
        header.mainSlot.appendChild(this.createElement('div', 'Город', 'city'));

        this.ratingService.buildings.forEach((items, city) => {
            const row = this.createTableRow();
            this.mainSlot.appendChild(row);
            row.mainSlot.appendChild(this.createElement('div', '1'))
            row.mainSlot.appendChild(this.createElement('div', '1'));
            row.mainSlot.appendChild(this.createElement('div', '1'));
            row.mainSlot.appendChild(this.createElement('div', '2000'));
            row.mainSlot.appendChild(this.createElement('div', city, 'city'));
        })
    }
}