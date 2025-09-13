export default class ColorUtil {
  private static colorRegex = /^#[0-9A-F]{6}$/i;
  public static isValid(color: string): boolean {
		return ColorUtil.colorRegex.test(color);
	}
}