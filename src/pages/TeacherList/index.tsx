import React, { useRef, FormEvent, useState } from 'react';
import api from '../../services/api';

import PageHeader from '../../components/PageHeader';
import TeacherItem, { ITeacherClassInfo } from '../../components/TeacherItem';
import Input from '../../components/Input';
import Select from '../../components/Select'; 

import './styles.css';

const TeacherList: React.FC = () => {
	const [teacherList, setTeacherList] = useState<ITeacherClassInfo[]>([])

	function searchTeachers(e: FormEvent) {
		e.preventDefault();

		api.get<ITeacherClassInfo[]>('/classes', {
			params: {
				subject: subjectSelectRef.current?.value,
				week_day: weekDaySelectRef.current?.value,
				time: inputTimeRef.current?.value
			}
		}).then(res => {
			console.log(res.data);
			setTeacherList(res.data);
		}).catch(() => {
			alert('Erro na busca. :(');
		});
	}

	const subjectSelectRef = useRef<HTMLSelectElement>(null);
	const weekDaySelectRef = useRef<HTMLSelectElement>(null);
	const inputTimeRef = useRef<HTMLInputElement>(null);

	return (
		<div id="page-teacher-list" className="container">
			<PageHeader title='Estes são os proffys disponíveis'>
				<form id="search-teachers" onSubmit={searchTeachers}>
					<Select 
						ref={subjectSelectRef}
						name='subject' 
						label='Matéria'
						options={[
							{ value: 'Artes', label: 'Artes'},
							{ value: 'Biologia', label: 'Biologia'},
							{ value: 'Ciências', label: 'Ciências'},
							{ value: 'Matemática', label: 'Matemática'}
						]}
					/>

					<Select 
						ref={weekDaySelectRef}
						name='week-day' 
						label='Dia da Semana'
						options={[
							{ value: '0', label: 'Domingo'},
							{ value: '1', label: 'Segunda-feira'},
							{ value: '2', label: 'Terça-feira'},
							{ value: '3', label: 'Quarta-feira'},
							{ value: '4', label: 'Quinta-feira'},
							{ value: '5', label: 'Sexta-feira'},
							{ value: '6', label: 'Sábado'}
						]}
					/>
					<Input ref={inputTimeRef} inputName='time' label='Hora' type='time'/>

					<button type='submit'>Buscar</button>
				</form>
			</PageHeader>

			<main>
				{ teacherList.map(teacherClass => {
					return <TeacherItem key={teacherClass.id} teacherClass={teacherClass}/>
				}) }
			</main>
		</div>
	);
}

export default TeacherList;