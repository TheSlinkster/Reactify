import styled from 'styled-components';

// Styled Components
export const PanelContainer = styled.div`
  width: 400px;
  height: 200px;
  margin: 10px;
  background: rgba(0, 0, 0, 0.8);
  border: 2px solid #0ff;
  box-shadow: 0 0 15px rgba(0, 255, 194, 0.5);
  display: flex;
  flex-direction: column;
`;

export const PanelHeader = styled.div`
  background: linear-gradient(135deg, #9b00ff, #00ffc2);
  padding: 10px;
  color: #fff;
  font-weight: bold;
  text-align: center;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: move; /* Provide a visual cue that it's draggable */
`;

export const PanelControls = styled.div`
  display: flex;
  gap: 5px;
`;

export const ControlButton = styled.button`
  background: transparent;
  border: none;
  color: #fff;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    color: #0ff;
  }
`;

export const PanelContent = styled.div`
  padding: 10px;
  color: #fff;
  overflow: auto;
  flex-grow: 1;
`;

/**
 * -- 5. STYLED CONTAINERS FOR LOADING/ERROR/EMPTY STATES --
 */
export const MainWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
`;

export const LoadingContainer = styled.div`
  color: #ff0;
  font-size: 18px;
  margin: 20px;
`;

export const ErrorContainer = styled.div`
  color: #f00;
  font-weight: bold;
  margin: 20px;
`;

export const NoFeaturesContainer = styled.div`
  color: #ccc;
  font-style: italic;
  margin: 20px;
`;
