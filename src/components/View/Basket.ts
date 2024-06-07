import { createElement, ensureElement, formatNumber } from "../../utils/utils";
import { Component } from "../base/Component";
import { EventEmitter, IEvents } from "../base/events";
import { ItemBase } from "./Item";

interface IBasket {
    items: HTMLElement[];
    total: number;
    
}

export class Basket extends Component<IBasket> {
    protected _list: HTMLElement;
    protected _total: HTMLElement;
    protected _button: HTMLButtonElement;
    protected _index: HTMLElement;

    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container);

        this._list = ensureElement<HTMLElement>('.basket__list', this.container);
        this._total = ensureElement<HTMLElement>('.basket__price', this.container);
        this._button = ensureElement<HTMLButtonElement>('.basket__button', this.container);
        

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
        this.setText(this._total, `${formatNumber(total)} синапсов`);
    }

    set buttonState(_button: HTMLButtonElement) {
        if(this.items.length) {
            this.setDisabled(this._button, false)
        } else {
            this.setDisabled(this._button, true)
        }
    }
}


export class BasketItems extends ItemBase {
    protected _index: HTMLElement;
    protected cardTitle: HTMLElement;
    protected cardPrice: HTMLElement;
    protected _deleteButton: HTMLButtonElement;
    protected _listElement: HTMLElement;
   
    constructor(container: HTMLElement, protected events: IEvents) {
    super(container, events);
   
    this.cardTitle = this.container.querySelector('.card__title');
    this._index = this.container.querySelector('.basket__item-index');
    this.cardPrice = this.container.querySelector('.card__price');
    this._deleteButton = this.container.querySelector('.basket__item-delete');
   
    this._deleteButton.addEventListener('click', () => this.events.emit('basket:deleteItem', { id: this.id }));
   
    
    }
   
    set index(value: number) {
    this.setText(this._index, value.toString());
    }
   
    get index(): number {
    return parseInt(this._index.textContent || '0', 10);
    }
   }