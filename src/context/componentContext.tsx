import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/apiService';
import componentManifest from './componentManifest.json';
// Define an interface for the component map, where each key is a string
// and each value is a React functional component.
interface ComponentMap {
  [key: string]: React.FC;
}

// Create a context with an empty object as the default value.
const ComponentContext = createContext<ComponentMap>({});

// Custom hook to use the ComponentContext, providing easy access to the context value.
export const useComponentContext = () => useContext(ComponentContext);

// ComponentProvider component that will wrap the application (or part of it) to provide the context.
export const ComponentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State to hold the dynamically loaded components.
  const [components, setComponents] = useState<ComponentMap>({});

  // useEffect to load components asynchronously when the provider mounts.
  useEffect(() => {
    const loadComponents = async () => {
      try {
        // Fetch component "feature" definitions from the API (which may contain component names).
        const componentNames = await apiService.getFeatures();
        const loadedComponents: ComponentMap = {};

        for (const item of componentNames) {
          // Some items might just be a string, or an object with "componentName".
          const name = typeof item === 'string' ? item : item.component;

          // Make sure it's a valid name in your manifest before trying to load.
          if (typeof name === 'string' && name in componentManifest) {
            try {
              // Use the manifest to find the module path for that component.
              const componentPath = componentManifest[name as keyof typeof componentManifest];
              if (componentPath) {
                // Dynamically import the component module using the path from the manifest.
                const module = await import(`${componentPath}`);
                // Assign the component’s default export into the map.
                loadedComponents[name] = module.default;
                console.log("Loaded component:", name);
              } else {
                console.error(`Component ${name} not found in manifest.`);
              }
            } catch (error) {
              console.error(`Failed to load component ${name}:`, error);
            }
          } else {
            console.error(`Invalid or unknown component name: ${name}`);
          }
        }

        // Update the state with all the successfully loaded components.
        setComponents(loadedComponents);
      } catch (error) {
        console.error('Error loading components:', error);
      }
    };

    // Start loading components as soon as the provider mounts.
    loadComponents();
  }, []);

  // Provide the loaded components in the context.
  return (
    <ComponentContext.Provider value={components}>
      {children}
    </ComponentContext.Provider>
  );
};
export{}