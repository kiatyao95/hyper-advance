import { Link } from 'react-router-dom';
import { useCatalog } from '../../context/CatalogContext';
import { publicPath } from '../../utils/publicPath';

export default function ClientLogos({ compact = false }) {
  const { data } = useCatalog();
  const clients = data?.clientReferences || [];

  if (!clients.length) return null;

  return (
    <div className={`client-logos${compact ? ' client-logos--compact' : ''}`}>
      {!compact && <p className="client-logos-label">Trusted by leading organisations</p>}
      <div className="client-logos-row">
        {clients.map((client) => {
          const slug = client.projectSlugs?.[0];
          const inner = client.logo ? (
            <img src={publicPath(client.logo)} alt={client.name} loading="lazy" />
          ) : (
            <span className="client-logos-text">{client.name}</span>
          );

          return slug ? (
            <Link key={client.name} to={`/project/${slug}`} className="client-logos-item" title={client.name}>
              {inner}
            </Link>
          ) : (
            <span key={client.name} className="client-logos-item client-logos-item--static" title={client.name}>
              {inner}
            </span>
          );
        })}
      </div>
    </div>
  );
}
