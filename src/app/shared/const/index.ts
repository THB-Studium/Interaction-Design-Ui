/**
 * Paths for the routing
 * @module app/shared/const
 */
export class RoutingPaths {
  static readonly HOME: string = 'home';
  static readonly DASHBOARD: string = 'dashboard';

  // AUTHENTICATE
  static readonly LOGIN: string = 'login';
  static readonly LOGOUT: string = 'logout';
  static readonly LEARN_MORE: string = 'learn-more';
  static readonly LEARN_MORE_ITEM: string = this.LEARN_MORE + '/:landId';
  static readonly ABOUT_US: string = 'about-us';

  // ADMIN LAYOUT
  static readonly VERWALTUNG: string = 'verwaltung';
  static readonly ADMIN_HOME: string = 'startpage';
  static readonly BOOKING: string = 'bookings';
  static readonly FEEDBACKS: string = 'feedbacks';
  static readonly TRAVELERS: string = 'travelers';

  static readonly COUNTRY: string = 'countries';
  static readonly COUNTRY_EDIT: string = this.COUNTRY + '/edit/';
  static readonly COUNTRY_EDIT_ITEM: string = this.COUNTRY_EDIT + ':id';

  static readonly TRIP_OFFERS: string = 'trip-offers';
  static readonly TRIP_OFFERS_EDIT: string = this.TRIP_OFFERS + '/edit/';
  static readonly TRIP_OFFERS_EDIT_ITEM: string = this.TRIP_OFFERS_EDIT + ':id';
  static readonly TRIP_OFFERS_VIEW: string = this.TRIP_OFFERS + '/view/';
  static readonly TRIP_OFFERS_VIEW_ITEM: string = this.TRIP_OFFERS + ':landId';

  static readonly USERS: string = 'users';
  static readonly USERS_PROFILE: string = 'user-profile';

}

/**
 * Page names
 * @module app/shared/const
 */
export class PageNames {
  static readonly BASE_NAME: string = 'UTC - ';
}

/**
 * Date format
 * @module app/shared/const
 */
export class DateFormat {
  static readonly PARSE_AND_DISPLAY = {
    parse: {
      dateInput: 'YYYY-MM-DD',
    },
    display: {
      dateInput: 'DD MMM, YYYY',
      monthYearLabel: 'MMMM YYYY',
      dateA11yLabel: 'LL',
      monthYearA11yLabel: 'MMMM YYYY',
    },
  };
}
