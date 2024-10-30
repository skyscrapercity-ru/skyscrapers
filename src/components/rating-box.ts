import { RatingService } from "../services/rating-service";
import { SlotComponent } from "./component";
import { ComponentTemplate } from "./component-template";
import { TableRow } from "./table-row";

export class RatingBox extends SlotComponent {
    private static template = new ComponentTemplate(
        `<style>
        .box {
            display: grid;
            background: #f5f5f5;
            grid-template-columns: 40px repeat(3, 80px) 1fr;
            font-size: large;           
        }

        .box div {
            cursor: default;
            margin: 6px 0;
            text-align: center;
        }    
            
        .box div.city { 
            text-align: left;
        }
        </style>
        <div class="box"><slot name="main"></slot></div>`);
    protected node = RatingBox.template.clone();

    constructor(private readonly ratingService: RatingService, private readonly createTableRow: () => TableRow) {
        super();
    }
    static inject = ['ratingService', 'createTableRow'] as const;

    protected onInit = async () => {
        this.slot.appendChild(this.createElement('div', 'Место'));
        this.slot.appendChild(this.createElement('div', 'Баллы'));
        this.slot.appendChild(this.createElement('div', 'Здания'));
        this.slot.appendChild(this.createElement('div', 'Этажи'));
        this.slot.appendChild(this.createElement('div', 'Город', 'city'));

        this.ratingService.buildings.forEach((items, city) => {
            this.slot.appendChild(this.createElement('div', '1'))
            this.slot.appendChild(this.createElement('div', '1'));
            this.slot.appendChild(this.createElement('div', '1'));
            this.slot.appendChild(this.createElement('div', '2000'));
            this.slot.appendChild(this.createElement('div', city, 'city'));
        })
    }
}