import React from 'react';

import whatsappIcon from '../../assets/images/icons/whatsapp.svg';

import './styles.css';

export interface ITeacherClassInfo {
	id: number;
	subject: string;
	cost: number;
	user_id: number;
	name: string;
	avatar: string;
	whatsapp: string;
	bio: string;
}

interface Props {
	teacherClass: ITeacherClassInfo
}

const TeacherItem: React.FC<Props> = ({ teacherClass }) => {
	return (
		<article className="teacher-item">
			
			<header>
				<img src={teacherClass.avatar} alt="Profile Pic"/>
				<div>
					<strong>{teacherClass.name}</strong>
					<span>{teacherClass.subject}</span>
				</div>
			</header>

			<p>
				{teacherClass.bio}
			</p>

			<footer>
				<p>
					Preço/hora
					<strong>R$ {teacherClass.cost}</strong>
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