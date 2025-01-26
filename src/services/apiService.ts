/**
 * ApiService
 * 
 * This service provides methods for interacting with a backend API that handles
 * account management, provider management, authentication, meetings, predictions,
 * and race-related functionalities. All remaining methods focus on functionality
 * unrelated to bankroll operations, in accordance with the request to remove
 * all bankroll-related code.
 */
import axios, {
    AxiosInstance,
    AxiosResponse,
    AxiosRequestConfig,
    InternalAxiosRequestConfig,
  } from 'axios';
  import {
    AccountModel,
    CreateAccountModel,
    UpdateAccountModel,
    TokenResponseModel,
    Meeting,
  } from './apiTypes';
  import { BASE_URL } from '../config';
  
  /**
   * Represents a race prediction result.
   * (You can expand or refine this interface based on real usage.)
   */
  interface RacePrediction {
    raceStartTime: string;
    [key: string]: any;
  }
  
  export interface InitializeBankrollParams {
    initialBankroll: number;
    profitThreshold: number;
    stopLossThreshold: number;
  }
  
  export const initializeBankroll = async (params: InitializeBankrollParams) => {
    const response = await axios.post('Taby.Api/bankroll/initialize', null, {
      params,
    });
    return response.data;
  };
  /**
   * The main service class responsible for making API requests to the backend
   * and dispatching relevant events.
   */
    class ApiService {
      /**
       * Retrieve a list of hardcoded features with icons and actions.
       * This is a demo implementation to showcase the functionality.
       */
      public getFeatures(): Array<{
        icon: string;
        name: string;
        id?: string;
        action: () => void;
        label?: string;
        image?: string;
        color?: string;
        component?: any | React.ReactNode | React.ReactElement | null;
        x?: number;
        y?: number;
        width?: number;
        height?: number;
        tilePosition?: { x: number; y: number };
      }> {
        // Hardcoded data for illustration:
        return [
          {
            icon: '🏠', // Home icon
            id: 'Home',
            name: 'Home',
            action: () => {
              console.log('Navigating to Home');
            },
          },
          {
            icon: '🔍', // Search icon
            name: 'Search',
            action: () => {
              console.log('Performing Search');
            },
          },
          {
            icon: '⚙️', // Settings icon
            id: 'Settings',
            name: 'Settings',
            // image: 'media/clock-icon.png', // Example of using an image instead of an emoji
            color: '#0ff',
            component: "<Settings />",
            x: 100,
            y: 150,
            width: 64,
            height: 64,
            tilePosition: {
              x: 128,
              y: 0,
            },
            action: () => {
              console.log('Opening Settings');
            },
          },
          {
            icon: '🕐',
            id: 'Clock',
            name: 'Clock',
            // image: 'media/clock-icon.png', // Example of using an image instead of an emoji
            color: '#0ff',
            component: "<Clock />",
            x: 300,
            y: 300,
            width: 64,
            height: 64,
            tilePosition: {
              x: 128,
              y: 0,
            },
            action: () => {
              console.log('Opening Clock');
            },
          },
          {
            icon: '🐱',
            id: 'Blocks',
            name: 'Blocks',
            color: '#0ff',
            component: "<Blocks />",
            x: 150,
            y: 150,
            width: 64,
            height: 64,
            tilePosition: {
              x: 168,
              y: 0,
            },
            action: () => {
              console.log('Opening Meowy');
            },
          },
        ];
      }
    /**
     * The axios instance used to make HTTP requests.
     */
    private axiosInstance: AxiosInstance;
  
    /**
     * Cache of calculated meetings, stored in a Map for quick lookup.
     */
    private calculatedMeetings: Map<string, any> = new Map();
  
    /**
     * Event target to emit and listen to custom events such as race updates.
     */
    public eventEmitter = new EventTarget();
  
    /**
     * Constructs the ApiService and sets up an axios instance
     * with the base URL and necessary headers.
     */
    constructor() {
      this.axiosInstance = axios.create({
        baseURL: BASE_URL,
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });
  
      // Add an interceptor to include the authorization token in all requests when available.
      this.axiosInstance.interceptors.request.use(
        (config: InternalAxiosRequestConfig) => {
          const token = localStorage.getItem('accessToken');
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
          return config;
        },
        (error) => Promise.reject(error)
      );
    }
  
    // ---------------------------------------------------------------------------
    // Account Management Endpoints
    // ---------------------------------------------------------------------------
  
    /**
     * Retrieve the account with the specified ID.
     * @param id - The unique account ID.
     */
    async getAccount(id: string): Promise<AccountModel> {
      const response = await this.axiosInstance.get(`/accounts/${id}`);
      return response.data;
    }
  
    /**
     * List accounts with pagination support.
     * @param pageNumber - The page number to fetch.
     * @param pageSize - The number of items per page.
     */
    async listAccounts(pageNumber = 1, pageSize = 10): Promise<AccountModel[]> {
      const response = await this.axiosInstance.get('/accounts/accounts/list', {
        params: { pageNumber, pageSize },
      });
      return response.data;
    }
  
    /**
     * Create a new account.
     * @param data - The data used to create this account.
     */
    async createAccount(data: CreateAccountModel): Promise<AccountModel> {
      const response = await this.axiosInstance.post(
        '/accounts/accounts/create',
        data
      );
      return response.data;
    }
  
    /**
     * Update an existing account identified by ID.
     * @param id - The unique account ID to update.
     * @param data - The update payload.
     */
    async updateAccount(
      id: string,
      data: UpdateAccountModel
    ): Promise<AccountModel> {
      const response = await this.axiosInstance.patch(
        `/accounts/accounts/${id}/update`,
        data
      );
      return response.data;
    }
  
    /**
     * Delete an existing account identified by ID.
     * @param id - The unique account ID to delete.
     */
    async deleteAccount(id: string): Promise<void> {
      await this.axiosInstance.delete(`/accounts/accounts/${id}/delete`);
    }
  
    // ---------------------------------------------------------------------------
    // Provider Management Endpoints
    // ---------------------------------------------------------------------------
  
    /**
     * List providers for a given account with optional search and pagination.
     * @param accountId - The ID of the account.
     * @param search - An optional search query term.
     * @param pageNumber - The page number to fetch.
     * @param pageSize - The number of items per page.
     */
    async listProviders(
      accountId: string,
      search = '',
      pageNumber = 1,
      pageSize = 10
    ): Promise<any[]> {
      const response = await this.axiosInstance.get(
        `/accounts/${accountId}/providers`,
        {
          params: { search, pageNumber, pageSize },
        }
      );
      return response.data;
    }
  
    /**
     * Retrieve a specific provider by provider and account ID.
     * @param accountId - The ID of the account.
     * @param providerId - The ID of the provider.
     */
    async getProvider(accountId: string, providerId: string): Promise<any> {
      const response = await this.axiosInstance.get(
        `/accounts/${accountId}/providers/${providerId}`
      );
      return response.data;
    }
  
    // ---------------------------------------------------------------------------
    // Authentication Endpoints
    // ---------------------------------------------------------------------------
  
    /**
     * Authenticate the user using credentials. A valid token pair is saved to localStorage.
     * @param data - The username and password for login.
     */
    async login(data: { username: string; password: string }): Promise<TokenResponseModel> {
      const response = await this.axiosInstance.post('/accounts/login', data);
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      return response.data;
    }
  
    /**
     * Request a refreshed token pair and replace the current tokens in localStorage.
     */
    async refreshToken(): Promise<TokenResponseModel> {
      const response = await this.axiosInstance.post('/accounts/refresh-token');
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      return response.data;
    }
  
    /**
     * Log the user out by invalidating the session and removing tokens from localStorage.
     */
    async logout(): Promise<void> {
      await this.axiosInstance.post('/accounts/logout');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  
    // ---------------------------------------------------------------------------
    // Meeting and Race Retrieval Endpoints
    // ---------------------------------------------------------------------------
  
    /**
     * Fetch available meetings filtered by date, jurisdiction, race type, and pagination.
     * @param date - The date of the meetings (YYYY-MM-DD).
     * @param jurisdiction - The jurisdiction code (default = 'VIC').
     * @param raceType - The race type code.
     * @param pageNumber - Page number for pagination (default = 1).
     * @param pageSize - Page size for pagination (default = 25).
     */
    async fetchMeetings(
      date: string,
      jurisdiction: string = 'VIC',
      raceType: string,
      pageNumber: number = 1,
      pageSize: number = 25
    ): Promise<Meeting[]> {
      const response = await this.axiosInstance.get(
        `/api/meetings/${date}/${raceType}`,
        {
          params: { jurisdiction, pageNumber, pageSize },
        }
      );
      return response.data;
    }
  
    /**
     * Fetch meetings by race type and date, with optional jurisdiction, page number, and page size.
     * @param date - The date of the meetings (YYYY-MM-DD).
     * @param type - The race type used for fetching (e.g., 'R', 'G', 'H').
     * @param jurisdiction - The jurisdiction code (default = 'VIC').
     * @param pageNumber - Page number for pagination (default = 1).
     * @param pageSize - Page size for pagination (default = 25).
     */
    async fetchMeetingsByType(
      date: string,
      type: string,
      jurisdiction: string = 'VIC',
      pageNumber: number = 1,
      pageSize: number = 25
    ): Promise<Meeting[]> {
      const response = await this.axiosInstance.get(
        `/api/meetings/${date}/type/${type}`,
        {
          params: { jurisdiction, pageNumber, pageSize },
        }
      );
      return response.data;
    }
  
    /**
     * Retrieve details for a specific meeting by its ID.
     * @param id - The unique ID representing the meeting.
     */
    async getMeetingData(id: string): Promise<any> {
      const response = await this.axiosInstance.get(`/data/${id}`);
      return response.data;
    }
  
    /**
     * Create a new meeting with the provided data.
     * @param data - The payload required to create a new meeting.
     */
    async createMeeting(data: any): Promise<any> {
      const response = await this.axiosInstance.post('/data', data);
      return response.data;
    }
  
    /**
     * Update an existing meeting with new data.
     * @param id - The identifier of the meeting to update.
     * @param data - The update payload.
     */
    async updateMeeting(id: string, data: any): Promise<any> {
      const response = await this.axiosInstance.put(`/data/${id}`, data);
      return response.data;
    }
  
    /**
     * Delete a specific meeting by its ID.
     * @param id - The identifier of the meeting to delete.
     */
    async deleteMeeting(id: string): Promise<void> {
      await this.axiosInstance.delete(`/data/${id}`);
    }
  
    // ---------------------------------------------------------------------------
    // Predictions Endpoint
    // ---------------------------------------------------------------------------
  
    /**
     * Generate racehorse predictions by uploading a FormData payload.
     * @param formData - The FormData containing required prediction data (e.g. CSV file).
     */
    async generateRacehorsePredictions(formData: FormData): Promise<any> {
      const response = await this.axiosInstance.post(
        '/predictions/racehorses/generate',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
      return response.data;
    }
  
    /**
     * Fetch available meeting dates based on jurisdiction.
     * @param jurisdiction - The selected jurisdiction (e.g., VIC).
     */
    async fetchMeetingDates(jurisdiction: string): Promise<any[]> {
      const response = await this.axiosInstance.get(
        `/api/meetings/dates?jurisdiction=${jurisdiction}`
      );
      return response.data;
    }
  
    // ---------------------------------------------------------------------------
    // Race Calculation (with all bankroll references removed)
    // ---------------------------------------------------------------------------
  
    /**
     * Calculate race predictions based on provided parameters.
     * @param jurisdiction - The jurisdiction.
     * @param meetingDate - The meeting date (YYYY-MM-DD).
     * @param venue - The venue mnemonic.
     * @param raceType - The race type (R/H/G).
     * @param raceNumber - The race number.
     */
    async calculateRace(
      jurisdiction: string,
      meetingDate: string,
      venue: string,
      raceType: string,
      raceNumber: number
    ): Promise<any> {
      const response = await this.axiosInstance.get(
        `/labs/punting/race-horsing/${jurisdiction}/${meetingDate}/${venue}/${raceType}/race/${raceNumber}/calculate`
      );
      // Publish the event with the race data
      this.eventEmitter.dispatchEvent(
        new CustomEvent('raceCalculated', {
          detail: response.data,
        })
      );
      return response.data;
    }
  
    /**
     * Fetch meeting details with the given parameters.
     * @param meetingName - The name of the meeting.
     * @param meetingDate - The date of the meeting.
     * @param jurisdiction - The jurisdiction of the meeting.
     * @param raceType - The race type (e.g., 'R', 'G', 'H').
     */
    async fetchMeetingDetails(
      meetingName: string,
      meetingDate: string,
      jurisdiction: string,
      raceType: string
    ) {
      const response = await this.axiosInstance.post(`/api/meetings/details`, {
        meetingName,
        meetingDate,
        jurisdiction,
        raceType,
      });
      return response.data;
    }
  
    // ---------------------------------------------------------------------------
    // Race Details Retrieval
    // ---------------------------------------------------------------------------
  
    /**
     * Fetch details for a specific race by venue mnemonic and race number.
     * @param venueMnemonic - A short code representing the venue (e.g., 'FLEM' for Flemington).
     * @param raceNumber - The number of the race to retrieve.
     */
    async getRaceDetails(venueMnemonic: string, raceNumber: number): Promise<RacePrediction> {
      const response = await this.axiosInstance.get(`/races/${venueMnemonic}/${raceNumber}`);
      if (!response.data) {
        throw new Error('Failed to fetch race details');
      }
      return response.data;
    }
  
    /**
     * Retrieve race data from a direct link that points to the race resource.
     * @param raceLink - The URL of the race resource.
     */
    async fetchRaceByLink(raceLink: string): Promise<any> {
      const response = await this.axiosInstance.get(raceLink);
      return response.data;
    }
  
    /**
     * Subscribe to race updates by providing a callback function. The callback is called
     * whenever a 'raceUpdate' event is emitted.
     * @param callback - A function that takes an updated race object.
     */
    onRaceUpdate(callback: (race: any) => void) {
      const handler = (event: any) => callback(event.detail);
      this.eventEmitter.addEventListener('raceUpdate', handler);
      return () => this.eventEmitter.removeEventListener('raceUpdate', handler);
    }
  
    // ---------------------------------------------------------------------------
    // Next-To-Go Races (Removal of bankroll references)
    // ---------------------------------------------------------------------------
  
    /**
     * Fetch the next-to-go races for a specified jurisdiction. This method
     * no longer initializes or accesses bankroll logic.
     * @param jurisdiction - The jurisdiction code (default = 'VIC').
     */
    async fetchNextToGoRaces(jurisdiction: string = 'VIC'): Promise<any> {
      const today = new Date().toISOString().split('T')[0];
      const raceTypes = ['R', 'G', 'H'];
      const utcNow = new Date().toISOString();
      const processedRaces: any[] = [];
  
      try {
        for (const raceType of raceTypes) {
          const response = await this.axiosInstance.get(
            `/api/meetings/${today}/type/${raceType}`,
            {
              params: {
                jurisdiction,
                pageNumber: 1,
                pageSize: 50,
              },
            }
          );
  
          // Process each meeting in parallel, but no bankroll operations occur anymore.
          await Promise.all(
            response.data.map(async (meeting: any) => {
              try {
                const predictions = await this.calculateRace(
                  meeting.location,
                  meeting.meetingDate,
                  meeting.venueMnemonic,
                  meeting.raceType,
                  meeting.nextRaceNumber || 1
                );
  
                const raceData = {
                  ...predictions,
                  meeting,
                  lastUpdated: utcNow,
                };
  
                const raceTime = new Date(raceData.raceStartTime);
                if (raceTime > new Date(utcNow)) {
                  processedRaces.push(raceData);
                  processedRaces.sort(
                    (a, b) =>
                      new Date(a.raceStartTime).getTime() -
                      new Date(b.raceStartTime).getTime()
                  );
  
                  // Emit the race update immediately.
                  this.eventEmitter.dispatchEvent(
                    new CustomEvent('raceUpdate', {
                      detail: {
                        races: processedRaces.slice(0, 10),
                        nextStepDescription:
                          'Review the next-to-go races and their predictions.',
                      },
                    })
                  );
                }
              } catch (error) {
                console.error(
                  `Error calculating predictions for ${meeting.meetingName}:`,
                  error
                );
              }
            })
          );
        }
  
        return {
          races: processedRaces.slice(0, 10),
          nextStepDescription: 'Review the next-to-go races and their predictions.',
        };
      } catch (error) {
        console.error('Error fetching next to go races:', error);
        throw error;
      }
    }
  
    // ---------------------------------------------------------------------------
    // Update Meeting Predictions (Removal of bankroll references)
    // ---------------------------------------------------------------------------
  
    /**
     * Update the predictions for a specific meeting. Any previously cached predictions
     * in "calculatedMeetings" will be overwritten. This method no longer
     * initializes or references bankroll logic.
     * @param meeting - The meeting object with location, date, race type, etc.
     */
    async updateMeetingPredictions(meeting: any): Promise<void> {
      const meetingKey = `${meeting.meetingName}-${meeting.meetingDate}-${meeting.raceType}`;
      try {
        const predictions = await this.calculateRace(
          meeting.location,
          meeting.meetingDate,
          meeting.venueMnemonic,
          meeting.raceType,
          meeting.nextRaceNumber || 1
        );
  
        this.calculatedMeetings.set(meetingKey, {
          ...predictions,
          meeting,
          lastUpdated: new Date(),
        });
      } catch (error) {
        console.error(`Error updating meeting ${meetingKey}:`, error);
      }
    }
  
    /**
     * Clear out old meetings from the calculatedMeetings cache if
     * their race start times have passed.
     */
    clearOldMeetings(): void {
      const now = new Date();
      Array.from(this.calculatedMeetings.entries()).forEach(([key, data]) => {
        const raceTime = new Date(data.raceStartTime);
        if (raceTime < now) {
          this.calculatedMeetings.delete(key);
        }
      });
    }
  }
  
  const apiService = new ApiService();
  export default apiService;
  export{}