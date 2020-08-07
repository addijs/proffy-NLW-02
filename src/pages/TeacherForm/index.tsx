import React, { useRef, useState } from 'react'
import api from '../../services/api';

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

	function handleSubmit() {
		api.post('/classes', {
			name: inputNameRef.current?.value,
			avatar: inputAvatarRef.current?.value,
			whatsapp: inputWhatsappRef.current?.value,
			bio: textAreaRef.current?.value,
			subject: subjectSelectRef.current?.value,
			cost: Number(inputCostRef.current?.value),
			schedule: scheduleItems
		}).then(() => {
			alert('Cadastro realizado com sucesso!');
		}).catch(() => {
			alert('Erro no cadastro. :(');
		})
	}

	function setScheduleItemsValue(index: number, field: string, value: string) {
		const updatedScheduleItems = scheduleItems.map((item, itemIndex) => {
			if(itemIndex !== index) return item;

			return {
				...item,
				[field]: value
			}
		});

		setScheduleItems(updatedScheduleItems);
	}

	const inputNameRef = useRef<HTMLInputElement>(null);
	const inputAvatarRef = useRef<HTMLInputElement>(null);
	const inputWhatsappRef = useRef<HTMLInputElement>(null);
	const textAreaRef = useRef<HTMLTextAreaElement>(null);
	const subjectSelectRef = useRef<HTMLSelectElement>(null);
	const inputCostRef = useRef<HTMLInputElement>(null);

	return (
		<div id="page-teacher-form" className="container">
			<PageHeader title="Que incrível que você quer dar aulas.">
				<p>O primeiro passo é preencher esse formulário de inscrição.</p>
			</PageHeader>

			<main>
				<fieldset>
					<legend>Seus dados</legend>

					<Input ref={inputNameRef} inputName='name' label='Nome completo'/>
					<Input ref={inputAvatarRef} inputName='avatar' label='Avatar'/>
					<Input ref={inputWhatsappRef} inputName='whatsapp' label='WhatsApp'/>

					<Textarea ref={textAreaRef} name='bio' label='Biografia'/>
				</fieldset>

				<fieldset>
					<legend>Sobre a aula</legend>

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
					<Input ref={inputCostRef} inputName='cost' label='Custo da sua hora por aula'/>
				</fieldset>

				<fieldset>
					<legend>
						Horários disponíveis
						<button type='button' onClick={addNewScheduleItem}>+ Novo Horário</button>
					</legend>

					{ scheduleItems.map((item, index) => {
						return (
							<div key={index} className="schedule-item">
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
									onChange={e => setScheduleItemsValue(index, 'week_day', e.target.value)}
								/>
		
								<Input
									onChange={e => setScheduleItemsValue(index, 'from', e.target.value)}
									inputName='from' label='Das' type='time'
								/>
								<Input
									onChange={e => setScheduleItemsValue(index, 'to', e.target.value)}
									inputName='to' label='Até' type='time'
								/>
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

					<button type='button' onClick={handleSubmit}>
						Salvar cadastro
					</button>
				</footer>
			</main>
		</div>
	);
}

export default TeacherForm;