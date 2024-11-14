import { SlotComponent } from "./component";
import { ComponentTemplate } from "./component-template";

export class TableRow extends SlotComponent {
    private static template = new ComponentTemplate(
        `<style>
            .grid {
                display: grid;
                grid-template-columns: 40px repeat(3, 80px) 1fr;
                font-size: large;
                padding: 6px 0;
                cursor: default;
            }

            div {
                text-align: center;
            }

            div.city { 
                text-align: left;
            }
        </style>
        <div class="grid"><slot name="main"></slot></div>`
    );
    protected node = TableRow.template.clone();

    constructor() {
        super();
    }
}