export abstract class Component {
    init(component: HTMLElement, shadowMode: ShadowMode) {
        if (shadowMode == ShadowMode.Attached) {
            component.attachShadow({ mode: 'open' }).appendChild(this.node);
            this.root = component.shadowRoot;
        } else {
            component.append(this.node);
            this.root = component;
        }

        if (this.onInit) {
            this.onInit();
        }
    }

    protected abstract node: Node;
    protected abstract onInit?: () => void;
    protected root: ParentNode;

    protected getSlot(name: string) {
        return this.root.querySelector(`slot[name="${name}"]`);
    }

    protected listen(selector: string, event: string, listener: (...params: any[]) => void) {
        this.root.querySelector(selector).addEventListener(event, listener);
    }
}

export enum ShadowMode { Attached, Detached }