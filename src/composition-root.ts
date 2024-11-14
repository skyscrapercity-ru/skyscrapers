import * as dicc from "./service-provider";
import { Component, ShadowMode } from "./components/component";

class ServiceProvider extends dicc.ServiceProvider {
    addService<T>(id: string, factory: () => T) {
        (this as any).importDefinitions({ [id]: { factory }});
    }

    get(id: string) {
        return (this as any).create(id);
    }

    getDeps(id: string): any[] {
        const deps = (this as any).definitions.get(id).deps;
        return deps && deps.map((d: any) => d(this));
    }
}

const serviceProvider = new ServiceProvider();

export function defineComponent<TComponent extends new (...args: any[]) => Component>(
    name: string, ctor: TComponent, shadowMode: ShadowMode = ShadowMode.Attached) {
    const id = `#${ctor.name}.0`;
    customElements.define(name, class extends ctor {
        protected node: Node;

        constructor(...args: any[]) {
            const deps = serviceProvider.getDeps(id);
            if (deps) {
                super(...deps);
            } else {
                super();
            }
            this.shadowMode = shadowMode;
        }
    });
    serviceProvider.addService(id, () => document.createElement(name));
}
