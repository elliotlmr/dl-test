'use client';

import TextInput from '@/components/TextInput';
import styles from './page.module.scss';
import { useEffect, useState } from 'react';
import api from '@/utils/api';
import FriendButton from './components/FriendButton';
import { useFriends } from '@/utils/FriendsProvider';

const Add = () => {
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<{ id: string; username: string }[]>(
    []
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { getPendingRequests } = useFriends();

  const handleSearch = async () => {
    api
      .get(`/api/friends/search?q=${encodeURIComponent(query)}`)
      .then((res) => {
        console.log(res);
        setResults(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  let timeoutID: NodeJS.Timeout;

  useEffect(() => {
    clearTimeout(timeoutID);
    if (query.length > 0) {
      setIsLoading(true);
      timeoutID = setTimeout(() => {
        handleSearch();
      }, 750);
    }

    return () => {
      clearTimeout(timeoutID);
    };
  }, [query]);

  return (
    <div className={styles.container}>
      <TextInput
        title='Search a doge ..'
        type='text'
        errorMessage={null}
        content={query}
        handleChange={(e) => setQuery(e.target.value)}
        fullwidth
      />
      <div className={styles.list}>
        {isLoading ? (
          <div className={styles.loader} />
        ) : results.length === 0 ? (
          <p>You can search friends by typing in the input above :)</p>
        ) : (
          results.map((user, i) => {
            return (
              <FriendButton
                key={i}
                user={user}
                index={i}
                refresh={() => {
                  handleSearch();
                  getPendingRequests();
                }}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

export default Add;
