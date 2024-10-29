import { Building } from "../models/building";
import { RatingService } from "../services/rating-service";
import { SlotComponent } from "./component";
import { ComponentTemplate } from "./component-template";

export class RatingBox extends SlotComponent {
    private static template = new ComponentTemplate('<div><slot name="main"></slot></div>');
    protected node = RatingBox.template.clone();

    constructor(private readonly ratingService: RatingService) {
        super();
    }
    static inject = ['ratingService'] as const;

    protected onInit = async () => {
        this.ratingService.buildings.forEach((items, city) => {
            this.slot.appendChild(this.createElement("p", city))
            items.forEach(b => this.slot.appendChild(this.createElement("div", b.name)))
        })
    }
}