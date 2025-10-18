import GjsEditor, { Canvas, TraitsProvider } from '@grapesjs/react';
import { App } from 'antd';
import type { Editor, EditorConfig } from 'grapesjs';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MediaManagerModal from '../../components/MediaManagerModal';
import { camelToTitle } from '../../helpers/views_helper';
import ApiService from '../../services/ApiService';
import MetadataService from '../../services/MetadataService';
import {
  addEditorBlocks,
  addEditorTraits,
  getEditorHtml,
} from './components/builders/common';
import CustomTraitManager from './components/builders/CustomTraitManager';
import RightSidebar from './components/builders/RightSidebar';
import './components/builders/style.css';
import TopBar from './components/builders/TopBar';
import EmailTemplateFormModal from './components/EmailTemplateFormModal';

const gjsOptions: EditorConfig = {
  height: 'calc(100vh-115px)',
  storageManager: false,
  undoManager: { trackSelection: false },
  selectorManager: { componentFirst: true },
  projectData: {
    pages: [
      {
        name: 'Home page',
        component: `
          <div style="max-width: 600px; margin: 0 auto; background: white; font-family: Arial, sans-serif;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
              <h1 style="margin: 0; color: white; font-size: 32px; font-weight: bold;">Welcome to our Newsletter</h1>
              <p style="margin: 15px 0 0 0; color: rgba(255,255,255,0.9); font-size: 18px;">Stay updated with our latest news and offers</p>
            </div>
            <div style="padding: 40px 20px;">
              <p style="margin: 0 0 20px 0; line-height: 1.6; color: #333; font-size: 16px;">
                Thank you for subscribing to our newsletter! We're excited to share our latest updates, exclusive offers, and valuable content with you.
              </p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="#" style="display: inline-block; padding: 15px 30px; background: #007bff; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">Get Started</a>
              </div>
              <p style="margin: 20px 0 0 0; line-height: 1.6; color: #666; font-size: 14px;">
                If you have any questions, feel free to reach out to our support team. We're here to help!
              </p>
            </div>
          </div>
        `,
      },
    ],
  },
};

export default function EmailTemplateBuilder() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { message, notification } = App.useApp();

  const [gjsEditor, setGjsEditor] = useState<Editor | null>(null);
  const [openMediaManager, setOpenMediaManager] = useState(false);
  const [openSaveModal, setOpenSaveModal] = useState(false);
  const [data, setData] = useState<any>({});
  const [values, setValues] = useState<any>({ for_module: 'Accounts' });

  const onEditor = (editor: Editor) => {
    (window as any).editor = editor;

    editor.Commands.add('open-media-manager', {
      run: () => {
        setOpenMediaManager(true);
      },
    });

    editor.runCommand('sw-visibility');
    addEditorBlocks(editor);
    addEditorTraits(editor);

    setGjsEditor(editor);
  };

  const handleSelectMedia = (media: any) => {
    if (gjsEditor) {
      let url = media.url;
      if (url.startsWith('/')) {
        url = import.meta.env.VITE_MEDIA_URL + url;
      }
      const component = gjsEditor.getSelected();
      component?.set('src', url);
    }
  };

  const getModuleFields = (module: string) => {
    const contentType = MetadataService.getContentTypeByModule(module);
    if (!contentType) {
      return [];
    }
    return MetadataService.getContentTypeListFields(contentType);
  };

  useEffect(() => {
    if (gjsEditor && values.for_module) {
      let options: string = `<option value="">Select Field</option>`;

      const fields = getModuleFields(values.for_module);
      if (fields && fields.length > 0) {
        fields.forEach((field: any) => {
          options += `<option value="${field.name}">${
            field.label || camelToTitle(field.name)
          }</option>`;
        });
      }

      // Update rich text editor plugins
      gjsEditor.RichTextEditor.add('collection-fields', {
        icon: `
          <select class="gjs-rte-select" id="rte-collection-fields">
            ${options}
          </select>
        `,
        event: 'change',
        result: (rte, action) => {
          const selected = action.btn?.firstChild?.nextSibling;
          if (!selected) {
            return;
          }
          const value = (selected as any).value;
          rte.insertHTML(`<%= record.${value} %>`);
        },
      });
    }
  }, [values.for_module, gjsEditor]);

  useEffect(() => {
    if (id && gjsEditor) {
      // Load email template content
      ApiService.getClient()
        .collection('email-templates')
        .findOne(id)
        .then((res) => {
          setData(res?.data);
          if (res?.data?.rawContent?.projectData) {
            gjsEditor.loadProjectData(res.data.rawContent.projectData);
          }
        });
    }
  }, [id, gjsEditor]);

  const handleSave = async () => {
    if (!gjsEditor) {
      message.error('Please wait...');
      return;
    }

    if (!values.title || !values.for_module) {
      message.error('Please update email template configuration');
      return;
    }

    const projectData = await gjsEditor.store();
    const htmlContent = getEditorHtml(gjsEditor);

    const saveValues: any = { ...values };
    saveValues.content = htmlContent;
    saveValues.rawContent = {
      projectData,
    };

    message.loading('Saving...', 0);
    let service: any;
    if (id) {
      service = ApiService.getClient()
        .collection('email-templates')
        .update(id, saveValues);
    } else {
      service = ApiService.getClient()
        .collection('email-templates')
        .create(saveValues);
    }

    service
      .then(() => {
        notification.success({
          message: 'Success',
          description: 'Email Template saved successfully',
        });
        navigate('/collections/email-templates');
      })
      .catch((err: any) => {
        notification.error({
          message: 'Error',
          description: err.data?.message || 'Failed to save Email Template',
        });
      })
      .finally(() => {
        message.destroy();
      });
  };

  return (
    <>
      <GjsEditor
        className='gjs-custom-editor text-black bg-gray-50'
        grapesjs='https://unpkg.com/grapesjs'
        grapesjsCss='https://unpkg.com/grapesjs/dist/css/grapes.min.css'
        options={gjsOptions}
        onEditor={onEditor}
      >
        <div className={`flex h-[calc(100vh-115px)] border-t border-gray-200`}>
          <RightSidebar
            className={`gjs-column-l w-[280px] border-l border-gray-200 overflow-y-auto`}
          />
          <div className='gjs-column-m flex flex-col flex-grow'>
            <TopBar
              className='min-h-[48px]'
              onConfig={() => setOpenSaveModal(true)}
              onCancel={() => navigate('/collections/email-templates')}
              onSelectSave={handleSave}
            />
            <Canvas className='flex-grow gjs-custom-editor-canvas' />
          </div>
          <div className='gjs-column-r w-[280px] border-l border-gray-200 overflow-y-auto'>
            <TraitsProvider>
              {(props) => <CustomTraitManager {...props} />}
            </TraitsProvider>
          </div>
        </div>
      </GjsEditor>

      <MediaManagerModal
        open={openMediaManager}
        onOpenChange={setOpenMediaManager}
        onSelect={handleSelectMedia}
      />

      {gjsEditor && (
        <EmailTemplateFormModal
          open={openSaveModal}
          onOpenChange={setOpenSaveModal}
          data={data}
          onFinish={(record) => {
            setValues(record);
          }}
        />
      )}
    </>
  );
}
