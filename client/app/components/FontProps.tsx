export enum FontWeight {
	Regular,
	Bold,
	Italic,
}

export default interface FontProps {
	weight : FontWeight;
	size : number;
	family : string | undefined;
}