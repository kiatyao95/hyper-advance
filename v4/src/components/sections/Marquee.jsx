import InfiniteMovingCards from '../21st/InfiniteMovingCards';
import { useCatalog } from '../../context/CatalogContext';
import { publicPath } from '../../utils/publicPath';

export default function Marquee() {
  const { data } = useCatalog();
  const clients = data?.clientReferences || [];

  const items = clients.map((client) => ({
    quote: client.name,
    name: 'Client',
    title: '',
    logo: client.logo ? publicPath(client.logo) : null,
  }));

  if (!items.length) return null;

  return (
    <div className="client-marquee-wrap">
      <p className="client-marquee-label">Clients we have worked with</p>
      <InfiniteMovingCards items={items} speed="normal" direction="left" />
    </div>
  );
}
