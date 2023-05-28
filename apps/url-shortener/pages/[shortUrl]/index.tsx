import { useEffect } from "react";
import { useRouter } from "next/router";

const CheckUrl = () => {
  const { query } = useRouter();

  useEffect(() => {
    (async () => {
      const response = await fetch('/api/check-url', {
        method: 'POST',
        body: JSON.stringify({ shortUrl: query.shortUrl })
      });

      const result = await response.json();

      if (result.longUrl) {
        await fetch('/api/update-url', {
          method: 'POST',
          body: JSON.stringify({ id: result.id })
        });

        window.location.replace(result.longUrl);
      }
    })();
  }, [query]);

  return (
    <></>
  );
}

export default CheckUrl;