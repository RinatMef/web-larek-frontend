import { FormErrors, IItem, ILarekModel, IOrder, IOrderForm } from "../../types";
import { IEvents } from "../base/events";
import { Model } from "../base/Model"

export class LarekModel implements ILarekModel {
    protected catalog: IItem[] = [];
    protected order: IOrder = {
        email: '',
        phone: '',
        payment: '',
        address: '',
        total: 0,
        items: []
    };
    formErrors: FormErrors = {};

    constructor(protected events: IEvents) {
        
    }

    get orderData(): IOrder {
        return this.order;
    }
    
    get items(): IItem[] {
        return this.catalog;
    }

    
    get orderTotal():number {
        return this.order.total;
    }

    getItems(): IItem[] {
        return this.catalog;
    }

    setItems(data: IItem[]): void {
        this.catalog = data;
        this.events.emit('catalog:changed');
    }

    getItem(id: string): IItem {
        return this.catalog.find(item => item.id === id) as IItem;
    }

    addToBasket(id: string): IItem {
        const item = this.getItem(id);
        if (item) {
            item.inBasket = true;
            this.order.items.push(id);
            this.events.emit('basket:changed');
        }
        return item;
    }

    removeFromBasket(id: string): IItem {
        const item = this.getItem(id);
        if (item) {
            item.inBasket = false;
            this.order.items = this.order.items.filter(itemId => itemId !== id);
        }
        return item;
    }

   

    getBasketCounter(): number {
        return this.catalog.filter((item) => item.inBasket).length;
        
    }

    getTotal(): number {
        const basketItems = this.getBasketItems();
        
        return basketItems.reduce((total, item) => total + item.price, 0);
    }

    getBasketItems(): IItem[] {
        return this.catalog.filter((item) => item.inBasket);
         
    }

    
    validateOrder() {
        const errors: typeof this.formErrors = {};
        if (!this.order.email) {
            errors.email = 'Необходимо указать email';
        }
        if (!this.order.phone) {
            errors.phone = 'Необходимо указать телефон';
        }
        if (!this.order.payment) {
            errors.payment = 'Выберите способ оплаты';
        }
        if (!this.order.address) {
            errors.address = 'Необходимо указать адрес';
        }
        this.formErrors = errors;
        this.events.emit('orderErrors:change', this.formErrors);
        return Object.keys(errors).length === 0;
    }

    setOrderField(field: keyof IOrderForm, value: string) {
        this.order[field] = value;
        console.log(this.order);
        
        if (this.validateOrder()) {
            this.events.emit('order:ready', this.order);
            console.log('order:ready');
            
        }
    }
    

    
    
}