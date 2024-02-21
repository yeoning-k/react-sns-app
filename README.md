# sns app
...현재 작업중 입니다.
구현 완료된 부분은 아래 **주요 기능 및 작업 내용** 에서 체크된 내역으로 확인 할 수 있습니다.

<br/><br/>

## 프로젝트 소개
트위터 앱을 모방하여 만드는 sns 앱 프로젝트로 react로 작업하였으며, 
Firebase를 이용하여 실시간으로 데이터를 처리하고 vercel cli로 배포 예정입니다. 
해당프로젝트는 패스트캠퍼스 강의를 보고 진행하였습니다.
(코드는 전부 그대로 따라한게 아닌 firebase 관련 부분만 강의를 참고하여 진행)

<br/><br/>

## 기술 스택
- react
- react-router-dom
- firebase auth
- firebase firestore와 onSnapshot을 이용한 실시간 게시판 CRUD
- scss
- recoil
- vercel cli

<br/><br/>

## 구현 페이지
- 로그인
- 회원가입
- 프로필
- 홈(피드)
- 검색
- 알림
- 게시글 CRUD

<br/><br/>

## 주요 기능 및 작업 내용
- Firebase Auth를 이용한 기능
    - [x] 기본 로그인/회원가입
    - [x] SNS 로그인/회원가입
    - [x] 로그아웃
- Firebase firestore와 onSnapshot 이용한 기능
    - [x] 게시판 실시간 데이터 가져오기
    - [x] 게시글 수정
    - [x] 게시글 삭제
    - [x] 게시글 등록
    - [x] 해시태그 등록 및 검색 
    - [x] 이미지 업로드 및 삭제
    - [x] 유저 프로필 이미지 업로드 및 삭제 
    - [x] 게시글 좋아요
    - [x] 게시글 댓글
    - [x] 팔로우 - 팔로잉 기능
    - [x] 팔로잉 리스트 데이터 가져오기
    - [ ] 알림
    - [ ] API 키 보안 작업
- [x] Firebase storage로 이미지 파일 저장&관리
- [ ] Recoil 상태관리를 통한 메뉴 다국어 기능
- [ ] 반응형 UI
- [ ] vercel 배포
