import { Component, ShadowMode } from "./component";
import { ComponentTemplate } from "./component-template";

export class TestComponent extends Component {
  static template = new ComponentTemplate('<p><slot name="slt"></slot></p>');
  node = TestComponent.template.clone();

  private slot: Element;

  onInit = () => {
    this.slot = this.getSlot('slt');
    this.slot.textContent = 'test';
    this.listen('p', 'click', () => this.slot.textContent = 'test ' + new Date().toTimeString());
  };
}