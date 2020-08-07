import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import TeacherList from './pages/TeacherList';
import TeacherForm from './pages/TeacherForm';

const Routes: React.FC = () => {
	return (
		<Router>
			<Route exact path='/' component={Landing}/>
			<Route path='/study' component={TeacherList} />
			<Route path='/teachers' component={TeacherForm} />
		</Router>
	);
}

export default Routes;