import { createInjector } from 'typed-inject';
import { Component } from "./components/component";
import { TestComponent } from "./components/test";


const serviceProvider = createInjector()
    .provideClass('testComponent', TestComponent);

export enum ShadowMode { Attached, Detached }

export function defineComponent<TComponent extends Component>(name: string, constructor: new (...params: any[]) => TComponent, shadowMode: ShadowMode = ShadowMode.Attached) {
    const component = serviceProvider.injectClass(constructor);
    const template = document.createElement('template');
    template.innerHTML = component.html;

    customElements.define(name, class extends HTMLElement {
        constructor() {
            super();
            const node = template.content.cloneNode(true);
            let root: ParentNode;
            if (shadowMode == ShadowMode.Attached) {
                this.attachShadow({ mode: 'open' }).appendChild(node);
                root = this.shadowRoot;
            } else {
                this.append(node);
                root = this;
            }

            if (component.init) {
                component.init(root);
            }
        }
    });
}