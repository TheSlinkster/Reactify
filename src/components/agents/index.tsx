import React, { useEffect, useState } from 'react';
import { ControlButton } from 'reactflow';
import { LoadingContainer, ErrorContainer, NoFeaturesContainer, MainWrapper, PanelContainer, PanelHeader, PanelControls, PanelContent } from './styles';


/**
 * -- 1. EXAMPLE AUTH CALL + FETCHING JSON INSTRUCTIONS --
 *    This function simulates:
 *      - Authenticating with a token or any other method.
 *      - Fetching JSON instructions from an agent endpoint.
 *    The instructions might look like:
 *    [
 *      { "featureType": "system", "title": "System Only" },
 *      { "featureType": "ui", "title": "Dashboard Panel" },
 *      { "featureType": "icon", "title": "Some Icon" }
 *      ...
 *    ]
 */
async function authenticateAndFetchInstructions(authToken: string): Promise<Instruction[]> {
  // Example fetch call: replace with your real endpoint
  // In a real scenario, you'd do:
  // const response = await fetch('https://your-agent-endpoint.com/instructions', {
  //   headers: { Authorization: `Bearer ${authToken}` }
  // });
  // const data = await response.json();

  // For demo, we'll return hard-coded instructions:
  const data = [
    { featureType: 'system', title: 'System Panel' },
    { featureType: 'ui', title: 'Welcome Panel' },
    { featureType: 'icon', title: 'Add Item Icon' },
    { featureType: 'ui', title: 'Settings Panel' }
  ];
  return data as Instruction[];
}

/** 
 * -- 2. SHAPE OF A SINGLE INSTRUCTION --
 *    You can modify this interface based on the actual structure
 *    of your JSON instructions from the agent.
 */
interface Instruction {
  featureType: string; // e.g. "system", "icon", "ui"...
  title: string;
}

/** 
 * -- 3. EXAMPLE WRAPPER COMPONENT --
 *    This component handles:
 *      - Authenticating
 *      - Fetching instructions
 *      - Filtering out system/icons
 *      - Rendering a ModalPanel for each "ui" item
 */
export default function InstructionAgentLoader() {
  const [instructions, setInstructions] = useState<Instruction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // For demonstration, we’ll pretend our “authToken” is a constant string:
  const authToken = 'SAMPLE_TOKEN_VALUE';

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await authenticateAndFetchInstructions(authToken);
        setInstructions(data);
      } catch (err: any) {
        setError(err.message || 'Error fetching instructions');
      } finally {
        setLoading(false);
      }
    })();
  }, [authToken]);

  // Filter out "system" and "icon" features
  const filteredInstructions = instructions.filter(
    instr => instr.featureType !== 'system' && instr.featureType !== 'icon'
  );

  if (loading) {
    return <LoadingContainer>Loading instructions from agent...</LoadingContainer>;
  }

  if (error) {
    return <ErrorContainer>Failed to load instructions: {error}</ErrorContainer>;
  }

  // If there are no valid instructions left after filtering, show a fallback
  if (!filteredInstructions.length) {
    return <NoFeaturesContainer>No features to display.</NoFeaturesContainer>;
  }

  // Example of rendering multiple ModalPanels, one for each “ui” instruction
  return (
    <MainWrapper>
      {filteredInstructions.map((instr, idx) => (
        <ModalPanel
          key={idx}
          title={instr.title}
          onClose={() => alert(`Closing ${instr.title}`)}
          onFullscreen={() => alert(`Fullscreen requested for ${instr.title}`)}
          onHeaderMouseDown={() => console.log(`Drag start for ${instr.title}`)}
        >
          <p>This panel is loaded from instruction: {instr.title}</p>
          <p>Your agent said featureType = {instr.featureType}</p>
        </ModalPanel>
      ))}
    </MainWrapper>
  );
}

/**
 * -- 4. REUSABLE ModalPanel COMPONENT --
 *    (Same code you provided, embedded here for a fully self-contained example)
 */
interface ModalPanelProps {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  onFullscreen: () => void;
  style?: React.CSSProperties;
  onHeaderMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const ModalPanel: React.FC<ModalPanelProps> = ({
  title,
  children,
  onClose,
  onFullscreen,
  style,
  onHeaderMouseDown
}) => {
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