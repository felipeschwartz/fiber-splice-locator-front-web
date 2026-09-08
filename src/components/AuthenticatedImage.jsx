import { useEffect, useState } from 'react';
import { api } from '../api/client';

// <img src> não manda o header Authorization — por isso buscamos o
// binário via axios (que já injeta o Bearer token) e criamos um blob URL
// local só pra essa imagem.
export default function AuthenticatedImage({ src, alt, style, onClick }) {
  const [objectUrl, setObjectUrl] = useState(null);

  useEffect(() => {
    let cancelled = false;
    let createdUrl;

    api
      .get(src, { responseType: 'blob' })
      .then((response) => {
        if (cancelled) return;
        createdUrl = URL.createObjectURL(response.data);
        setObjectUrl(createdUrl);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
      if (createdUrl) URL.revokeObjectURL(createdUrl);
    };
  }, [src]);

  if (!objectUrl) {
    return <div style={{ ...style, background: 'var(--color-border-soft)' }} />;
  }

  return <img src={objectUrl} alt={alt} style={style} onClick={onClick} />;
}
