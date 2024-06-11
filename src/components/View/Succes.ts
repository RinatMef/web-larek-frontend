import { IOrderResponce } from '../../types';
import { ensureElement, formatNumber } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/events';

export class Success extends Component<IOrderResponce> {
	protected _total: HTMLElement;
	protected submitButton: HTMLButtonElement;

	constructor(container: HTMLElement, events: IEvents) {
		super(container);

		this._total = ensureElement<HTMLElement>(
			'.order-success__description',
			this.container
		);
		this.submitButton = ensureElement<HTMLButtonElement>(
			'.order-success__close',
			this.container
		);

		this.submitButton.addEventListener('click', () => {
			events.emit('succes:close');
		});
	}

	set responceTotal(total: number) {
		this.setText(this._total, `Списано ${formatNumber(total)} синапсов`);
	}
}
