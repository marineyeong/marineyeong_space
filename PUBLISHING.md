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

## 자동 웹 배포

[공개 사이트](https://marineyeong.github.io/marineyeong_space/)는 GitHub Pages입니다. `main`에 코드·원고를 push하면 [GitHub Actions](https://github.com/marineyeong/marineyeong_space/actions/workflows/deploy-pages.yml)가 천문 검증과 글 형식·타입·빌드를 확인하고 성공한 결과를 배포합니다. 실패한 빌드가 기존 공개 사이트를 덮어쓰지 않습니다.

루트의 안내용 Markdown 문서만 변경했을 때는 자동 배포를 생략하지만, `content/articles/` 안의 글 파일 변경은 자동 배포됩니다. 필요하면 Actions 화면에서 **Run workflow**로 수동 배포할 수 있습니다. 홈페이지와 상세 주소 모두 `/marineyeong_space/` 경로를 유지합니다.

사용자가 추가로 제공할 것은 첫 실제 원고, 프로젝트 정보와 Observe 기록입니다. 개인 도메인은 원할 때 선택할 수 있습니다. 천문 데이터는 API 계정 없이 연결되어 있고, CMS 계정도 필요하지 않습니다. 글 작성·검증·커밋·push는 대화로 맡길 수 있습니다.

배포 구성은 [Vite의 GitHub Pages 안내](https://vite.dev/guide/static-deploy.html#github-pages)와 [GitHub Pages 공식 워크플로 문서](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)를 기준으로 합니다.
