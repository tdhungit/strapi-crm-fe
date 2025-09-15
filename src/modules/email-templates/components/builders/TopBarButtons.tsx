import { useEditor } from '@grapesjs/react';
import * as React from 'react';

import Icon, {
  ExpandOutlined,
  EyeInvisibleOutlined,
  RedoOutlined,
  UndoOutlined,
} from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { BTN_CLS, MAIN_BORDER_COLOR, cx } from './common';

interface CommandButton {
  id: string;
  iconPath: any;
  options?: Record<string, any>;
  disabled?: () => boolean;
}

export default function TopBarButtons({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const editor = useEditor();
  const [, setUpdateCounter] = useState(0);
  const { UndoManager, Commands } = editor;
  const cmdButtons: CommandButton[] = [
    {
      id: 'core:undo',
      iconPath: UndoOutlined,
      disabled: () => !UndoManager.hasUndo(),
    },
    {
      id: 'core:redo',
      iconPath: RedoOutlined,
      disabled: () => !UndoManager.hasRedo(),
    },
    {
      id: 'core:component-outline',
      iconPath: EyeInvisibleOutlined,
    },
    {
      id: 'core:fullscreen',
      iconPath: ExpandOutlined,
      options: { target: '#root' },
    },
    // {
    //   id: 'core:open-code',
    //   iconPath: CodeOutlined,
    // },
  ];

  useEffect(() => {
    const cmdEvent = 'run stop';
    const updateEvent = 'update';
    const updateCounter = () => setUpdateCounter((value) => value + 1);
    const onCommand = (id: string) => {
      return cmdButtons.find((btn) => btn.id === id) && updateCounter();
    };
    editor.on(cmdEvent, onCommand);
    editor.on(updateEvent, updateCounter);

    return () => {
      editor.off(cmdEvent, onCommand);
      editor.off(updateEvent, updateCounter);
    };
  }, []);

  return (
    <div className={cx('flex gap-3', className)}>
      {cmdButtons.map(({ id, iconPath, disabled, options = {} }) => (
        <button
          key={id}
          type='button'
          className={cx(
            BTN_CLS,
            MAIN_BORDER_COLOR,
            Commands.isActive(id) && 'text-sky-300',
            disabled?.() && 'opacity-50'
          )}
          onClick={() =>
            Commands.isActive(id)
              ? Commands.stop(id)
              : Commands.run(id, options)
          }
          disabled={disabled?.()}
        >
          <Icon component={iconPath} size={1} />
        </button>
      ))}
    </div>
  );
}
