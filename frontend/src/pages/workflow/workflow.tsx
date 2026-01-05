import '@flowgram.ai/free-layout-editor/index.css';
import {
  FreeLayoutEditorProvider,
  EditorRenderer,
} from '@flowgram.ai/free-layout-editor';

const Workflow: React.FC = () => (
  <FreeLayoutEditorProvider>
    <EditorRenderer />
  </FreeLayoutEditorProvider>
);

export default Workflow;
