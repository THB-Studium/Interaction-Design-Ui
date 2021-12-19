export class Pattern {
    public static username = "^[a-z0-9_-]{8,15}$";
    public static mobile = "^((\\+49-?)|0)?[0-9]{10, 12}$"; // "^(\\+\\d{1,3}( )?)?((\\(\\d{3}\\))|\\d{3})[- .]?\\d{3}[- .]?\\d{4, 6}$"
    public static password = "^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).{6,12}$";
    public static onlyNumber = "^[0-9]*$";
    public static street = "^([A-z_-ÜÄÖüäöß\s.]+)$";//"^[\-0-9a-zA-ZäöüÄÖÜß.]+?\s+(\d+(\s?[a-zA-Z])?)\s*(?:$|\(|[A-Z]{2}))$";  //^\d+\s[A-z.ß]+ 
}
// ^[1-9]\d*(?:[-]\w+)? 12a / 12-a
// [A-z_-ÜÄÖüäöß\s.]+\s[1-9]\d*(?:[-]?\w+)?