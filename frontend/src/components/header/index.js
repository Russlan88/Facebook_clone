/** @format */

import React from 'react';
import { Link } from 'react-router-dom';
import {
	ArrowDown,
	Friends,
	Gaming,
	HomeActive,
	Logo,
	Market,
	Menu,
	Messenger,
	Notifications,
	Search,
	Watch,
} from '../../svg';
import './style.scss';
import { useSelector } from 'react-redux';

const Header = () => {
	const { user } = useSelector((user) => ({ ...user }));
	console.log(user);
	const color = '#65676b';
	return (
		<header>
			<div className="header_left">
				<Link to="/" className="header_logo">
					<div className="circle">
						<Logo />
					</div>
				</Link>
				<div className="search search1">
					<Search />
					<input
						type="text"
						placeholder="Search Facebook"
						className="hide_input"
					/>
				</div>
			</div>
			<div className="header_middle">
				<Link to="/" className="middle_icon active">
					<HomeActive />
				</Link>
				<Link to="/" className="middle_icon hover1">
					<Friends color={color} />
				</Link>
				<Link to="/" className="middle_icon hover1">
					<Watch color={color} />
					<div className="middle_notification">9+</div>
				</Link>
				<Link to="/" className="middle_icon hover1">
					<Market color={color} />
				</Link>
				<Link to="/" className="middle_icon hover1">
					<Gaming color={color} />
				</Link>
			</div>
			<div className="header_right">
				<Link to="/profile" className="profile_link hover1">
					<img src={user?.picture} alt={user?.first_name} />
					<span>{user?.first_name}</span>
				</Link>
				<div className="circle_icon hover1">
					<Menu />
				</div>
				<div className="circle_icon hover1">
					<Messenger />
				</div>
				<div className="circle_icon hover1">
					<Notifications />
					<span className="right_notification">5</span>
				</div>
				<div className="circle_icon hover1">
					<ArrowDown />
				</div>
			</div>
		</header>
	);
};

export default Header;
