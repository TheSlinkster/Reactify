import React from 'react';
import { ControlButton } from 'reactflow';
import styled from 'styled-components';
import { PanelContainer, PanelHeader, PanelControls, PanelContent } from '../components/agents/styles';

interface ModalPanelProps {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  onFullscreen: () => void;
  style?: React.CSSProperties;
  onHeaderMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const ModalPanel: React.FC<ModalPanelProps> = ({ title, children, onClose, onFullscreen, style, onHeaderMouseDown }) => {
  return (
    <PanelContainer style={style}>
      <PanelHeader onMouseDown={onHeaderMouseDown}>
        {title}
        <PanelControls>
          <ControlButton onClick={onClose}>−</ControlButton>
          <ControlButton onClick={onFullscreen}>⛶</ControlButton>
        </PanelControls>
      </PanelHeader>
      <PanelContent>{children}</PanelContent>
    </PanelContainer>
  );
};

export default ModalPanel;

export{}