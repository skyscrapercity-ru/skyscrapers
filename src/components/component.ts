export abstract class Component {
    abstract html: string;
    abstract init?: (doc: ParentNode) => void;

    getSlot(doc: ParentNode, name: string) {
        return doc.querySelector(`slot[name="${name}"]`);
    }
}