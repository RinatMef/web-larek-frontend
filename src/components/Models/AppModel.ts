import {
	FormErrors,
	IItem,
	ILarekModel,
	IOrder,
	IOrderForm,
} from '../../types';
import { IEvents } from '../base/events';

export class LarekModel implements ILarekModel {
	protected catalog: IItem[] = [];
	protected order: Omit<IOrder, 'total' | 'items'> = {
		email: '',
		phone: '',
		payment: '',
		address: '',
	};
	formErrors: FormErrors = {};

	constructor(protected events: IEvents) {}

	get orderData(): Omit<IOrder, 'total' | 'items'> {
		return this.order;
	}

	set orderData(data: Omit<IOrder, 'total' | 'items'>) {
		this.order = data;
	}

	get items(): IItem[] {
		return this.catalog;
	}

	createFullOrder(): IOrder {
		const items = this.checkCost();

		return {
			...this.order,
			items: items.map((item) => item.id),
			total: this.getTotal(),
		};
	}

	setItems(data: IItem[]): void {
		this.catalog = data;
		this.events.emit('catalog:changed');
	}

	getItem(id: string): IItem {
		return this.catalog.find((item) => item.id === id) as IItem;
	}

	basketChange(id: string): IItem {
		const item = this.getItem(id);
		if ((item.inBasket = !item.inBasket)) {
			this.events.emit('basket:changed');
			return item;
		}
		{
			this.getBasketItems().filter((item) => item.id !== id);
			return item;
		}
	}

	checkCost(): IItem[] {
		return this.getBasketItems().filter(
			(item) => item.price !== null && item.price > 0
		);
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

		if (this.validateOrder()) {
			this.events.emit('order:ready', this.order);
		}
	}
}
