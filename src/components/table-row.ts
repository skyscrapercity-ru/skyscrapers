import { Component } from "./component";
import { ComponentTemplate } from "./component-template";

export class TableRow extends Component {
    private static template = new ComponentTemplate(
        `<style>
            .grid {
                display: grid;
                grid-template-columns: 40px repeat(3, 80px) 1fr;
                font-size: large;
                background: yellow;
            }
        </style>
        <div class="grid"><slot></slot></div>`
    );
    protected node = TableRow.template.clone();
}