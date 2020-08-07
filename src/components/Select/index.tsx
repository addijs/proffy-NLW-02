import React, { forwardRef, SelectHTMLAttributes } from 'react';

import './styles.css';

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
	name: string;
	label: string;
	options: Array<{
		value: string;
		label: string;
	}>
}

const Select = forwardRef<HTMLSelectElement, Props>(({ name, label, options, ...rest }, ref) => {
	return (
		<div className="select-block">
			<label htmlFor={ name }>{ label }</label>
			<select ref={ref} defaultValue='default' id={ name } {...rest}>
				<option value='default' disabled hidden>Selecione uma opção</option>

				{options.map(option => {
					return <option key={option.value} value={option.value}>{option.label}</option>
				})}
			</select>
		</div>
	);
});

export default Select;