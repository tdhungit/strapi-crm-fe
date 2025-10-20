import { useEffect, useState } from 'react';

export default function DashboardViews({
  dashboard: initDashboard,
}: {
  dashboard: any;
}) {
  const [dashboard, setDashboard] = useState(initDashboard);

  useEffect(() => {
    setDashboard(initDashboard);
  }, [initDashboard]);

  return <div>{dashboard.name}</div>;
}
