import React from 'react';
import { FormControl, FormGroup, Input, InputAdornment, InputLabel, Button, Stack, Box, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios, { type AxiosResponse } from 'axios';
import EnvironmentManager from '../models/EnvironmentManager';
import { useAuth } from '../providers/AuthProvider';
import { useNavigate } from 'react-router';
import toast from 'react-hot-toast';

export default function LoginForm() {
	const [username, setUsername] = React.useState('');
	const [password, setPassword] = React.useState('');
	const [showPassword, setShowPassword] = React.useState(false);
	const auth = useAuth();
	const navigate = useNavigate();

	const handleClickShowPassword = () => setShowPassword((show) => !show);

	const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
	};

	const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
	};

	const handleSubmit = async (event: any) => {
		event.preventDefault();

		// const endpoint = EnvironmentManager.Instance.endpoint('/api/auth/login');


		// axios.post(endpoint.href, {
		// 	username: username, password: password
		// }).then((data: AxiosResponse<any, any>) => {
		// 	if (data.status == 200) {
		// 		const authToken = data.headers["authorization"];
		// 		auth?.login(authToken);
		// 		if (auth?.is_valid()) {
		// 			navigate('/');
		// 		}
		// 	} else {

		// 	}
		// }).catch((reason: any) => {
		// 	console.log(reason);
		// 	toast.error('Invalid username or password.');
		// });


		try {
			const endpoint = EnvironmentManager.Instance.endpoint('/api/auth/login');

			const response: AxiosResponse<any> = await axios.post(endpoint.href, {
				username,
				password,
			});

			if (response.status === 200) {
				const authToken = response.headers['authorization'];
				auth?.login(authToken);

				toast.success('Login successful!');

				navigate('/');
			}
		} catch (error: any) {
			console.error(error);

			toast.error('Invalid username or password.');
		}
	}

	return (
		<Box component="form" onSubmit={handleSubmit}>
			<FormGroup sx={{ mt: 0 }}>
				<Stack spacing={2}>
					<FormControl>
						<InputLabel htmlFor="standard-adornment-username">Username</InputLabel>
						<Input
							id="standard-adornment-username"
							value={username}
							type='text'
							aria-autocomplete='both'
							onChange={(e) => setUsername(e.target.value)}
						/>
					</FormControl>
					<FormControl>
						<InputLabel htmlFor="standard-adornment-password">Password</InputLabel>
						<Input
							id="standard-adornment-password"
							value={password}
							type={showPassword ? 'text' : 'password'}
							onChange={(e) => setPassword(e.target.value)}
							endAdornment={
								<InputAdornment position="end">
									<IconButton
										aria-label={
											showPassword ? 'hide the password' : 'display the password'
										}
										onClick={handleClickShowPassword}
										onMouseDown={handleMouseDownPassword}
										onMouseUp={handleMouseUpPassword}
									>
										{showPassword ? <VisibilityOff /> : <Visibility />}
									</IconButton>
								</InputAdornment>
							}
						/>
					</FormControl>
					<FormControl>
						<Button
							type='submit'
							variant="contained"
							sx={{
								width: "50%",
								alignSelf: "center",
							}}
						>
							Login
						</Button>
					</FormControl>
				</Stack>
			</FormGroup>
		</Box>
	);
}
