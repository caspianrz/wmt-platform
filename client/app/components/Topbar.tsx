import React from 'react';

import { AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import { Menu } from '@mui/icons-material';

export interface TopbarProps {
	title: string;
}

export default function Topbar(props: TopbarProps) {
	return (
		<AppBar position="static">
			<Toolbar variant="dense">
				<IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
					<Menu />
				</IconButton>
				<Typography variant="h6" color="inherit" component="div">
					{props.title}
				</Typography>
			</Toolbar>
		</AppBar>
	);
}
