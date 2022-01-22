export class Pattern {
    public static username = "^[a-z0-9_-]{8,15}$";
    // "^(\\+\\d{1,3}( )?)?((\\(\\d{3}\\))|\\d{3})[- .]?\\d{3}[- .]?\\d{4, 6}$"
    public static mobile = "^(\\+491)[0-9]{9,11}$"; // "^((\\+49-?)|0)?[0-9]{11}$"
    public static password = "^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).{6,12}$";
    public static onlyNumber = "^[0-9]{5,7}$";
    public static street = "^(?<street>(?:\p{L}|\ |\d|\.|-)+?) (?<number>\\d+(?: ?- ?\\d+)? *[a-zA-Z]?)$";
    public static email = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";
}
