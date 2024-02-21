import AuthContext from 'context/AuthContext';
import {
  arrayRemove,
  arrayUnion,
  deleteDoc,
  doc,
  onSnapshot,
  setDoc,
  updateDoc
} from 'firebase/firestore';
import { deleteObject, ref } from 'firebase/storage';
import { db, storage } from 'firebaseApp';
import { PostProps } from 'pages';
import { useCallback, useContext, useEffect, useState } from 'react';
import {
  FiUser,
  FiThumbsUp,
  FiMessageSquare,
  FiEdit,
  FiDelete
} from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

interface UserProps {
  id: string;
}

const PostCard = ({ post }: { post: PostProps }) => {
  const { user } = useContext(AuthContext);
  const [postFollowers, setPostFollowers] = useState<any>([]);
  const navigate = useNavigate();

  const handleDelete = async () => {
    const confirm = window.confirm('해당 게시글을 삭제 하시겠습니까?');

    if (confirm) {
      if (post?.imageUrl) {
        const imageRef = ref(storage, post?.imageUrl);
        deleteObject(imageRef).catch(error => console.log(error));
      }

      await deleteDoc(doc(db, 'posts', post.id));
      navigate('/');
      toast.success('게시글을 삭제했습니다.');
    }
  };

  const date = new Date(
    post.createdAt.seconds * 1000 + post.createdAt.nanoseconds / 1000000
  );

  const toggleLike = async () => {
    const postRef = doc(db, 'posts', post.id);

    if (user?.uid && post?.likes?.includes(user?.uid)) {
      //좋아요 취소
      await updateDoc(postRef, {
        likes: arrayRemove(user?.uid),
        likeCount:
          post?.likeCount && post?.likeCount >= 0 ? post?.likeCount - 1 : 0
      });
    } else {
      //좋아요 추가
      await updateDoc(postRef, {
        likes: arrayUnion(user?.uid),
        likeCount: post?.likeCount ? post?.likeCount + 1 : 1
      });
    }
  };

  const onClickFollow = async (e: any) => {
    e.preventDefault();
    try {
      if (user?.uid) {
        const followingRef = doc(db, 'following', user?.uid);
        await setDoc(
          followingRef,
          { users: arrayUnion({ id: post?.uid }) },
          { merge: true }
        );

        const followerRef = doc(db, 'follower', post?.uid);
        await setDoc(
          followerRef,
          { users: arrayUnion({ id: user?.uid }) },
          { merge: true }
        );

        toast.success('팔로우 했습니다!');
      }
    } catch (e) {
      console.log(e);
    }
  };

  const onClickDeleteFollow = async (e: any) => {
    e.preventDefault();
    try {
      if (user?.uid) {
        const followingRef = doc(db, 'following', user?.uid);
        await updateDoc(followingRef, {
          users: arrayRemove({ id: post?.uid })
        });

        const followerRef = doc(db, 'follower', post?.uid);
        await updateDoc(followerRef, { users: arrayRemove({ id: user?.uid }) });

        toast.success('팔로우를 취소했니다!');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getFollowers = useCallback(async () => {
    if (post?.uid) {
      const ref = doc(db, 'follower', post.uid);
      onSnapshot(ref, doc => {
        setPostFollowers([]);
        doc
          ?.data()
          ?.users?.map((user: UserProps) =>
            setPostFollowers((prev: UserProps[]) =>
              prev ? [...prev, user?.id] : []
            )
          );
      });
    }
  }, []);

  useEffect(() => {
    if (post?.uid) getFollowers();
  }, [getFollowers, post?.uid]);

  return (
    <div className="card" key={post?.id}>
      <div className="card__header">
        <div className="card__profile">
          <div className="card__icon">
            {user?.photoURL && user?.uid === post?.uid ? (
              <img src={user.photoURL} alt="profile" />
            ) : (
              <FiUser />
            )}
          </div>
          <div className="card__box">
            <div className="card__user">{post?.email}</div>
            <div className="card__date">{date.toLocaleString('ko')}</div>
          </div>
        </div>
        {user?.uid !== post?.uid &&
          (postFollowers.includes(user?.uid) ? (
            <button className="card__following" onClick={onClickDeleteFollow}>
              팔로잉
            </button>
          ) : (
            <button
              className="card__following card__follower"
              onClick={onClickFollow}
            >
              팔로워
            </button>
          ))}
      </div>
      <div className="card__body">
        <Link to={`/posts/${post?.id}`}>
          <div className="card__content">{post?.content}</div>
          {post?.imageUrl && (
            <div className="card__image">
              <img src={post?.imageUrl} alt="" width="auto" height="100" />
            </div>
          )}
          {post?.hashTags && post.hashTags.length > 0 && (
            <div className="card__hashtags">
              {post.hashTags.map((tag, idx) => (
                <span key={idx}>#{tag}</span>
              ))}
            </div>
          )}
        </Link>
      </div>
      <div className="card__footer">
        <div className="card__comments">
          <FiMessageSquare />
          {post?.comments ? post?.comments.length : 0}
        </div>
        <div className="card__like" onClick={toggleLike}>
          <FiThumbsUp
            fill={user && post?.likes?.includes(user.uid) ? '#ffe26f' : '#fff'}
          />
          {post?.likeCount || 0}
        </div>
        {user?.uid === post?.uid && (
          <>
            <div
              className="card__edit"
              onClick={() => navigate(`/posts/edit/${post?.id}`)}
            >
              <FiEdit />
              수정하기
            </div>
            <div className="card__delete" onClick={handleDelete}>
              <FiDelete />
              삭제하기
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PostCard;
