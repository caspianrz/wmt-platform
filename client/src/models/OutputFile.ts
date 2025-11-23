export default interface OutputFile {
	file: File | undefined;
	setFile: ((f: File | undefined) => void) | undefined;
}
