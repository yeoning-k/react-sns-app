import PostForm from 'components/posts/PostForm';

export default function PostWritePage() {
  return (
    <>
      <div className="page-header">
        <h2 className="page-header__title">글쓰기</h2>
      </div>
      <PostForm />
    </>
  );
}
