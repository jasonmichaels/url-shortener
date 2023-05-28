import { useCallback, FormEvent, useState, useMemo } from 'react';

import styles from './index.module.scss';
import ValidationUtil from '@url-shortener/utils/ValidationUtil';

/**
 * @description Page responsible for showing the initial form
 * and displaying the stored `shortUrl` corresponding to the
 * given longer (?) URL. 
 */
export default function Index() {
  const [longUrl, setLongUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [error, setError] = useState('');

  /**
   * @description Helps control interactivity of submit button,
   * as well as whether a keyboard on submit continues.
   * 
   * @TODOs
   *  - limit submissions while in the process of submitting
   *  - extract verbose submission handler logic elsewhere (new util?)
   *  - cleanup styling!
   */
  const isUrlValid = useMemo(() => {
    return ValidationUtil.validateUrl(longUrl);
  }, [longUrl]);

  /**
   * @description Submission callback -- queries `/api` routes to
   * first check if a given URL already exists in the database and,
   * if not, stores it in a new document.
   */
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

  /**
   * @description Since `shortUrl` only changes once its set in state,
   * this memoization shouldn't fire but once or twice. Given to the
   * user once the submission has processed.
   */
  const formattedShortUrl = useMemo(() => {
    if (shortUrl) {
      return `${process.env.NEXT_PUBLIC_BASE_URL}/${shortUrl}`;
    }

    return '';
  }, [shortUrl]);

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