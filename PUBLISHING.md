# 글 작성과 발행

글은 `content/articles/connect/` 또는 `content/articles/reflect/`에 Markdown 파일 한 편씩 저장합니다. 파일을 추가하면 목록·상세·이전/다음 글이 자동 연결됩니다. 발행 빈도가 낮으므로 별도 CMS 계정 없이 원고를 Git 이력과 함께 관리합니다.

## Codex에게 맡기는 방식

다음처럼 원고와 발행 의도를 알려주면 됩니다.

> Reflect에 올릴 글이야. 아래 원고를 Markdown으로 정리하고 미리보기 보여줘.

> 확인한 이 글을 발행해줘. 커밋하고 원격에도 push해줘.

원고를 주면서 “정리해서 발행해줘”라고 요청하면 파일 작성부터 발행까지 한 번에 진행할 수 있습니다. 제가 제목·메타데이터·Markdown을 정리하고, 화면과 빌드를 확인한 뒤 작업 로그를 갱신하고 커밋·push합니다. 직접 Git 명령을 입력할 필요가 없습니다. 글 초안을 요청한 경우에는 `published: false`로 작성하고, 발행 요청에 맞춰 `true`로 바꿉니다.

## 파일 양식

[content/article-template.md](./content/article-template.md)를 복사합니다. 파일 이름은 `small-things.md`처럼 영문 소문자·숫자·하이픈을 사용하며 Connect와 Reflect 전체에서 유일해야 합니다. 파일 이름이 상세 URL의 `?article=small-things`에 쓰이므로 공개 후에는 유지하는 편이 좋습니다.

```markdown
---
title: "글 제목"
subtitle: "이 글을 소개하는 한 문장"
category: "PERSONAL / READING"
date: "2026-10-26"
published: true
demo: false
---

첫 문단입니다.

## 소제목

본문을 씁니다. **굵은 글씨**, 목록, 인용, 코드, 링크, 이미지를 사용할 수 있습니다.

> 인용문입니다.
```

- `title`, `subtitle`, `category`, `date`, `published`를 작성합니다. 날짜는 실제 날짜를 `YYYY-MM-DD`로 표기합니다.
- `published: true`인 파일만 목록과 최종 빌드에 포함됩니다. 초안은 `false`로 둡니다. 로컬 개발 서버에서는 `?article=파일이름` 주소로 초안을 확인할 수 있고, 화면에 초안 표시가 붙습니다. 이 설정은 웹사이트의 노출 여부이며, 원고 파일 자체를 GitHub에 push하면 저장소에서는 소스가 보일 수 있습니다.
- `demo: true`는 현재 샘플 글의 표시입니다. 본인의 실제 글은 `false`로 작성합니다.
- 최신 날짜순으로 정렬하고, 날짜가 같으면 파일 이름순으로 정렬합니다.
- 제목은 메타데이터에서 자동 표시하므로 본문 소제목은 `##`부터 씁니다. HTML 직접 삽입은 지원하지 않습니다.
- 이미지는 `public/images/`에 저장하고 `![이미지 설명](/images/photo.jpg)`로 삽입합니다.

## 확인과 업로드

`npm run dev`로 미리 보고 `npm run build`로 글 형식과 타입·정적 빌드를 확인합니다. 공개할 글의 필수 정보·날짜·파일 이름이 잘못됐거나 본문이 비어 있으면 빌드가 실패해 해당 파일을 알려줍니다.

이후 원고와 관련 이미지만 작업 단위로 커밋하고 `main`에 push합니다. 현재 GitHub 저장소는 `marineyeong/marineyeong_space`입니다. 글 내용을 고칠 때도 같은 파일을 수정해 동일한 절차를 사용합니다.

## 실제 웹 공개에 남은 연결

현재 Git push는 GitHub에 원고와 앱 소스를 업로드하는 단계입니다. **배포 호스트는 아직 연결되지 않았으므로 push만으로 공개 웹사이트가 갱신되지는 않습니다.** 다음에는 배포 호스트를 한 번 연결해 `main` push → 빌드 → 웹사이트 반영을 자동화하면 됩니다. 그 뒤에는 원고 작성과 발행 요청만으로 운영할 수 있습니다.

추가로 정할 것은 배포 호스트·기본 공개 주소(개인 도메인은 선택), 첫 실제 원고와 프로젝트 정보, 천문 데이터의 실제 출처입니다. CMS는 브라우저 편집이나 공동 작성이 필요해질 때 다시 검토합니다.

현재처럼 정적 개인 사이트이고 GitHub 저장소를 이미 사용한다면 **GitHub Pages + Actions 자동 배포**를 우선 제안합니다. 한 번 연결한 뒤에는 `main` push로 배포하도록 구성할 수 있습니다. 설정 시 프로젝트 주소에 맞는 Vite `base`와 Pages 소스·배포 워크플로를 함께 맞춰야 합니다. 구체적인 배포 설정은 아직 추가하지 않았습니다. [Vite의 GitHub Pages 배포 안내](https://vite.dev/guide/static-deploy.html#github-pages)를 기준으로 진행할 수 있습니다.
