import React, { useState, useEffect, useRef, useCallback, FC } from 'react';
import styled, { keyframes } from 'styled-components';
import apiService from '../services/apiService';
import '../components/desktop/Desktop.css'

interface DesktopWindow {
    id: string;
    title: string;
    x: number;       // Current left position
    y: number;       // Current top position
    width: number;
    height: number;
    zIndex: number;  // For ordering
    minimized: boolean;
    maximized: boolean;
    content: React.ReactNode;
}
//type IconComponentType = React.FC;

// Define a type for the icon data fetched from the service
interface IconData {
    tilePosition?: { x: number, y: number };
    id: string;
    label?: string;
    image?: string;
    color?: string;
    x: number;
    y: number;
    width?: number;
    height?: number;
    component?: React.ComponentType<React.PropsWithChildren<{}>>; // Updated
    icon?: string;
    name?: string;
    action?: (id?: string) => void;
}

const WindowWrapper: React.FC<any> = ({ title, children }) => (
    <div style={{ border: '0px solid #0ff', padding: '10px', margin: '10px' }}>
        <h2 style={{ color: '#0ff' }}>{title}</h2>
        {children}
    </div>
);
const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    iconId: string | null;
}>({ visible: false, x: 0, y: 0, iconId: null });

const DesktopEnviroment: React.FC = () => {
    const [windows, setWindows] = useState<DesktopWindow[]>([]);
    // Keep track of the highest zIndex in use.
    const [highestZ, setHighestZ] = useState(10);
    // The icons that are available to show on the desktop.
    const [loadedIcons, setLoadedIcons] = useState<IconData[]>([]);
    /** Create or restore a window for the icon that was double-clicked. */
    const handleIconDoubleClick = (iconId: string) => {
        // Check if this window is already open.
        const existing = windows.find((w) => w.id === iconId);
        if (existing) {
            // If minimized, un‐minimize it.
            if (existing.minimized) {
                toggleMinimizeWindow(iconId);
            }
            // Move it to the front.
            bringToFront(iconId);
            return;
        }

        // Otherwise create a new window.
        const icon = loadedIcons.find((i) => i.id === iconId);
        if (!icon) return;

        // If there is a specific component to show, create it:
        let content: React.ReactNode = null;
        if (icon.component) {
            const Component = icon.component; // Assign to a variable for proper rendering
            content = (
                <WindowWrapper title={icon.label || icon.name || 'Unknown'}>
                    <Component />
                </WindowWrapper>
            );
        } else {
            // If no component, create a placeholder or do nothing.
            content = (
                <WindowWrapper title={icon.label || icon.name || 'Unknown'}>
                    <p>No component found for this icon.</p>
                </WindowWrapper>
            );
        }

        const newWin: DesktopWindow = {
            id: iconId,
            title: icon.label || icon.name || 'Unknown',
            x: 100,
            y: 100,
            width: 400,
            height: 300,
            zIndex: highestZ + 1,
            minimized: false,
            maximized: false,
            content,
        };

        setHighestZ((prev) => prev + 1);
        setWindows((prev) => [...prev, newWin]);
    };

    
    /** Right‐click on an icon -> open context menu */
  const handleIconContextMenu = (e: React.MouseEvent, iconId: string) => {
    e.preventDefault();
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      iconId,
    });
  };
    /** Move a window to the front. */
    const bringToFront = (id: string) => {
        setHighestZ((prev) => prev + 1);
        setWindows((prev) =>
            prev.map((w) => (w.id === id ? { ...w, zIndex: highestZ + 1 } : w))
        );
        /** Clicking the desktop hides any open context menu. */
        const handleDesktopClick = () => {
            if (contextMenu.visible) {
                setContextMenu({ visible: false, x: 0, y: 0, iconId: null });
            }
        };

        /** "Open" from the context menu. */
        const handleOpenFromContextMenu = () => {
            if (contextMenu.iconId) {
                handleIconDoubleClick(contextMenu.iconId);
            }
            setContextMenu({ visible: false, x: 0, y: 0, iconId: null });
        };
    };
    /** Close a window completely. */
  const closeWindow = (id: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== id));
  };

  /** Minimize or restore a window. */
  const toggleMinimizeWindow = (id: string) => {
    setWindows((prev) =>
      prev.map((w) =>
        w.id === id
          ? { ...w, minimized: !w.minimized, maximized: false }
          : w
      )
    );
  };

  /** Maximize or restore a window. */
  const toggleMaximizeWindow = (id: string) => {
    setWindows((prev) =>
      prev.map((w) =>
        w.id === id
          ? { ...w, maximized: !w.maximized, minimized: false }
          : w
      )
    );
    bringToFront(id);
  };

  /** Handle dragging a window by its title bar. */
  const handleMouseDownOnTitle = (
    e: React.MouseEvent,
    id: string
  ) => {
    e.preventDefault();
    bringToFront(id);

    const startX = e.clientX;
    const startY = e.clientY;

    // Find the window's current position:
    const win = windows.find((w) => w.id === id);
    if (!win) return;

    const initialX = win.x;
    const initialY = win.y;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;

      setWindows((prev) =>
        prev.map((w) =>
          w.id === id
            ? { ...w, x: initialX + dx, y: initialY + dy }
            : w
        )
      );
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  /** Handle dragging from the bottom‐right resize handle. */
  const handleResizeMouseDown = (
    e: React.MouseEvent,
    id: string
  ) => {
    e.preventDefault();
    e.stopPropagation();
    bringToFront(id);

    const startX = e.clientX;
    const startY = e.clientY;

    const win = windows.find((w) => w.id === id);
    if (!win) return;

    const initWidth = win.width;
    const initHeight = win.height;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;

      setWindows((prev) =>
        prev.map((w) =>
          w.id === id
            ? {
                ...w,
                width: Math.max(200, initWidth + dx),
                height: Math.max(100, initHeight + dy),
              }
            : w
        )
      );
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  /** Render all non-minimized windows. */
    /** Clicking the desktop hides any open context menu. */
  const handleDesktopClick = () => {
    if (contextMenu.visible) {
      setContextMenu({ visible: false, x: 0, y: 0, iconId: null });
    }
  };
    return (
        <div className="Desktop-Container" onClick={handleDesktopClick}>

        </div>
    )


}
export default DesktopEnviroment;