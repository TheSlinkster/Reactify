/*******************************************************************************************
 * FILE: BetContext.tsx
 *
 * A single-file local module that implements:
 *   - Bankroll management
 *   - Betting filters
 *   - A pipeline to evaluate a bet (bankroll check -> filters -> mock API placement).
 *   - A React Context/Provider with a custom hook to enable global access across the app.
 ******************************************************************************************/
import React, {
    createContext,
    useContext,
    useState,
    ReactNode,
    useCallback
  } from "react";
  
  /**
   * Mocked API calls to simulate backend functionality.
   * Replace with real endpoints once your backend is ready.
   */
  const mockApi = {
    getOdds: async (raceId: string): Promise<number> => {
      // Simulate an async call
      await new Promise((resolve) => setTimeout(resolve, 300));
      // Example: returning random odds between 2.0 and 10.0
      return parseFloat((Math.random() * 8 + 2).toFixed(2));
    },
  
    placeBet: async (raceId: string, stake: number): Promise<{ success: boolean; betId: string }> => {
      // Simulate an async call
      await new Promise((resolve) => setTimeout(resolve, 500));
      // Example: 90% chance success
      const success = Math.random() < 0.9;
      return {
        success,
        betId: `BET-${Math.floor(Math.random() * 100000)}`
      };
    }
  };
  
  /*******************************************************************************************
   * TYPES & INTERFACES
   ******************************************************************************************/
  export interface BetRequest {
    raceId: string;
    stake: number; // e.g. total stake
  }
  
  export interface BetResult {
    success: boolean;
    message: string;
    betId?: string;
  }
  
  export type BetFilter = (bet: BetRequest, currentBalance: number) => boolean | string;
  /*
    A BetFilter returns either:
     - boolean true => pass
     - boolean false => fail
     - or a string => fail reason (like "Stake exceeds 2% of bankroll").
  */
  
  interface BetContextState {
    balance: number;
    filters: BetFilter[];
    addFilter: (filter: BetFilter) => void;
    removeFilter: (filter: BetFilter) => void;
    placeBet: (bet: BetRequest) => Promise<BetResult>;
  }
  
  interface BetProviderProps {
    children: ReactNode;
    initialBalance?: number;
  }
  
  /*******************************************************************************************
   * CONTEXT DEFINITION
   ******************************************************************************************/
  const BetContext = createContext<BetContextState | undefined>(undefined);
  
  /**
   * Custom hook to access the BetContext from any component.
   */
  export function useBetContext(): BetContextState {
    const context = useContext(BetContext);
    if (!context) {
      throw new Error("useBetContext must be used within a <BetProvider>.");
    }
    return context;
  }
  
  /*******************************************************************************************
   * PROVIDER IMPLEMENTATION
   ******************************************************************************************/
  export const BetProvider: React.FC<BetProviderProps> = ({
    children,
    initialBalance = 50000 // default bankroll if none provided
  }) => {
    // Bankroll
    const [balance, setBalance] = useState<number>(initialBalance);
  
    // Collection of filters
    const [filters, setFilters] = useState<BetFilter[]>([]);
  
    /**
     * addFilter: Allows you to add a new filter function at runtime.
     */
    const addFilter = useCallback((filter: BetFilter) => {
      setFilters((prev) => [...prev, filter]);
    }, []);
  
    /**
     * removeFilter: Allows you to remove an existing filter function from the list.
     */
    const removeFilter = useCallback((filter: BetFilter) => {
      setFilters((prev) => prev.filter((f) => f !== filter));
    }, []);
  
    /**
     * placeBet: The main pipeline to:
     *   1) Check bankroll,
     *   2) Run each filter,
     *   3) If all pass, call mock API to place bet,
     *   4) On success, deduct stake from local balance
     */
    const placeBet = useCallback(
      async (bet: BetRequest): Promise<BetResult> => {
        // 1) Basic bankroll check
        if (bet.stake > balance) {
          return {
            success: false,
            message: "Insufficient bankroll to place this bet."
          };
        }
  
        // 2) Run filters
        for (const filter of filters) {
          const result = filter(bet, balance);
          if (result !== true) {
            // If filter returns false or a string, it fails
            return {
              success: false,
              message:
                typeof result === "string"
                  ? `Bet rejected: ${result}`
                  : "Bet rejected by a filter."
            };
          }
        }
  
        // 3) If we get here, proceed with the mock API
        try {
          const odds = await mockApi.getOdds(bet.raceId);
          // Optionally use "odds" to do additional checks or calculations.
  
          // Place the bet with the mock API
          const response = await mockApi.placeBet(bet.raceId, bet.stake);
  
          if (!response.success) {
            return {
              success: false,
              message: "Bet placement failed (mock API)."
            };
          }
  
          // 4) On success, deduct stake from local balance
          setBalance((prev) => prev - bet.stake);
  
          return {
            success: true,
            message: "Bet successfully placed!",
            betId: response.betId
          };
        } catch (error: any) {
          return {
            success: false,
            message: `Bet placement failed: ${error.message}`
          };
        }
      },
      [balance, filters]
    );
  
    /**
     * The context value we provide to all children
     */
    const value: BetContextState = {
      balance,
      filters,
      addFilter,
      removeFilter,
      placeBet
    };
  
    return <BetContext.Provider value={value}>{children}</BetContext.Provider>;
  };
  
  /*******************************************************************************************
   * USAGE EXAMPLE:
   *
   *   // In your top-level (e.g., index.tsx or App.tsx)
   *   import { BetProvider } from "./BetContext";
   *
   *   const root = ReactDOM.createRoot(document.getElementById("root")!);
   *   root.render(
   *     <BetProvider initialBalance={100000}>
   *       <App />
   *     </BetProvider>
   *   );
   *
   *   // In any child component:
   *   import { useBetContext } from "./BetContext";
   *
   *   function PlaceBetButton() {
   *     const { placeBet, balance } = useBetContext();
   *
   *     const handleClick = async () => {
   *       const result = await placeBet({ raceId: "RACE-123", stake: 1000 });
   *       if (result.success) alert(result.message);
   *       else alert(result.message);
   *     };
   *
   *     return (
   *       <button onClick={handleClick}>Place Bet (Balance: {balance})</button>
   *     );
   *   }
   *
   *   function MyFilterSetup() {
   *     const { addFilter } = useBetContext();
   *
   *     React.useEffect(() => {
   *       // Example: filter that prevents >2% of bankroll
   *       const max2PercentFilter = (bet: BetRequest, currentBal: number) => {
   *         const twoPercent = currentBal * 0.02;
   *         if (bet.stake > twoPercent) {
   *           return "Stake exceeds 2% of current bankroll.";
   *         }
   *         return true;
   *       };
   *       addFilter(max2PercentFilter);
   *     }, [addFilter]);
   *
   *     return null;
   *   }
   ******************************************************************************************/
  