import { createElement, ensureElement, formatNumber } from '../../utils/utils';
import { Component } from '../base/Component';
import { EventEmitter, IEvents } from '../base/events';
import { ItemBase } from './Item';

interface IBasket {
	items: HTMLElement[];
	total: number;
}

export class Basket extends Component<IBasket> {
	protected _list: HTMLElement;
	protected _total: HTMLElement;
	protected _button: HTMLButtonElement;

	constructor(container: HTMLElement, protected events: EventEmitter) {
		super(container);

		this._list = ensureElement<HTMLElement>('.basket__list', this.container);
		this._total = ensureElement<HTMLElement>('.basket__price', this.container);
		this._button = ensureElement<HTMLButtonElement>(
			'.basket__button',
			this.container
		);

		if (this._button) {
			this._button.addEventListener('click', () => {
				events.emit('order:open');
			});
		}

		this.items = [];
	}

	set items(items: HTMLElement[]) {
		if (items.length) {
			this._list.replaceChildren(...items);

			this.setDisabled(this._button, false);
		} else {
			this._list.replaceChildren(
				createElement<HTMLParagraphElement>('p', {
					textContent: 'Корзина пуста',
				})
			);
			this.setDisabled(this._button, true);
		}
	}

	set total(total: number) {
		this.setText(this._total, `${formatNumber(total)} синапсов`);
		if (total === 0) {
			this.setDisabled(this._button, true);
		} else {
			this.setDisabled(this._button, false);
		}
	}
}

export class BasketItems extends ItemBase {
	protected _index: HTMLElement;
	
	protected _deleteButton: HTMLButtonElement;
	

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container, events);

		
		this._index = ensureElement<HTMLElement>('.basket__item-index', this.container);
		this._deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);
		this._deleteButton.addEventListener('click', () =>
			this.events.emit('basket:deleteItem', { id: this.id })
		);
	}

	set index(value: number) {
		this.setText(this._index, value.toString());
	}

	get index(): number {
		return parseInt(this._index.textContent || '0', 10);
	}
}
