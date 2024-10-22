import { Component } from "./component";

export class TestComponent extends Component {
  html = '<p><slot name="slt"></slot></p>';

  slot: Element;

  init = (doc: ParentNode) => {
    this.slot = this.getSlot(doc, 'slt');
    this.slot.textContent = 'test';
    doc.querySelector('p').addEventListener('click',
      () => this.slot.textContent = 'test ' + new Date().toTimeString());
  };
}