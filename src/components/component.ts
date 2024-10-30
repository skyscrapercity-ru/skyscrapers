export enum ShadowMode { Attached, Detached }

export abstract class Component {
    protected onInit?: () => void;
    protected onRoot?: () => void;
    protected onAttributeChange?: (name: string, oldValue: object, newValue: object) => void;
    protected abstract node: Node;
    protected root: ParentNode;
    private isInitialized = false;

    public init(component: HTMLElement, shadowMode: ShadowMode) {
        if (!this.isInitialized) {
            if (shadowMode == ShadowMode.Attached) {
                this.root = component.attachShadow({ mode: 'open' });
            } else {
                this.root = component;
            }
            this.root.appendChild(this.node);

            if (this.onRoot) {
                this.onRoot();
            }

            if (this.onInit) {
                this.onInit();
            }

            this.isInitialized = true;
        }
    }

    public fireAttributeChange(name: string, oldValue: object, newValue: object) {
        if (this.onAttributeChange) {
            this.onAttributeChange(name, oldValue, newValue);
        }
    }

    protected getSlot(name: string) {
        return this.root.querySelector(`slot[name="${name}"]`);
    }

    protected listen(selector: string, event: string, listener: (...params: any[]) => void) {
        this.root.querySelector(selector).addEventListener(event, listener);
    }

    protected createElement(tag: string, html: string, className?: string) {
        const element = document.createElement(tag);
        element.innerHTML = html;
        if (className) {
            element.className = className;
        }
        return element;
    }
}

export abstract class SlotComponent extends Component {
    public slot: Element;

    protected onRoot = () => {
        this.slot = this.getSlot('main');
    }
}