import { PaymentMethod } from "../enums/paymentMethod";
import { Traveler } from "./traveler";

export class Booking {
    public id: string;
    public buchungsklasseId: string;
    public datum: string;
    public flugHafen: string;
    public handGepaeck: string;
    public koffer: string;
    public mitReiser: Traveler;
    public reiser: Traveler;
    public zahlungMethod: PaymentMethod;
    public reiseAngebotId: string;
}
