import React, { useRef, useState } from 'react'
import PageHeader from '../../components/PageHeader'
import Input from '../../components/Input'
import Textarea from '../../components/Textarea';
import Select from '../../components/Select';

import warningIcon from '../../assets/images/icons/warning.svg';

import './styles.css';

interface IScheduleItem {
	week_day: number;
	from: string;
	to: string
}

const TeacherForm: React.FC = () => {
	const [scheduleItems, setScheduleItems] = useState<IScheduleItem[]>([
		{ week_day: 0, from: '', to: ''}
	])

	function addNewScheduleItem() {
		setScheduleItems(oldState => [
			...oldState,
			{ week_day: 0, from: '', to: ''}
		])
	}

	const scheduleFieldsetRef = useRef<HTMLFieldSetElement>(null);

	return (
		<div id="page-teacher-form" className="container">
			<PageHeader title="Que incrível que você quer dar aulas.">
				<p>O primeiro passo é preencher esse formulário de inscrição.</p>
			</PageHeader>

			<main>
				<fieldset>
					<legend>Seus dados</legend>

					<Input inputName='name' label='Nome completo'/>
					<Input inputName='avatar' label='Avatar'/>
					<Input inputName='whatsapp' label='WhatsApp'/>

					<Textarea name='bio' label='Biografia'/>
				</fieldset>

				<fieldset>
					<legend>Sobre a aula</legend>

					<Select 
						name='subject' 
						label='Matéria'
						options={[
							{ value: 'Artes', label: 'Artes'},
							{ value: 'Biologia', label: 'Biologia'},
							{ value: 'Ciências', label: 'Ciências'},
							{ value: 'Matemática', label: 'Matemática'}
						]}
					/>
					<Input inputName='cost' label='Custo da sua hora por aula'/>
				</fieldset>

				<fieldset ref={scheduleFieldsetRef}>
					<legend>
						Horários disponíveis
						<button type='button' onClick={addNewScheduleItem}>+ Novo Horário</button>
					</legend>

					{ scheduleItems.map(item => {
						return (
							<div key={item.week_day} className="schedule-item">
								<Select 
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
		
								<Input inputName='from' label='Das' type='time'/>
								<Input inputName='to' label='Até' type='time'/>
							</div>
						)
					})}
				</fieldset>

				<footer>
					<p>
						<img src={warningIcon} alt="Aviso importante"/>
						Importante! <br/>
						Preencha todos os dados
					</p>

					<button type='button'>
						Salvar cadastro
					</button>
				</footer>
			</main>
		</div>
	);
}

export default TeacherForm;