import { useCallback, FormEvent, useState, useMemo } from 'react';

import styles from './index.module.scss';

const urlPattern = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;

export default function Index() {
  const [longUrl, setLongUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [error, setError] = useState('');

  const isUrlValid = useMemo(() => {
    return urlPattern.test(longUrl);
  }, [longUrl]);

  const handleChange = useCallback((e: any) => {
    setLongUrl(e.target.value);
  }, []);

  const handleSubmit = useCallback(async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isUrlValid) {
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
        setError(e.message);
      }
    }
  }, [longUrl, isUrlValid]);

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
          <button type="submit" form="url-form" disabled={!isUrlValid}>hURL me!</button>
        </form>
        {error ? (
          <p className={styles.error}>{error}</p>
        ) : null}
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