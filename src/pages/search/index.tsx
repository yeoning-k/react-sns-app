import { FiSearch } from 'react-icons/fi';

export default function SearchPage() {
  return (
    <>
      <div className="page-header">
        <h2 className="page-header__title">검색</h2>
      </div>
      <div className="contents">
        <div className="search">
          <FiSearch />
          <input type="text" placeholder="해시태그를 검색하세요." />
        </div>
      </div>
      <div className="no-items">검색 결과가 없습니다 🥲</div>
    </>
  );
}
