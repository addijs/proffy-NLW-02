import React from 'react';

import whatsappIcon from '../../assets/images/icons/whatsapp.svg';

import './styles.css';

const TeacherItem: React.FC = () => {
	return (
		<article className="teacher-item">
			
			<header>
				<img src="https://i.pinimg.com/originals/63/3e/3c/633e3ce3827625a3122f5f04f89daf34.jpg" alt="Kitten"/>
				<div>
					<strong>Adelso</strong>
					<span>Química</span>
				</div>
			</header>

			<p>
				Entusiasta das melhores tecnologias de quimica avançada.
				<br/><br/>
				Apaixonado por explodir coisas em laboratório e por mudar a vida das pessoas através de experiências.
			</p>

			<footer>
				<p>
					Preço/hora
					<strong>R$ 80,00</strong>
				</p>
				<button type="button">
					<img src={whatsappIcon} alt="Whatsapp"/>
					Entrar em contato
				</button>
			</footer>

		</article>
	);
}

export default TeacherItem;