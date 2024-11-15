import * as dicc from "./service-provider";
import { Component, ShadowMode } from "./components/component";

class ServiceProvider extends dicc.ServiceProvider {
    addService<T>(id: string, deps: any[], factory: () => T) {
        (this as any).importDefinitions({ [id]: { factory, deps }});
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
    const deps = serviceProvider.getDeps(id);
    const webComponentCtor = class extends ctor {
        protected node: Node;

        constructor(...args: any[]) {
            if (deps) {
                super(...deps);
            } else {
                super();
            }
            this.shadowMode = shadowMode;
        }
    };
    customElements.define(name, webComponentCtor);
    serviceProvider.addService(id, deps, () => new webComponentCtor());
}
