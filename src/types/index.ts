export interface IItem {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
    inBasket: boolean;
}



export interface ILarekModel {
    items: IItem[];
    createFullOrder(): IOrder;
    setItems(items: IItem[]): void;
    getItem(id: string): IItem;
    basketChange(id: string): IItem;
    getBasketCounter(): number;
    getBasketItems(): IItem[];
    checkCost(): void;
    getTotal(): number;
    validateOrder(): boolean;
    setOrderField(field: keyof IOrderForm, value: string): void;
}

export type FormErrors = Partial<Record<keyof IOrderForm, string>>;

export interface IProductResponce {
    total: number;
    items: IItem[];
}



export interface IOrderForm {
	payment: string;
	address: string;
	email: string;
	phone: string;

}

export interface IOrder extends IOrderForm {
    items: string[];
    total: number;
}

export interface IOrderResponce {
	id: string;
    total: number;
}






