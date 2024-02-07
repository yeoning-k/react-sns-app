export default function PostWritePage() {
  return (
    <>
      <div className="page-header">
        <h2 className="page-header__title">글쓰기</h2>
      </div>
      <div className="form">
        <textarea
          placeholder="내용을 입력해주세요."
          required
          className="form__textarea"
        />
      </div>
    </>
  );
}
