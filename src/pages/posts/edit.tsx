import PostForm from 'components/posts/PostForm';

export default function PostEditPage() {
  return (
    <>
      <div className="page-header">
        <h2 className="page-header__title">게시글 수정</h2>
      </div>
      <PostForm />
    </>
  );
}
