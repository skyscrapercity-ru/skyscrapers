import { createInjector } from 'typed-inject';
import { Component, ShadowMode } from "./components/component";
import { RatingBox } from './components/rating-box';
import { RatingService } from './services/rating-service';
import { TableRow } from './components/table-row';

let serviceProvider = createInjector();
serviceProvider = serviceProvider
    .provideClass('ratingService', RatingService)
    .provideClass('tableRow', TableRow)
    .provideValue('createTableRow', () => serviceProvider.injectClass(TableRow))
    .provideClass('ratingBox', RatingBox);

export function defineComponent<TComponent extends Component>(name: string, constructor: new (...params: any[])
    => TComponent, shadowMode: ShadowMode = ShadowMode.Attached, observedAttributes: string[] = []) {
    customElements.define(name, class extends HTMLElement {
        private readonly component: Component;

        constructor() {
            super();
            this.component = serviceProvider.injectClass(constructor);
        }
        
        connectedCallback() {
            this.component.init(this, shadowMode);
        }

        static get observedAttributes() {
            return observedAttributes;
        }

        attributeChangedCallback(name: string, oldValue: object, newValue: object) {
            if (oldValue) {
                this.component.fireAttributeChange(name, oldValue, newValue);
            }
        }
    });
}
