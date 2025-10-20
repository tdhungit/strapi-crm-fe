const collectionModules = import.meta.glob('./components/*.tsx', {
  eager: true,
});

const rawModules = import.meta.glob('../../*/widgets/components/*.tsx', {
  eager: true,
});

const widgets: Record<string, Record<string, React.FC>> = {};
const defaults: Record<string, React.FC> = {};

for (const path in collectionModules) {
  const match = path.match(/components\/([^/]+)\.tsx$/);
  if (match) {
    const fileName = match[1];
    const mod = collectionModules[path] as any;
    defaults[fileName] = mod.default;
  }
}

for (const path in rawModules) {
  const match = path.match(/([^/]+)\/widgets\/components\/([^/]+)\.tsx$/);
  if (match) {
    const moduleName = match[1];
    if (moduleName === 'collection') continue;

    const fileName = match[2];
    const mod = rawModules[path] as any;

    if (!widgets[moduleName]) widgets[moduleName] = {};
    widgets[moduleName][fileName] = mod.default;
  }
}

export const defaultWidgets = defaults;
export const moduleWidgets = widgets;

export function getWidget(
  moduleName: string,
  widgetName: string
): React.FC<any> {
  return widgets[moduleName]?.[widgetName] || defaults[widgetName] || <></>;
}

export function getWidgets(moduleName: string): Record<string, React.FC> {
  const moduleWidgets = widgets[moduleName] || {};
  // Add default widgets
  for (const widgetName in defaults) {
    if (!moduleWidgets[widgetName])
      moduleWidgets[widgetName] = defaults[widgetName];
  }
  return moduleWidgets;
}

export function getAllWidgets(): Record<string, Record<string, React.FC>> {
  const result: Record<string, Record<string, React.FC>> = {};

  for (const moduleName in widgets) {
    result[moduleName] = getWidgets(moduleName);
  }

  return result;
}
