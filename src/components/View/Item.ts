import { IItem } from "../../types";
import { Component } from "../base/Component";
import { IEvents } from "../base/events";



export class Item extends Component<IItem> {
    protected cardImage?: HTMLImageElement;
    protected cardTitle: HTMLElement;
    protected cardDescription: HTMLElement;
    protected cardCategory?: HTMLElement;
    protected cardPrice: HTMLElement;
    protected id: string

    constructor (container: HTMLElement, protected events: IEvents) {
        super(container);
        this.cardImage = this.container.querySelector('.card__image');
        this.cardTitle = this.container.querySelector('.card__title');
        this.cardDescription = this.container.querySelector('.card__text');
        this.cardCategory = this.container.querySelector('.card__category');
        this.cardPrice = this.container.querySelector('.card__price');
        
        this.container.addEventListener('click', () => this.events.emit('card:selected', {id: this.id}))

    }

    set itemId(value: string) {
        this.id = value;
    }

    get itemId() {
        return this.id ;
    }

    set title(value: string) {
        this.setText(this.cardTitle, value);
        
    }

    set description(value: string) {
		this.setText(this.cardDescription, value);
	}
    
    set image(value: string) {
        this.setImage(this.cardImage, value, this.title)
    }  

    set category(value: string) {
        this.setText(this.cardCategory, value)
    }  

    set price(value: string) {
        this.setText(this.cardPrice, `${value} синапсов`)
    }  
}



export class ItemPreview extends Item {
    protected button: HTMLButtonElement;
    private _inBasket: boolean;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container, events);
        this.button = this.container.querySelector('.card__button') as HTMLButtonElement;

        this.button.addEventListener('click', () => {
            if (this._inBasket) {
                this.events.emit('basket:deleteItem', { id: this.id });
            } else {
                this.events.emit('basket:addItem', { id: this.id });
            }
        });

        events.on('basket:statusChanged', (evt) => {
            const { id, status } = evt as { id: string, status: boolean };
            if (this.id === id) {
                this.inBasket = status;
            }
        });
    }

    set inBasket(value: boolean) {
        this._inBasket = value;
        if (value) {
            this.setText(this.button, 'Убрать');
        } else {
            this.setText(this.button, 'В корзинку');
        }
    }

    get inBasket(): boolean {
        return this._inBasket;
    }
}

    

    


