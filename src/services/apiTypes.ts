/**
 * File: apiTypes.ts
 * 
 * This file contains a set of TypeScript interfaces used to define data structures
 * related to account creation, deletion, updating, and betting functionality within
 * the application. All interfaces are fully documented to ensure clarity, maintainability,
 * and extensibility. These interfaces can be easily integrated into other parts of the
 * codebase to allow seamless communication of data structures between various services
 * and components.
 *
 * Usage Instructions:
 * 1. Import any of these interfaces into your service, component, or other application file
 *    where you need to consume or produce these data types.
 * 2. Use them to define function parameters, return types, or for any other purpose that
 *    benefits from strongly-typed data structures.
 * 3. Extend or modify these interfaces as needed for future features or requirements,
 *    ensuring that you keep comments updated to reflect all changes.
 *
 * Example:
 *    import { AccountModel, CreateAccountModel } from './apiTypes';
 *
 *    function createNewAccount(data: CreateAccountModel): AccountModel {
 *      // Implementation logic
 *      return { id: '1', username: data.username, linkedProviders: [] };
 *    }
 *
 * Testing & Debugging:
 * 1. To verify these interfaces, you can create mock objects conforming to them
 *    in your tests. For example, use a testing framework (like Jest or Mocha) to
 *    confirm that your service or component logic works correctly with these types.
 * 2. If you need to debug data structures at runtime, remember to enable source maps
 *    and TypeScript compilation flags that facilitate step-by-step debugging (e.g.
 *    "inlineSourceMap": true in tsconfig.json).
 */

/**
 * Interface representing the model used when creating a new account. 
 * 
 * @property {string} [username] - The desired username for the new account (optional).
 * @property {string} [password] - The password for the new account (optional).
 */
export interface CreateAccountModel {
    username?: string;
    password?: string;
}

/**
 * Interface representing the model used when deleting an existing account.
 * 
 * @property {string} id - The unique identifier of the account to be deleted.
 */
export interface DeleteAccountModel {
    id: string;
}

/**
 * Interface representing the model used to update account details.
 * 
 * @property {string} [username] - The new username for the account (optional).
 * @property {ProviderAccount[]} [linkedProviders] - A list of provider accounts
 * for external or third-party integrations (optional).
 */
export interface UpdateAccountModel {
    username?: string;
    linkedProviders?: ProviderAccount[];
}

/**
 * Interface representing a comprehensive account model in the application.
 * 
 * @property {string} id - The unique identifier of the account.
 * @property {string} [username] - The current username associated with this account (optional).
 * @property {ProviderAccount[]} linkedProviders - A list of linked provider accounts
 * for external or third-party integrations.
 */
export interface AccountModel {
    id: string;
    username?: string;
    linkedProviders: ProviderAccount[];
}

/**
 * Interface that captures the response model containing tokens and account identifiers.
 * 
 * @property {string} [accessToken] - A token used for authenticated requests (optional).
 * @property {string} [refreshToken] - A token used for refreshing the access token (optional).
 * @property {string} accountId - The unique identifier of the account associated with these tokens.
 */
export interface TokenResponseModel {
    accessToken?: string;
    refreshToken?: string;
    accountId: string;
}

/**
 * Interface representing a linked provider account.
 * 
 * @property {string} id - The unique identifier of the provider account link.
 * @property {string} [providerUsername] - The username utilized to access the provider (optional).
 * @property {string} [providerPassword] - The password utilized to access the provider (optional).
 * @property {number} providerId - A numeric ID indicating which provider this account references.
 * @property {number} accountId - The ID of the local account to which this provider is linked.
 */
export interface ProviderAccount {
    id: string;
    providerUsername?: string;
    providerPassword?: string;
    providerId: number;
    accountId: number;
}

/**
 * Interface representing the details of a single bet.
 * 
 * @property {string} betType - The type of bet being placed (e.g., 'win', 'place', etc.).
 * @property {number} amount - The monetary amount of the bet.
 * @property {number} runnerNumber - The runner or horse number on which the bet is placed.
 * @property {number} currentOdds - The current odds for the chosen runner or horse.
 * @property {string} [betString] - An optional string representation of the bet for debugging/logging.
 */
export interface BetDetail {
    betType: string;
    amount: number;
    runnerNumber: number;
    currentOdds: number;
    betString?: string;
}

/**
 * Interface representing a request to place bets. It encapsulates
 * jurisdiction, meeting codes, race information, and bet details.
 * 
 * @property {string} jurisdiction - The jurisdiction in which the bet is being placed.
 * @property {{ meetingCode: string; scheduledType: string }} sellCode - Identifiers for the meeting.
 * @property {string} venueMnemonic - A short identifier for the venue.
 * @property {number} raceNumber - The race number for which the bet is placed.
 * @property {string} runnerSelections - A string listing runner selections.
 * @property {BetDetail[]} bets - An array of bet details that will be placed under the same request.
 */
export interface BetPlacementRequest {
    jurisdiction: string;
    sellCode: {
        meetingCode: string;
        scheduledType: string;
    };
    venueMnemonic: string;
    raceNumber: number;
    runnerSelections: string;
    bets: BetDetail[];
}

/**
 * Interface representing an entire race meeting with its races.
 * 
 * @property {string} meetingName - The name of the meeting (e.g. "Melbourne Cup").
 * @property {string} location - The location of the meeting (city, racecourse name, etc.).
 * @property {string} raceType - The type of races run at this meeting (thoroughbred, harness, etc.).
 * @property {string} meetingDate - The date of the meeting in a YYYY-MM-DD format or similar.
 * @property {string} [prizeMoney] - The total prize pool for the meeting (optional).
 * @property {string} [weatherCondition] - The weather condition forecast or observed at the venue (optional).
 * @property {string} [trackCondition] - Description of the track condition (optional).
 * @property {string} [railPosition] - The rail position if relevant for certain track types (optional).
 * @property {{ meetingCode: string; scheduledType: string }} sellCode - Identifiers for the meeting code.
 * @property {string} venueMnemonic - A short identifier for the venue.
 * @property {MeetingRace[]} races - An array of races scheduled in this meeting.
 */
export interface Meeting {
    meetingName: string;
    location: string;
    raceType: string;
    meetingDate: string;
    prizeMoney?: string;
    weatherCondition?: string;
    trackCondition?: string;
    railPosition?: string;
    sellCode: {
        meetingCode: string;
        scheduledType: string;
    };
    venueMnemonic: string;
    races: MeetingRace[];
}

/**
 * Interface representing a single race within a meeting.
 * 
 * @property {number} raceNumber - The sequential race number.
 * @property {string} [raceClassConditions] - Optional string describing class or race conditions.
 * @property {string} raceName - The name assigned to the race.
 * @property {string} raceStartTime - The scheduled start time for the race, in ISO or other consistent format.
 * @property {string} raceStatus - The current status of the race (e.g., "Scheduled", "In Progress", "Completed").
 * @property {number} [raceDistance] - The distance of the race (optional).
 * @property {boolean} [hasParimutuel] - Flag whether parimutuel betting is available (optional).
 * @property {boolean} [hasFixedOdds] - Flag whether fixed-odds betting is available (optional).
 * @property {number[][]} [results] - A list of placements for each position, stored as arrays of finishing positions (optional).
 */
export interface MeetingRace {
    raceNumber: number;
    raceClassConditions?: string;
    raceName: string;
    raceStartTime: string;
    raceStatus: string;
    raceDistance?: number;
    hasParimutuel?: boolean;
    hasFixedOdds?: boolean;
    results?: number[][];
}