export enum ShadowMode { Attached, Detached }

export abstract class Component extends HTMLElement {
    protected onInit?: () => void;
    protected onRoot?: () => void;
    protected onAttributeChange?: (name: string, oldValue: object, newValue: object) => void;
    protected abstract node: Node;
    protected root: ParentNode;
    private isInitialized = false;
    protected shadowMode: ShadowMode;

    connectedCallback() {
        if (!this.isInitialized) {
            if (this.shadowMode == ShadowMode.Attached) {
                this.root = this.attachShadow({ mode: 'open' });
            } else {
                this.root = this;
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
    private _mainSlot: Element;

    public get mainSlot() {
        if (!this._mainSlot) {
            this._mainSlot = this.getSlot('main');
        }

        return this._mainSlot;
    }
}