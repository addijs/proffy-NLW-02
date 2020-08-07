import React, { InputHTMLAttributes } from 'react';

import './styles.css';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
	inputName: string;
	label: string;
}

const Input: React.FC<Props> = ({ inputName, label, ...rest }) => {
	return (
		<div className="input-block">
			<label htmlFor={ inputName }>{ label }</label>
			<input id={ inputName } type="text" {...rest} />
		</div>
	);
}

export default Input;