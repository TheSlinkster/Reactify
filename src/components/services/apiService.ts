
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
    
}
const apiService = new ApiService();
export default apiService;