import { IOrderForm } from '../../types';
import { ensureAllElements, ensureElement } from '../../utils/utils';
import { Form } from '../common/Form';
import { IEvents } from '../base/events';

export class Order extends Form<IOrderForm> {
	protected _address: HTMLInputElement;
	protected submitButton: HTMLButtonElement;
	protected _errors: HTMLElement;
	protected orderButtons: HTMLButtonElement[];

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this.orderButtons = ensureAllElements<HTMLButtonElement>(
			'.order__buttons button',
			container
		);
		this._address = ensureElement<HTMLInputElement>(
			'.form__input',
			this.container
		);
		this.submitButton = ensureElement<HTMLButtonElement>(
			'.order__button',
			this.container
		);
		this._errors = ensureElement<HTMLElement>('.form__errors', this.container);

		this.orderButtons.forEach((button) => {
			button.addEventListener('click', () => {
				events.emit('order:changed', { payment: button.name });
			});
		});

		this.submitButton.addEventListener('click', () => {
			this.events.emit('contacts:open');
		});
	}

	set orderButtonsStyle(name: string) {
		this.orderButtons.forEach((button) => {
			if (button.name === name) {
				button.classList.add('button_alt_active');
				button.classList.remove('button_alt');
			} else {
				button.classList.remove('button_alt_active');
				button.classList.add('button_alt');
			}
		});
	}

	resetForm() {
		this._address.value = '';
		this.orderButtons.forEach((button) => {
			button.classList.remove('button_alt_active');
			button.classList.add('button_alt');
		});
	}
}

export class Contacts extends Form<IOrderForm> {
	protected _phone: HTMLInputElement;
	protected _email: HTMLInputElement;
	protected submitButton: HTMLButtonElement;
	protected _errors: HTMLElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this._phone = ensureElement<HTMLInputElement>(
			'input[name="phone"]',
			this.container
		);
		this._email = ensureElement<HTMLInputElement>(
			'input[name="email"]',
			this.container
		);
		this.submitButton = ensureElement<HTMLButtonElement>(
			'.button',
			this.container
		);
		this._errors = ensureElement<HTMLElement>('.form__errors', this.container);

		this.submitButton.addEventListener('click', () => {
			this.events.emit('order:send');
		});
	}
	resetForm() {
		this._phone.value = '';
		this._email.value = '';
	}
}
