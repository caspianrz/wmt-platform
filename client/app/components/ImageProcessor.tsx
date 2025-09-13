export default function loadImage(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      console.log(e.target);
      resolve(e.target?.result as string);
    }
    reader.readAsDataURL(file);
  });
}