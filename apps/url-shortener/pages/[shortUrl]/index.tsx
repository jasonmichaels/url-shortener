import { useEffect } from "react";
import { useRouter } from "next/router";

/**
 * @description A component solely responsible for reading
 * query?.shortUrl to determine where to forward the user.
 * 
 * @TODOs
 *  - handle cases where an invalid `shortUrl` is given, if at all
 *  - change from IIFE in `useEffect` to something a bit cleaner
 *  - style the page, since it does load however briefly, based
 *    on the user's preferred contrast settings to minimize flashes
 */
const CheckUrl = () => {
  const { query } = useRouter();

  useEffect(() => {
    (async () => {
      const response = await fetch('/api/check-url', {
        method: 'POST',
        body: JSON.stringify({ shortUrl: query.shortUrl })
      });

      const result = await response.json();

      if ('string' === typeof result?.longUrl) {
        /**
         * @NOTE Prelim analytics using document.requests to
         * track how often a URL is used
         */
        await fetch('/api/update-url', {
          method: 'POST',
          body: JSON.stringify({ id: result.id })
        });

        window.location.replace(result.longUrl);
      } else {
        window.location.replace(`${process.env.NEXT_PUBLIC_BASE_URL}/`)
      }
    })();
  }, [query]);

  return (
    <></>
  );
}

export default CheckUrl;