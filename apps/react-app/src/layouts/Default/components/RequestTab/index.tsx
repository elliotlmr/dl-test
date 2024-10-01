import styles from './styles.module.scss';
import { FriendRequest } from '@repo/types/users';
import Add from '@/assets/vectors/check.svg';
import Close from '@/assets/vectors/close.svg';
import { useFriends } from '@/providers/FriendsProvider';
import { useAuth } from '@/providers/AuthProvider';

type Props = {
  request: FriendRequest;
  refresh: () => void;
  index: number;
};

const RequestTab = ({ request, refresh, index }: Props) => {
  const { acceptFriendRequest, refuseFriendRequest } = useFriends();
  const { user } = useAuth();

  const nameToDisplay =
    request.user_id === user?.id ? request.friendUsername : request.username;

  const handleAccept = async () => {
    await acceptFriendRequest(request.id).then(() => {
      refresh();
    });
  };

  const handleRefuse = async () => {
    await refuseFriendRequest(request.id).then(() => {
      refresh();
    });
  };

  return (
    <div
      className={styles.container}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {request.user_id !== user?.id && (
        <div className={styles.refuse} onClick={handleRefuse}>
          <Close />
        </div>
      )}
      <div className={styles.user}>
        <p className={styles.name}>{nameToDisplay}</p>
        {request.user_id === user?.id && (
          <p className={styles.status}>( waiting for anwser )</p>
        )}
      </div>
      {request.user_id !== user?.id && (
        <div className={styles.accept} onClick={handleAccept}>
          <Add />
        </div>
      )}
    </div>
  );
};

export default RequestTab;
