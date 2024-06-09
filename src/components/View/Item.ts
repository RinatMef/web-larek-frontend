import { IItem } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/events";



export class ItemBase extends Component<IItem> {
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

    set price(value: number | null) {
        const formatPrice = (value: number | null): string => {
            if (value === null) {
                return 'Бесценно';
            }
            return `${value} синапсов`;
        }
        
        this.setText(this.cardPrice, formatPrice(value));
    }
    
    
}

export class Item extends ItemBase {
    
    constructor (container: HTMLElement, protected events: IEvents) {
        super(container, events);
                
        this.container.addEventListener('click', () => this.events.emit('card:selected', {id: this.id}))
        
    }

    set category(value: string) {
        this.setText(this.cardCategory, value)
        switch (value) {
            case 'софт-скил':
              this.cardCategory.classList.add('card__category_soft')
              break
            case 'другое':
                this.cardCategory.classList.add('card__category_other')
              break
            case 'дополнительное':
                this.cardCategory.classList.add('card__category_additional')
              break
            case 'кнопка':
                this.cardCategory.classList.add('card__category_button')
              break
            case 'хард-скил':
                this.cardCategory.classList.add('card__category_hard')
              break
            default:
                this.cardCategory.classList.remove('card__category_soft')
              break
          }
    }
    
}



export class ItemPreview extends ItemBase {
    protected button: HTMLButtonElement;
    private _inBasket: boolean;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container, events);
        this.button = this.container.querySelector('.card__button') as HTMLButtonElement;

        this.button.addEventListener('click', () => {
            if (this._inBasket) {
                this.events.emit('preview:deleteItem', { id: this.id });
            } else {
                this.events.emit('preview:addItem', { id: this.id });
            }
        });

       
    }

    set inBasket(value: boolean) {
        this._inBasket = value;
        if (value) {
            this.setText(this.button, 'Убрать');
        } else {
            this.setText(this.button, 'В корзину');
        }
    }

    get inBasket(): boolean {
        return this._inBasket;
    }

    set category(value: string) {
        this.setText(this.cardCategory, value)
        switch (value) {
            case 'софт-скил':
              this.cardCategory.classList.add('card__category_soft')
              break
            case 'другое':
                this.cardCategory.classList.add('card__category_other')
              break
            case 'дополнительное':
                this.cardCategory.classList.add('card__category_additional')
              break
            case 'кнопка':
                this.cardCategory.classList.add('card__category_button')
              break
            case 'хард-скил':
                this.cardCategory.classList.add('card__category_hard')
              break
            default:
                this.cardCategory.classList.remove('card__category_soft')
              break
          }
    }
}



  
