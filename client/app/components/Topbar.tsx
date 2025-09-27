import { AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import { Menu } from '@mui/icons-material';
import { useAuth } from '~/providers/AuthProvider';

export interface TopbarProps {
	title: string;
}

export default function Topbar(props: TopbarProps) {
	const auth = useAuth();
	return (
		<AppBar position="static">
			<Toolbar variant="dense">
				<IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
					<Menu />
				</IconButton>
				<Typography variant="h6" color="inherit" component="div">
					{props.title}
				</Typography>
				<Typography sx={{ ml: "auto" }}>Hello {auth.user}</Typography>
			</Toolbar>
		</AppBar>
	);
}
