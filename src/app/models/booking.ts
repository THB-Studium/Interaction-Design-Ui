import { PaymentMethod } from "../enums/paymentMethod";
import { Traveler } from "./traveler";

export class Booking {
    public id: string;
    public buchungsklasseId: string;
    public buchungDatum: string;
    public handGepaeck: string;
    public koffer: string;
    public mitReisender: Traveler;
    public reisender: Traveler;
    public zahlungMethod: PaymentMethod;
    public reiseAngebotId: string;
    public status: string;
    //
    public buchungsnummer: string;
    public hinFlugDatum: string;
    public ruckFlugDatum: string;

    public abFlughafenReisender: string;
    public ruckFlughafenReisender: string;
    public handGepaeckReisender: string;
    public kofferReisender: string;

    public abFlughafenMitReisender: string;
    public ruckFlughafenMitReisender: string;
    public handGepaeckMitReisender: string;
    public kofferMitReisender: string;

}

export class BookingUpdate {
    public id: string;
    public buchungsklasseId: string;
    //public datum: string;
    public buchungDatum: string;
    public handGepaeck: string;
    public koffer: string;
    public mitReisenderId: string;
    public reisenderId: string;
    public zahlungMethod: PaymentMethod;
    public reiseAngebotId: string;
    public status: string;
    //
    public buchungsnummer: string;
    public hinFlugDatum: string;
    public ruckFlugDatum: string;

    public abFlughafenReisender: string;
    public ruckFlughafenReisender: string;
    public handGepaeckReisender: string;
    public kofferReisender: string;

    public abFlughafenMitReisender: string;
    public ruckFlughafenMitReisender: string;
    public handGepaeckMitReisender: string;
    public kofferMitReisender: string;
    public sendMail?: boolean;
}
