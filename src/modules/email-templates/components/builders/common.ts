import type { Editor } from 'grapesjs';
import juice from 'juice';

export const MAIN_BG_COLOR = 'bg-white';

export const MAIN_TXT_COLOR = 'text-black';

export const BTN_CLS = 'border rounded px-2 py-1 w-full';

export const MAIN_BORDER_COLOR = 'border-gray-200';

export const ROUND_BORDER_COLOR = `rounded border ${MAIN_BORDER_COLOR}`;

export function cx(...inputs: any[]): string {
  const inp = Array.isArray(inputs[0]) ? inputs[0] : [...inputs];
  return inp.filter(Boolean).join(' ');
}

export function getEditorHtml(editor: Editor) {
  const html = editor.getHtml();
  const css = editor.getCss();
  const fullHtml = `
    <html>
      <head>
        <style>${css}</style>
      </head>
      <body>
        ${html}
      </body>
    </html>
  `;
  const inlineHtml = juice(fullHtml);
  return inlineHtml;
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
    media: `
      <svg viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M21 7.59999L11 7.59999V6.39999L21 6.39999V7.59999Z" fill="#1f4d7a"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M21 11.2667L12.4833 11.2667V10.0667L21 10.0667V11.2667Z" fill="#1f4d7a"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M21 14.9334H13.9254V13.7334L21 13.7334V14.9334Z" fill="#1f4d7a"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M21 18.6002H4V17.4002H21V18.6002Z" fill="#1f4d7a"></path> <path d="M9.86438 15.6H11.2L8.27623 7.59999H6.92377L4 15.6H5.29072L6.0371 13.4766H9.12362L9.86438 15.6ZM7.53546 9.05252H7.63086L8.80374 12.4344H6.35698L7.53546 9.05252Z" fill="#1f4d7a"></path> </g></svg>
    `,
  });

  editor.BlockManager.add('text', {
    label: 'Text',
    media: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M11.25 17C11.25 17.4142 11.5858 17.75 12 17.75C12.4142 17.75 12.75 17.4142 12.75 17H11.25ZM15.25 9.75C15.25 10.1642 15.5858 10.5 16 10.5C16.4142 10.5 16.75 10.1642 16.75 9.75H15.25ZM7.25 9.75C7.25 10.1642 7.58579 10.5 8 10.5C8.41421 10.5 8.75 10.1642 8.75 9.75H7.25ZM15.7071 7.32544L16.2646 6.82371V6.82371L15.7071 7.32544ZM9.5 16.25C9.08579 16.25 8.75 16.5858 8.75 17C8.75 17.4142 9.08579 17.75 9.5 17.75V16.25ZM15 17.75C15.4142 17.75 15.75 17.4142 15.75 17C15.75 16.5858 15.4142 16.25 15 16.25V17.75ZM10 7.75H12V6.25H10V7.75ZM12 7.75H14V6.25H12V7.75ZM12.75 17V7H11.25V17H12.75ZM15.25 9.22222V9.75H16.75V9.22222H15.25ZM7.25 9.22222V9.75H8.75V9.22222H7.25ZM14 7.75C14.4949 7.75 14.7824 7.75196 14.9865 7.78245C15.0783 7.79617 15.121 7.8118 15.1376 7.8194C15.148 7.82415 15.1477 7.82503 15.1496 7.82716L16.2646 6.82371C15.96 6.4853 15.579 6.35432 15.2081 6.29891C14.8676 6.24804 14.4479 6.25 14 6.25V7.75ZM16.75 9.22222C16.75 8.71757 16.7513 8.27109 16.708 7.91294C16.6629 7.54061 16.559 7.15082 16.2646 6.82371L15.1496 7.82716C15.1523 7.83015 15.1609 7.83939 15.1731 7.87221C15.1873 7.91048 15.2048 7.97725 15.2188 8.09313C15.2487 8.34011 15.25 8.67931 15.25 9.22222H16.75ZM10 6.25C9.55208 6.25 9.13244 6.24804 8.79192 6.29891C8.42102 6.35432 8.04 6.4853 7.73542 6.82371L8.85036 7.82716C8.85228 7.82503 8.85204 7.82415 8.86242 7.8194C8.87904 7.8118 8.92168 7.79617 9.01354 7.78245C9.21765 7.75196 9.50511 7.75 10 7.75V6.25ZM8.75 9.22222C8.75 8.67931 8.75129 8.34011 8.78118 8.09313C8.7952 7.97725 8.81273 7.91048 8.8269 7.87221C8.83905 7.83939 8.84767 7.83015 8.85036 7.82716L7.73542 6.82371C7.44103 7.15082 7.3371 7.54061 7.29204 7.91294C7.24871 8.27109 7.25 8.71757 7.25 9.22222H8.75ZM9.5 17.75H15V16.25H9.5V17.75Z" fill="#272f49"></path> <path d="M22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C21.5093 4.43821 21.8356 5.80655 21.9449 8" stroke="#272f49" stroke-width="1.5" stroke-linecap="round"></path> </g></svg>`,
    activate: true,
    content: {
      type: 'text',
      content: 'Insert your text here',
      style: { padding: '10px' },
    },
  });

  editor.BlockManager.add('text-sect', {
    label: 'Text Section',
    media: `<svg viewBox="0 -5.5 21 21" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>header [#1539]</title> <desc>Created with Sketch.</desc> <defs> </defs> <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="Dribbble-Light-Preview" transform="translate(-99.000000, -165.000000)" fill="#544f4f"> <g id="icons" transform="translate(56.000000, 160.000000)"> <path d="M46.15,5 C47.88985,5 49.3,6.343 49.3,8 C49.3,9.657 47.88985,11 46.15,11 C44.41015,11 43,9.657 43,8 C43,6.343 44.41015,5 46.15,5 L46.15,5 Z M46.15,7 C45.57145,7 45.1,7.449 45.1,8 C45.1,8.551 45.57145,9 46.15,9 C46.72855,9 47.2,8.551 47.2,8 C47.2,7.449 46.72855,7 46.15,7 L46.15,7 Z M43,15 L64,15 L64,13 L43,13 L43,15 Z M51.4,7 L64,7 L64,5 L51.4,5 L51.4,7 Z M51.4,11 L64,11 L64,9 L51.4,9 L51.4,11 Z" id="header-[#1539]"> </path> </g> </g> </g> </g></svg>`,
    content: `
      <h1 class="heading">Insert title here</h1>
      <p class="paragraph">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
      </p>
    `,
  });

  editor.BlockManager.add('button', {
    label: 'Button',
    media: `<svg viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M5.5 10V8.5M5.5 8.5V3.5C5.5 2.94772 5.94772 2.5 6.5 2.5C7.05228 2.5 7.5 2.94772 7.5 3.5V7.5H10.8529C11.7626 7.5 12.5 8.23741 12.5 9.14706V10C12.5 12.4853 10.4853 14.5 8 14.5H7.5C5.29086 14.5 3.5 12.7091 3.5 10.5C3.5 9.39543 4.39543 8.5 5.5 8.5ZM9 5.5H11C12.3807 5.5 13.5 4.38071 13.5 3C13.5 1.61929 12.3807 0.5 11 0.5H4C2.61929 0.5 1.5 1.61929 1.5 3C1.5 4.38071 2.61929 5.5 4 5.5" stroke="#474747"></path> </g></svg>`,
    content: {
      type: 'button',
    },
  });

  editor.BlockManager.add('button-block', {
    label: 'Button Block',
    media: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M20.5 17h-17A2.502 2.502 0 0 1 1 14.5v-4A2.502 2.502 0 0 1 3.5 8h17a2.502 2.502 0 0 1 2.5 2.5v4a2.502 2.502 0 0 1-2.5 2.5zm-17-8A1.502 1.502 0 0 0 2 10.5v4A1.502 1.502 0 0 0 3.5 16h17a1.502 1.502 0 0 0 1.5-1.5v-4A1.502 1.502 0 0 0 20.5 9zM17 12H7v1h10z"></path><path fill="none" d="M0 0h24v24H0z"></path></g></svg>`,
    content: {
      type: 'div',
      attributes: {
        style: 'text-align: center; padding: 20px;',
      },
      components: [
        {
          type: 'button',
        },
      ],
    },
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

  // editor.BlockManager.add('image', {
  //   label: 'Image',
  //   media: `<svg viewBox="0 0 24 24">
  //     <path fill="currentColor" d="M21,3H3C2,3 1,4 1,5V19A2,2 0 0,0 3,21H21C22,21 23,20 23,19V5C23,4 22,3 21,3M5,17L8.5,12.5L11,15.5L14.5,11L19,17H5Z" />
  //   </svg>`,
  //   activate: true,
  //   content: {
  //     type: 'image',
  //     style: { color: 'black' },
  //   },
  // });

  editor.BlockManager.add('image-simple-block', {
    label: 'Image',
    content:
      '<img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgdmlld0JveD0iMCAwIDQwMCAyNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjUwIiBmaWxsPSIjRjVGNUY1Ii8+CjxyZWN0IHg9IjE3NSIgeT0iMTAwIiB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIGZpbGw9IiNEOUQ5RDkiLz4KPHN2ZyB4PSIxODUiIHk9IjExMCIgd2lkdGg9IjMwIiBoZWlnaHQ9IjMwIiBmaWxsPSIjOTk5OTk5Ij4KPHA+SW1hZ2U8L3A+Cjwvc3ZnPgo8L3N2Zz4K" alt="placeholder" style="width: 100%; height: auto; display: block; border-radius: 8px;">',
    media: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <defs> <path id="image-a" d="M4,4 C2.8954305,4 2,3.1045695 2,2 C2,0.8954305 2.8954305,0 4,0 C5.1045695,0 6,0.8954305 6,2 C6,3.1045695 5.1045695,4 4,4 Z M0.497558594,15 L4.07592773,10.7578125 L6.02026367,12.2731934 L13.4494629,2.51928711 L16,5.45703125 L16,15 L0.497558594,15 Z"></path> <path id="image-c" d="M18,6.97348874 L18,2 L2,2 L2,15.5476712 L6.04883416,10.4166727 C6.41808601,9.94872797 7.11213264,9.90569713 7.53635945,10.3244463 L9.54496213,12.3071135 L14.8746293,5.31817463 C15.2514017,4.82410259 15.9827874,4.78961411 16.4043805,5.24603924 L18,6.97348874 Z M18,9.92107486 L15.7430352,7.47763974 L10.4462935,14.4234025 C10.0808144,14.9026653 9.37757149,14.9521101 8.9486259,14.5287032 L6.92665827,12.5328435 L2.61256422,18 L18,18 L18,9.92107486 Z M2,0 L18,0 C19.1045695,0 20,0.8954305 20,2 L20,18 C20,19.1045695 19.1045695,20 18,20 L2,20 C0.8954305,20 0,19.1045695 0,18 L0,2 C0,0.8954305 0.8954305,0 2,0 Z M7,9 C5.34314575,9 4,7.65685425 4,6 C4,4.34314575 5.34314575,3 7,3 C8.65685425,3 10,4.34314575 10,6 C10,7.65685425 8.65685425,9 7,9 Z M7,7 C7.55228475,7 8,6.55228475 8,6 C8,5.44771525 7.55228475,5 7,5 C6.44771525,5 6,5.44771525 6,6 C6,6.55228475 6.44771525,7 7,7 Z"></path> </defs> <g fill="none" fill-rule="evenodd" transform="translate(2 2)"> <g transform="translate(3 4)"> <mask id="image-b" fill="#ffffff"> <use xlink:href="#image-a"></use> </mask> <use fill="#D8D8D8" xlink:href="#image-a"></use> <g fill="#FFA0A0" mask="url(#image-b)"> <rect width="24" height="24" transform="translate(-5 -6)"></rect> </g> </g> <mask id="image-d" fill="#ffffff"> <use xlink:href="#image-c"></use> </mask> <use fill="#000000" fill-rule="nonzero" xlink:href="#image-c"></use> <g fill="#9386a2" mask="url(#image-d)"> <rect width="24" height="24" transform="translate(-2 -2)"></rect> </g> </g> </g></svg>`,
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
    media: `<svg fill="#000000" viewBox="0 0 64 64" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <rect id="Icons" x="-896" y="0" width="1280" height="800" style="fill:none;"></rect> <g id="Icons1" serif:id="Icons"> <g id="Strike"> </g> <g id="H1"> </g> <g id="H2"> </g> <g id="H3"> </g> <g id="list-ul"> </g> <g id="hamburger-1"> </g> <g id="hamburger-2"> </g> <g id="list-ol"> </g> <g id="list-task"> </g> <g id="trash"> </g> <g id="vertical-menu"> </g> <g id="horizontal-menu"> </g> <g id="sidebar-2"> </g> <g id="Pen"> </g> <g id="Pen1" serif:id="Pen"> </g> <g id="clock"> </g> <g id="external-link"> <path d="M36.026,20.058l-21.092,0c-1.65,0 -2.989,1.339 -2.989,2.989l0,25.964c0,1.65 1.339,2.989 2.989,2.989l26.024,0c1.65,0 2.989,-1.339 2.989,-2.989l0,-20.953l3.999,0l0,21.948c0,3.308 -2.686,5.994 -5.995,5.995l-28.01,0c-3.309,0 -5.995,-2.687 -5.995,-5.995l0,-27.954c0,-3.309 2.686,-5.995 5.995,-5.995l22.085,0l0,4.001Z"></path> <path d="M55.925,25.32l-4.005,0l0,-10.481l-27.894,27.893l-2.832,-2.832l27.895,-27.895l-10.484,0l0,-4.005l17.318,0l0.002,0.001l0,17.319Z"></path> </g> <g id="hr"> </g> <g id="info"> </g> <g id="warning"> </g> <g id="plus-circle"> </g> <g id="minus-circle"> </g> <g id="vue"> </g> <g id="cog"> </g> <g id="logo"> </g> <g id="radio-check"> </g> <g id="eye-slash"> </g> <g id="eye"> </g> <g id="toggle-off"> </g> <g id="shredder"> </g> <g id="spinner--loading--dots-" serif:id="spinner [loading, dots]"> </g> <g id="react"> </g> <g id="check-selected"> </g> <g id="turn-off"> </g> <g id="code-block"> </g> <g id="user"> </g> <g id="coffee-bean"> </g> <g id="coffee-beans"> <g id="coffee-bean1" serif:id="coffee-bean"> </g> </g> <g id="coffee-bean-filled"> </g> <g id="coffee-beans-filled"> <g id="coffee-bean2" serif:id="coffee-bean"> </g> </g> <g id="clipboard"> </g> <g id="clipboard-paste"> </g> <g id="clipboard-copy"> </g> <g id="Layer1"> </g> </g> </g></svg>`,
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

  const gridItem = `<table class="grid-item-card">
      <tr>
        <td class="grid-item-card-cell">
          <img class="grid-item-image" src="https://via.placeholder.com/250x150/78c5d6/fff/" alt="Image"/>
          <table class="grid-item-card-body">
            <tr>
              <td class="grid-item-card-content">
                <h1 class="card-title">Title here</h1>
                <p class="card-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>`;

  editor.BlockManager.add('grid-items', {
    label: 'Grid Items',
    media: `<svg viewBox="0 0 24 24">
      <path fill="currentColor" d="M3,11H11V3H3M3,21H11V13H3M13,21H21V13H13M13,3V11H21V3"/>
    </svg>`,
    content: `
      <table class="grid-item-row">
        <tr>
          <td class="grid-item-cell2-l">${gridItem}</td>
          <td class="grid-item-cell2-r">${gridItem}</td>
        </tr>
      </table>
    `,
  });

  const listItem = `<table class="list-item">
      <tr>
        <td class="list-item-cell">
          <table class="list-item-content">
            <tr class="list-item-row">
              <td class="list-cell-left">
                <img class="list-item-image" src="https://via.placeholder.com/150/78c5d6/fff" alt="Image"/>
              </td>
              <td class="list-cell-right">
                <h1 class="card-title">Title here</h1>
                <p class="card-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>`;

  editor.BlockManager.add('list-items', {
    label: 'List Items',
    media: `<svg viewBox="0 0 24 24">
      <path fill="currentColor" d="M2 14H8V20H2M16 8H10V10H16M2 10H8V4H2M10 4V6H22V4M10 20H16V18H10M10 16H22V14H10"/>
    </svg>`,
    content: listItem + listItem,
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
    media: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M14 5C13.4477 5 13 5.44772 13 6C13 6.27642 13.1108 6.52505 13.2929 6.70711C13.475 6.88917 13.7236 7 14 7C14.5523 7 15 6.55228 15 6C15 5.44772 14.5523 5 14 5ZM11 6C11 4.34315 12.3431 3 14 3C15.6569 3 17 4.34315 17 6C17 7.65685 15.6569 9 14 9C13.5372 9 13.0984 8.8948 12.7068 8.70744L10.7074 10.7068C10.8948 11.0984 11 11.5372 11 12C11 12.4628 10.8948 12.9016 10.7074 13.2932L12.7068 15.2926C13.0984 15.1052 13.5372 15 14 15C15.6569 15 17 16.3431 17 18C17 19.6569 15.6569 21 14 21C12.3431 21 11 19.6569 11 18C11 17.5372 11.1052 17.0984 11.2926 16.7068L9.29323 14.7074C8.90157 14.8948 8.46277 15 8 15C6.34315 15 5 13.6569 5 12C5 10.3431 6.34315 9 8 9C8.46277 9 8.90157 9.1052 9.29323 9.29256L11.2926 7.29323C11.1052 6.90157 11 6.46277 11 6ZM8 11C7.44772 11 7 11.4477 7 12C7 12.5523 7.44772 13 8 13C8.27642 13 8.52505 12.8892 8.70711 12.7071C8.88917 12.525 9 12.2764 9 12C9 11.7236 8.88917 11.475 8.70711 11.2929C8.52505 11.1108 8.27642 11 8 11ZM14 17C13.7236 17 13.475 17.1108 13.2929 17.2929C13.1108 17.475 13 17.7236 13 18C13 18.5523 13.4477 19 14 19C14.5523 19 15 18.5523 15 18C15 17.4477 14.5523 17 14 17Z" fill="#9c9edd"></path> </g></svg>`,
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
    media: `<svg fill="#000000" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 470.586 470.586" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M327.081,0H90.234c-15.9,0-28.853,12.959-28.853,28.859v412.863c0,15.924,12.953,28.863,28.853,28.863H380.35 c15.917,0,28.855-12.939,28.855-28.863V89.234L327.081,0z M333.891,43.184l35.996,39.121h-35.996V43.184z M384.972,441.723 c0,2.542-2.081,4.629-4.635,4.629H90.234c-2.547,0-4.619-2.087-4.619-4.629V28.859c0-2.548,2.072-4.613,4.619-4.613h219.411v70.181 c0,6.682,5.443,12.099,12.129,12.099h63.198V441.723z M111.593,359.871h236.052v48.421H111.593V359.871z"></path> </g> </g></svg>`,
  });
}

export function addEditorTraits(editor: Editor) {
  // image
  editor.Components.addType('image', {
    model: {
      defaults: {
        traits: [
          'alt',
          {
            type: 'image',
            name: 'src',
            label: 'Image',
          },
          {
            type: 'button',
            name: 'openMediaManager',
            command: 'open-media-manager',
            label: 'Open Media Manager',
          },
        ],
      },
    },
  });

  // button
  editor.Components.addType('button', {
    model: {
      defaults: {
        tagName: 'a',
        attributes: {
          type: 'button',
        },

        style: {
          padding: '12px 24px',
          background: '#007bff',
          color: 'white',
          'text-decoration': 'none',
          'border-radius': '6px',
          'font-family': 'Arial, sans-serif',
          'font-weight': 'bold',
        },

        content: 'Click Me',
        traits: [
          {
            type: 'link',
            label: 'Link',
            name: 'href',
          },
          {
            type: 'color',
            label: 'Background Color',
            name: 'background',
            changeProp: true,
          },
          {
            type: 'number',
            label: 'Radius',
            name: 'border-radius',
            changeProp: true,
          },
        ],
      },
      init() {
        this.on('change:background', this.handleBackground);
        this.on('change:border-radius', this.handleRadius);
      },
      handleBackground() {
        this.addStyle({ background: this.get('background') });
      },
      handleRadius() {
        this.addStyle({ 'border-radius': this.get('border-radius') + 'px' });
      },
    },
  });
}
