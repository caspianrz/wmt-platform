import React, { useEffect } from 'react';
import { Box, Card, Tab, Tabs } from "@mui/material";
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { useAuth } from '../providers/AuthProvider';
import { useNavigate } from 'react-router';
import toast from 'react-hot-toast';


interface TabPanelProps {
	children?: React.ReactNode;
	index: string;
	value: string;
}

function AuthTabPanel(props: TabPanelProps) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && <Box sx={{ p: 3 }}>{children}</Box>}
		</div>
	);
}

export default function AuthenticationForm() {
	// const auth = useAuth();
	// const navigate = useNavigate();

	// useEffect(() => {
	// 	if (auth.is_valid()) {
	// 		navigate('/');
	// 		toast.success('Login successfully!')
	// 	}else{
	// 		toast.error('Login failed , please try a few moment later')
	// 	}
	// }, [auth, navigate]);

	const [value, setValue] = React.useState("0");

	const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
		setValue(newValue);
	};

	return (
		<Card>
			<Tabs value={value} onChange={handleChange} aria-label="authentication form" variant='fullWidth'>
				<Tab label="Login" value="0" />
				<Tab label="Register" value="1" />
			</Tabs>
			<AuthTabPanel value={value} index={"0"}><LoginForm /></AuthTabPanel>
			<AuthTabPanel value={value} index={"1"}><RegisterForm /></AuthTabPanel>
		</Card>
	);
}
