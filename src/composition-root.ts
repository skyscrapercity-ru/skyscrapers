import { createInjector } from 'typed-inject';
import { Component, ShadowMode } from "./components/component";
import { TestComponent } from './components/test';

const serviceProvider = createInjector()
    .provideClass('testComponent', TestComponent);

export function defineComponent<TComponent extends Component>(name: string, constructor: new (...params: any[])
    => TComponent, shadowMode: ShadowMode = ShadowMode.Attached) {
    customElements.define(name, class extends HTMLElement {
        constructor() {
            super();
            const component = serviceProvider.injectClass(constructor);
            component.init(this, shadowMode);
        }
    });
}
