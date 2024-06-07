import { IItem, ILarekModel } from "../../types";
import { IEvents } from "../base/events";
import { Model } from "../base/Model"

export class LarekModel implements ILarekModel {
    protected catalog: IItem[] = [];

    constructor(protected events: IEvents) {}

    get items(): IItem[] {
        return this.catalog;
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
            this.events.emit('basket:changed');
        }
        return item;
    }

    removeFromBasket(id: string): IItem {
        const item = this.getItem(id);
        if (item) {
            item.inBasket = false;
            this.events.emit('basket:changed');
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
    
}