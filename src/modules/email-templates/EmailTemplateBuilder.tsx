import GjsEditor, {
  AssetsProvider,
  Canvas,
  ModalProvider,
  TraitsProvider,
} from '@grapesjs/react';
import type { Editor, EditorConfig } from 'grapesjs';
import CustomAssetManager from './components/builders/CustomAssetManager';
import CustomModal from './components/builders/CustomModal';
import CustomTraitManager from './components/builders/CustomTraitManager';
import RightSidebar from './components/builders/RightSidebar';
import TopBar from './components/builders/TopBar';
import './components/builders/style.css';

const gjsOptions: EditorConfig = {
  height: 'calc(100vh-115px)',
  storageManager: false,
  undoManager: { trackSelection: false },
  selectorManager: { componentFirst: true },
  projectData: {
    assets: [
      'https://via.placeholder.com/350x250/78c5d6/fff',
      'https://via.placeholder.com/350x250/459ba8/fff',
      'https://via.placeholder.com/350x250/79c267/fff',
      'https://via.placeholder.com/350x250/c5d647/fff',
      'https://via.placeholder.com/350x250/f28c33/fff',
    ],
    pages: [
      {
        name: 'Home page',
        component: `<h1>GrapesJS React Custom UI</h1>`,
      },
    ],
  },
};

export default function EmailTemplateBuilder() {
  const onEditor = (editor: Editor) => {
    console.log('Editor loaded');
    (window as any).editor = editor;
  };

  return (
    <GjsEditor
      className='gjs-custom-editor text-black bg-gray-50'
      grapesjs='https://unpkg.com/grapesjs'
      grapesjsCss='https://unpkg.com/grapesjs/dist/css/grapes.min.css'
      options={gjsOptions}
      plugins={[
        {
          id: 'gjs-blocks-basic',
          src: 'https://unpkg.com/grapesjs-blocks-basic',
        },
      ]}
      onEditor={onEditor}
    >
      <div className={`flex h-[calc(100vh-115px)] border-t border-gray-200`}>
        <RightSidebar
          className={`gjs-column-l w-[220px] border-l border-gray-200 overflow-y-auto`}
        />
        <div className='gjs-column-m flex flex-col flex-grow'>
          <TopBar className='min-h-[48px]' />
          <Canvas className='flex-grow gjs-custom-editor-canvas' />
        </div>
        <div className='gjs-column-r w-[220px] border-l border-gray-200 overflow-y-auto'>
          <TraitsProvider>
            {(props) => <CustomTraitManager {...props} />}
          </TraitsProvider>
        </div>
      </div>

      <ModalProvider>
        {({ open, title, content, close }) => (
          <CustomModal
            open={open}
            title={title}
            children={content}
            close={close}
          />
        )}
      </ModalProvider>

      <AssetsProvider>
        {({ assets, select, close, Container }) => (
          <Container>
            <CustomAssetManager assets={assets} select={select} close={close} />
          </Container>
        )}
      </AssetsProvider>
    </GjsEditor>
  );
}
