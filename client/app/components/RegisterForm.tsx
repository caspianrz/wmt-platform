import React from 'react';
import { FormControl, FormGroup, Input, InputAdornment, InputLabel, Button, Stack, Divider, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

export default function RegisterForm() {
	const [name, setName] = React.useState('');
	const [username, setUsername] = React.useState('');
	const [password, setPassword] = React.useState('');
	const [showPassword, setShowPassword] = React.useState(false);

	const handleClickShowPassword = () => setShowPassword((show) => !show);

	const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
	};

	const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
	};
	return (
		<FormGroup sx={{ mt: 0 }}>
			<Stack spacing={2}>
				<FormControl>
					<FormControl>
						<InputLabel htmlFor="standard-adornment-name">Full Name</InputLabel>
						<Input
							id="standard-adornment-name"
							value={name}
							type='text'
							aria-autocomplete='both'
							onChange={(e) => setName(e.target.value)}
						/>
					</FormControl>
				</FormControl>
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
				<Button
					variant="contained"
					sx={{
						width: "50%",
						alignSelf: "center",
					}}
				>
					Register
				</Button>
			</Stack>
		</FormGroup>
	);
}
