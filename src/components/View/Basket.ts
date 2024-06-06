import { createElement, ensureElement, formatNumber } from "../../utils/utils";
import { Component } from "../base/Component";
import { EventEmitter } from "../base/events";

interface IBasket {
    items: HTMLElement[];
    total: number;
    
}

export class Basket extends Component<IBasket> {
    protected _list: HTMLElement;
    protected _total: HTMLElement;
    protected _button: HTMLElement;

    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container);

        this._list = ensureElement<HTMLElement>('.basket__list', this.container);
        this._total = ensureElement<HTMLElement>('.basket__price', this.container);
        this._button = ensureElement<HTMLElement>('.basket__button', this.container);

        if (this._button) {
            this._button.addEventListener('click', () => {
                events.emit('order:open'); //добавить в ридми!!!!!!!!!!!!!!!!!!!!!!!
            });
        }

        this.items = [];
    }

    set items(items: HTMLElement[]) {
        if (items.length) {
            this._list.replaceChildren(...items);
        } else {
            this._list.replaceChildren(createElement<HTMLParagraphElement>('p', {
                textContent: 'Корзина пуста'
            }));
        }
    }

    
    set total(total: number) {
        this.setText(this._total, formatNumber(total));
    }
}
