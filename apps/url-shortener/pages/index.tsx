import { useCallback, FormEvent, useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';

import styles from './index.module.scss';

export default function Index() {
  const [longUrl, setLongUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const router = useRouter();

  const handleChange = useCallback((e: any) => {
    setLongUrl(e.target.value);
  }, []);

  const handleSubmit = useCallback(async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (longUrl) {
      try {
        const checkResponse = await fetch('/api/check-url', {
          method: 'POST',
          body: JSON.stringify({ longUrl })
        });

        const checkResult = await checkResponse.json();

        if (checkResult?.shortUrl) {
          setShortUrl(checkResult.shortUrl);
        } else {
          const addResponse = await fetch('/api/add-url', {
            method: 'POST',
            body: JSON.stringify({ longUrl })
          });

          const addResult = await addResponse.json();

          if (addResult?.shortUrl) {
            setShortUrl(addResult.shortUrl);
          }
        }
      } catch (e: any) {
        console.log(e.message);
      }
    }
  }, [longUrl]);

  const formattedShortUrl = useMemo(() => {
    if (shortUrl) {
      return `${process.env.NEXT_PUBLIC_BASE_URL}/${shortUrl}`;
    }

    return '';
  }, [shortUrl])

  return (
    <main className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.heading}>Welcome to hURLy</h1>
        <form id="url-form" className={styles.form} onSubmit={handleSubmit}>
          <input name="url" value={longUrl} onChange={handleChange} placeholder="Enter a valid URL" />
          <button type="submit" form="url-form">hURL me!</button>
        </form>
        {formattedShortUrl ? (
          <div className={styles.linkContainer}>
          hURLy shortened to:&nbsp;
          <div className={styles.link}>
            <a href={formattedShortUrl} target="_blank">{formattedShortUrl}</a>
          </div>
          </div>
        ) : null}
      </div>
    </main>
  );
}