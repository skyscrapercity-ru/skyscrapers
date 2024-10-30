import { createInjector, Injector } from 'typed-inject';
import { Component, ShadowMode } from "./components/component";
import { RatingService } from './services/rating-service';

let serviceProvider : Injector<{}> = createInjector()
    .provideClass('ratingService', RatingService);

export function defineComponent<TComponent extends new (...args: any[]) => Component>(
    name: string, ctor: TComponent, shadowMode: ShadowMode = ShadowMode.Attached) {
    customElements.define(name, class extends ctor {
        protected node: Node;

        constructor(...args: any[]) {
            const depTokens = (ctor as any).inject as string[];
            if (depTokens) {
                const deps = depTokens.map(token => (serviceProvider as any).resolve(token));
                super(...deps);
            } else {
                super();
            }
            this.shadowMode = shadowMode;
        }
    });
    serviceProvider = serviceProvider.provideValue(name, () => document.createElement(name));
}
