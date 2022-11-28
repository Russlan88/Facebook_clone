/** @format */
import { Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import Login from './pages/login';
import Profile from './pages/profile';

const App = () => {
	return (
		<div>
			<Routes>
				<Route path="/login" element={<Login />} exact />
				<Route path="/profile" element={<Profile />} exact />
				<Route path="/" element={<Home />} exact />
			</Routes>
		</div>
	);
};

export default App;
