import React, { forwardRef, InputHTMLAttributes } from 'react';

import './styles.css';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
	inputName: string;
	label: string;
}

const Input = forwardRef<HTMLInputElement, Props>(({inputName, label, ...rest}, ref) => {
	return (
		<div className="input-block">
			<label htmlFor={ inputName }>{ label }</label>
			<input ref={ref} id={ inputName } type="text" {...rest} />
		</div>
	);
});

export default Input;