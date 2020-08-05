import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import TeacherList from './pages/TeacherList';

const Routes: React.FC = () => {
	return (
		<Router>
			<Route exact path='/' component={Landing}/>
			<Route path='/study' component={TeacherList} />
		</Router>
	);
}

export default Routes;