import CollectionListComponent from '../collections/components/CollectionListComponent';

export default function InventoryList() {
  return (
    <CollectionListComponent module='inventories' toolBarRender={[]} noEdit />
  );
}
