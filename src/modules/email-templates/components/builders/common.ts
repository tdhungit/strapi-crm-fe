import type { Editor } from 'grapesjs';

export const MAIN_BG_COLOR = 'bg-white';

export const MAIN_TXT_COLOR = 'text-black';

export const BTN_CLS = 'border rounded px-2 py-1 w-full';

export const MAIN_BORDER_COLOR = 'border-gray-200';

export const ROUND_BORDER_COLOR = `rounded border ${MAIN_BORDER_COLOR}`;

export function cx(...inputs: any[]): string {
  const inp = Array.isArray(inputs[0]) ? inputs[0] : [...inputs];
  return inp.filter(Boolean).join(' ');
}

export function addEditorBlocks(editor: Editor) {
  let tableStyleStr = '';
  let cellStyleStr = '';

  const cellStyle: any = {
    padding: '0',
    margin: '0',
    'vertical-align': 'top',
  };
  const tableStyle: any = {
    height: '150px',
    margin: '0 auto 10px auto',
    padding: '5px 5px 5px 5px',
    width: '100%',
  };

  for (const prop in tableStyle) {
    tableStyleStr += `${prop}: ${tableStyle[prop]}; `;
  }
  for (const prop in cellStyle) {
    cellStyleStr += `${prop}: ${cellStyle[prop]}; `;
  }

  editor.BlockManager.add('sect100', {
    label: '1 Section',
    media: `<svg viewBox="0 0 24 24">
      <path fill="currentColor" d="M2 20h20V4H2v16Zm-1 0V4a1 1 0 0 1 1-1h20a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1Z"/>
    </svg>`,
    content: `
      <table style="${tableStyleStr}">
        <tr>
          <td style="${cellStyleStr}"></td>
        </tr>
      </table>
    `,
  });

  editor.BlockManager.add('sect50', {
    label: '1/2 Section',
    media: `<svg viewBox="0 0 23 24">
      <path fill="currentColor" d="M2 20h8V4H2v16Zm-1 0V4a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1ZM13 20h8V4h-8v16Zm-1 0V4a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1h-8a1 1 0 0 1-1-1Z"/>
    </svg>`,
    content: `
      <table style="${tableStyleStr}">
        <tr>
          <td style="${cellStyleStr} width: 50%"></td>
          <td style="${cellStyleStr} width: 50%"></td>
        </tr>
      </table>
    `,
  });

  editor.BlockManager.add('sect30', {
    label: '1/3 Section',
    media: `<svg viewBox="0 0 23 24">
      <path fill="currentColor" d="M2 20h4V4H2v16Zm-1 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1ZM17 20h4V4h-4v16Zm-1 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1ZM9.5 20h4V4h-4v16Zm-1 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1Z"/>
    </svg>`,
    content: `
      <table style="${tableStyleStr}">
        <tr>
          <td style="${cellStyleStr} width: 33.3333%"></td>
          <td style="${cellStyleStr} width: 33.3333%"></td>
          <td style="${cellStyleStr} width: 33.3333%"></td>
        </tr>
      </table>
    `,
  });

  editor.BlockManager.add('sect37', {
    label: '3/7 Section',
    media: `<svg viewBox="0 0 24 24">
      <path fill="currentColor" d="M2 20h5V4H2v16Zm-1 0V4a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1ZM10 20h12V4H10v16Zm-1 0V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H10a1 1 0 0 1-1-1Z"></path>
    </svg>`,
    content: `
      <table style="${tableStyleStr}">
        <tr>
          <td style="${cellStyleStr} width:30%"></td>
          <td style="${cellStyleStr} width:70%"></td>
        </tr>
      </table>
    `,
  });

  editor.BlockManager.add('header-block', {
    label: 'Header',
    content: `
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; font-family: Arial, sans-serif;">
        <h1 style="margin: 0; color: white; font-size: 32px; font-weight: bold;">Welcome</h1>
        <p style="margin: 15px 0 0 0; color: rgba(255,255,255,0.9); font-size: 18px;">Your beautiful email starts here</p>
      </div>
    `,
    media: `<svg viewBox="0 0 24 24">
      <path fill="currentColor" d="M20,20H4A2,2 0 0,1 2,18V6A2,2 0 0,1 4,4H20A2,2 0 0,1 22,6V18A2,2 0 0,1 20,20M4,6V18H20V6H4M6,9H18V11H6V9M6,13H16V15H6V13Z" />
    </svg>`,
  });

  editor.BlockManager.add('text', {
    label: 'Text',
    media: `<svg viewBox="0 0 24 24">
      <path fill="currentColor" d="M18.5,4L19.66,8.35L18.7,8.61C18.25,7.74 17.79,6.87 17.26,6.43C16.73,6 16.11,6 15.5,6H13V16.5C13,17 13,17.5 13.33,17.75C13.67,18 14.33,18 15,18V19H9V18C9.67,18 10.33,18 10.67,17.75C11,17.5 11,17 11,16.5V6H8.5C7.89,6 7.27,6 6.74,6.43C6.21,6.87 5.75,7.74 5.3,8.61L4.34,8.35L5.5,4H18.5Z" />
    </svg>`,
    activate: true,
    content: {
      type: 'text',
      content: 'Insert your text here',
      style: { padding: '10px' },
    },
  });

  editor.BlockManager.add('text-sect', {
    label: 'Text Section',
    media: `<svg viewBox="0 0 24 24">
        <path fill="currentColor" d="M20,20H4A2,2 0 0,1 2,18V6A2,2 0 0,1 4,4H20A2,2 0 0,1 22,6V18A2,2 0 0,1 20,20M4,6V18H20V6H4M6,9H18V11H6V9M6,13H16V15H6V13Z" />
    </svg>`,
    content: `
      <h1 class="heading">Insert title here</h1>
      <p class="paragraph">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
      </p>
    `,
  });

  editor.BlockManager.add('button', {
    label: 'Button',
    media: `<svg viewBox="0 0 24 24">
        <path fill="currentColor" d="M20 20.5C20 21.3 19.3 22 18.5 22H13C12.6 22 12.3 21.9 12 21.6L8 17.4L8.7 16.6C8.9 16.4 9.2 16.3 9.5 16.3H9.7L12 18V9C12 8.4 12.4 8 13 8S14 8.4 14 9V13.5L15.2 13.6L19.1 15.8C19.6 16 20 16.6 20 17.1V20.5M20 2H4C2.9 2 2 2.9 2 4V12C2 13.1 2.9 14 4 14H8V12H4V4H20V12H18V14H20C21.1 14 22 13.1 22 12V4C22 2.9 21.1 2 20 2Z" />
    </svg>`,
    content: '<a class="button">Button</a>',
  });

  editor.BlockManager.add('divider', {
    label: 'Divider',
    media: `<svg viewBox="0 0 24 24">
        <path fill="currentColor" d="M21 18H2V20H21V18M19 10V14H4V10H19M20 8H3C2.45 8 2 8.45 2 9V15C2 15.55 2.45 16 3 16H20C20.55 16 21 15.55 21 15V9C21 8.45 20.55 8 20 8M21 4H2V6H21V4Z" />
    </svg>`,
    content: `
      <table style="width: 100%; margin-top: 10px; margin-bottom: 10px;">
        <tr>
          <td class="divider"></td>
        </tr>
      </table>
      <style>
        .divider {
          background-color: rgba(0, 0, 0, 0.1);
          height: 1px;
        }
      </style>
    `,
  });

  editor.BlockManager.add('image', {
    label: 'Image',
    media: `<svg viewBox="0 0 24 24">
      <path fill="currentColor" d="M21,3H3C2,3 1,4 1,5V19A2,2 0 0,0 3,21H21C22,21 23,20 23,19V5C23,4 22,3 21,3M5,17L8.5,12.5L11,15.5L14.5,11L19,17H5Z" />
    </svg>`,
    activate: true,
    content: {
      type: 'image',
      style: { color: 'black' },
    },
  });

  editor.BlockManager.add('quote', {
    label: 'Quote',
    media: `<svg viewBox="0 0 24 24">
        <path fill="currentColor" d="M14,17H17L19,13V7H13V13H16M6,17H9L11,13V7H5V13H8L6,17Z" />
    </svg>`,
    content:
      '<blockquote class="quote">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore ipsum dolor sit</blockquote>',
  });

  editor.BlockManager.add('link', {
    label: 'Link',
    media: `<svg viewBox="0 0 24 24">
      <path fill="currentColor" d="M3.9,12C3.9,10.29 5.29,8.9 7,8.9H11V7H7A5,5 0 0,0 2,12A5,5 0 0,0 7,17H11V15.1H7C5.29,15.1 3.9,13.71 3.9,12M8,13H16V11H8V13M17,7H13V8.9H17C18.71,8.9 20.1,10.29 20.1,12C20.1,13.71 18.71,15.1 17,15.1H13V17H17A5,5 0 0,0 22,12A5,5 0 0,0 17,7Z"></path>
    </svg>`,
    content: {
      type: 'link',
      content: 'Link',
      style: { color: '#3b97e3' },
    },
  });

  editor.BlockManager.add('link-block', {
    label: 'Link Block',
    media: `<svg viewBox="0 0 24 24">
      <path fill="currentColor" d="M3.9,12C3.9,10.29 5.29,8.9 7,8.9H11V7H7A5,5 0 0,0 2,12A5,5 0 0,0 7,17H11V15.1H7C5.29,15.1 3.9,13.71 3.9,12M8,13H16V11H8V13M17,7H13V8.9H17C18.71,8.9 20.1,10.29 20.1,12C20.1,13.71 18.71,15.1 17,15.1H13V17H17A5,5 0 0,0 22,12A5,5 0 0,0 17,7Z"></path>
    </svg>`,
    content: {
      type: 'link',
      editable: false,
      droppable: true,
      style: {
        display: 'inline-block',
        padding: '5px',
        'min-height': '50px',
        'min-width': '50px',
      },
    },
  });

  editor.BlockManager.add('social-block', {
    label: 'Social',
    content: `
      <div style="text-align: center; padding: 30px 20px; background: #f8f9fa; font-family: Arial, sans-serif;">
        <h3 style="margin: 0 0 20px 0; color: #343a40; font-size: 20px;">Follow Us</h3>
        <div style="display: inline-block;">
          <a href="#" style="display: inline-block; margin: 0 10px; padding: 15px; background: #1877f2; color: white; text-decoration: none; border-radius: 50%; width: 50px; height: 50px; line-height: 20px; font-weight: bold;">f</a>
          <a href="#" style="display: inline-block; margin: 0 10px; padding: 15px; background: #1da1f2; color: white; text-decoration: none; border-radius: 50%; width: 50px; height: 50px; line-height: 20px; font-weight: bold;">t</a>
          <a href="#" style="display: inline-block; margin: 0 10px; padding: 15px; background: #0077b5; color: white; text-decoration: none; border-radius: 50%; width: 50px; height: 50px; line-height: 20px; font-weight: bold;">in</a>
          <a href="#" style="display: inline-block; margin: 0 10px; padding: 15px; background: #e1306c; color: white; text-decoration: none; border-radius: 50%; width: 50px; height: 50px; line-height: 20px; font-weight: bold;">ig</a>
        </div>
      </div>
    `,
    media: `<svg viewBox="0 0 24 24">
      <path fill="currentColor" d="M20,20H4A2,2 0 0,1 2,18V6A2,2 0 0,1 4,4H20A2,2 0 0,1 22,6V18A2,2 0 0,1 20,20M4,6V18H20V6H4M6,9H18V11H6V9M6,13H16V15H6V13Z" />
    </svg>`,
  });

  editor.BlockManager.add('footer-block', {
    label: 'Footer',
    content: `
      <div style="background: #2c3e50; color: white; padding: 40px 20px; text-align: center; font-family: Arial, sans-serif;">
        <div style="margin-bottom: 20px;">
          <h3 style="margin: 0 0 10px 0; color: white; font-size: 18px;">Stay Connected</h3>
          <p style="margin: 0; color: #bdc3c7; font-size: 14px;">Follow us on social media for updates</p>
        </div>
        <div style="border-top: 1px solid #34495e; padding-top: 20px; margin-top: 20px;">
          <p style="margin: 0 0 10px 0; color: #bdc3c7; font-size: 12px;">© 2024 Your Company. All rights reserved.</p>
          <p style="margin: 0; color: #95a5a6; font-size: 11px;">
            <a href="#" style="color: #95a5a6; text-decoration: none; margin: 0 10px;">Unsubscribe</a>
            <a href="#" style="color: #95a5a6; text-decoration: none; margin: 0 10px;">Privacy Policy</a>
          </p>
        </div>
      </div>
    `,
    media: `<svg viewBox="0 0 24 24">
      <path fill="currentColor" d="M20,20H4A2,2 0 0,1 2,18V6A2,2 0 0,1 4,4H20A2,2 0 0,1 22,6V18A2,2 0 0,1 20,20M4,6V18H20V6H4M6,9H18V11H6V9M6,13H16V15H6V13Z" />
    </svg>`,
  });
}
