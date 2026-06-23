import InfiniteMovingCards from '../21st/InfiniteMovingCards';
import { useCatalog } from '../../context/CatalogContext';

export default function Marquee() {
  const { data, getDistributor } = useCatalog();
  const brandIds = data?.authorizedBrandIds || [];

  const items = brandIds.map((id) => {
    const brand = getDistributor(id);
    const sys = data?.systems.find((s) => s.distributorId === id);
    return {
      quote: brand?.name || id,
      name: 'Authorised Brand',
      title: sys?.shortName || '',
    };
  });

  if (!items.length) return null;

  return <InfiniteMovingCards items={items} speed="normal" direction="left" />;
}
