import { useEffect, useState } from 'react';
import AddDashboardItemModal from './AddDashboardItemModal';

export default function DashboardViews({
  dashboard: initDashboard,
  openAddItem,
  setOpenAddItem,
}: {
  dashboard: any;
  openAddItem: boolean;
  setOpenAddItem: (open: boolean) => void;
}) {
  const [dashboard, setDashboard] = useState(initDashboard);

  useEffect(() => {
    setDashboard(initDashboard);
  }, [initDashboard]);

  return (
    <>
      <div className='w-full'>
        <h3>{dashboard?.name}</h3>
      </div>

      <AddDashboardItemModal open={openAddItem} openChange={setOpenAddItem} />
    </>
  );
}
