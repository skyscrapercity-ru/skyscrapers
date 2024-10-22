export class ComponentTemplate {
    private template: HTMLTemplateElement;

    constructor(content: string) {
        this.template = document.createElement('template');
        this.template.innerHTML = content;
    }

    clone() {
        return this.template.content.cloneNode(true);
    }
}