import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/events";


export interface IPage {
    catalog: HTMLElement[];
    basketCounter: number;
    locked: boolean;
    
}

export class Page extends Component<IPage> {
    protected catalogContainer: HTMLElement;
    protected basketCounterPlace: HTMLElement;
    protected wrapper: HTMLElement;
    protected basket: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this.basketCounterPlace = ensureElement<HTMLElement>('.header__basket-counter', this.container);
        this.catalogContainer = ensureElement<HTMLElement>('.gallery', this.container);
        this.wrapper = ensureElement<HTMLElement>('.page__wrapper');
        this.basket = ensureElement<HTMLElement>('.header__basket');

        this.basket.addEventListener('click', () => {
            this.events.emit('basket:openModal');
        });

    }
    
    set catalog(items: HTMLElement[]) {
        this.catalogContainer.replaceChildren(...items);
    
    }

    set counter(value: number) {
        this.setText(this.basketCounterPlace, value.toString());
    }

    set locked(value: boolean) {
        if (value) {
            this.wrapper.classList.add('page__wrapper_locked');
        } else {
            this.wrapper.classList.remove('page__wrapper_locked');
        }
    }
}

