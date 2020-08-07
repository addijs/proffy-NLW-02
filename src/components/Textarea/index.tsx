import React, { forwardRef, TextareaHTMLAttributes } from 'react';

import './styles.css';

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
	name: string;
	label: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, Props>(({ name, label, ...rest }, ref) => {
	return (
		<div className="textarea-block">
			<label htmlFor={ name }>{ label }</label>
			<textarea ref={ref} id={ name } {...rest} />
		</div>
	);
});

export default Textarea;