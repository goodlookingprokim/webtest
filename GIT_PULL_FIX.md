# Git Pull 전략 설정 문제 해결 가이드

## 🚨 문제 상황

`git pull` 명령어 실행 시 다음과 같은 오류가 발생하는 경우:

```bash
(base) jmacpro@jMacPro-MacBook-Pro webTest % git pull
hint: You have divergent branches and need to specify how to reconcile them.
hint: You can do so by running one of the following commands sometime before
hint: your next pull:
hint: 
hint:   git config pull.rebase false  # merge
hint:   git config pull.rebase true   # rebase
hint:   git config pull.ff only       # fast-forward only
hint: 
hint: You can replace "git config" with "git config --global" to set a default
hint: preference for all repositories. You can also pass --rebase, --no-rebase,
hint: or --ff-only on the command line to override the configured default per
hint: invocation.
fatal: Need to specify how to reconcile divergent branches.
```

## 📋 원인 분석

### 왜 이런 문제가 발생하나요?

Git 2.27.0 버전부터 보안과 명확성을 위해 `git pull` 시 병합 전략을 명시적으로 설정하도록 변경되었습니다. 로컬 브랜치와 원격 브랜치가 분기(diverge)된 상태에서 pull을 시도할 때, Git은 어떤 방식으로 변경사항을 통합할지 알 수 없어 오류가 발생합니다.

### 분기된 브랜치란?

로컬과 원격 저장소가 서로 다른 커밋을 가지고 있는 상태를 의미합니다:
- 로컬에는 원격에 없는 커밋이 있고
- 원격에는 로컬에 없는 커밋이 있는 상황

## 🛠️ 해결 방법

### 방법 1: Merge 전략 사용 (권장)

가장 안전하고 일반적인 방법입니다. 병합 커밋을 생성하여 두 브랜치의 히스토리를 모두 보존합니다.

```bash
# 현재 저장소에만 적용
git config pull.rebase false

# 모든 저장소에 기본값으로 적용
git config --global pull.rebase false

# 이제 pull 실행
git pull origin main
```

### 방법 2: Rebase 전략 사용

선형적인 커밋 히스토리를 유지하고 싶을 때 사용합니다. 로컬 커밋을 원격 커밋 위에 재배치합니다.

```bash
# 현재 저장소에만 적용
git config pull.rebase true

# 모든 저장소에 기본값으로 적용
git config --global pull.rebase true

# 이제 pull 실행
git pull origin main
```

### 방법 3: Fast-forward만 허용

원격 브랜치가 로컬 브랜치의 직접적인 후손일 때만 pull을 허용합니다.

```bash
# 현재 저장소에만 적용
git config pull.ff only

# 모든 저장소에 기본값으로 적용
git config --global pull.ff only

# 이제 pull 실행
git pull origin main
```

### 방법 4: 일회성 옵션 사용

설정을 영구적으로 변경하지 않고 한 번만 실행하려면:

```bash
# Merge 사용
git pull --no-rebase origin main

# Rebase 사용
git pull --rebase origin main

# Fast-forward만 사용
git pull --ff-only origin main
```

## 🔄 실제 해결 과정 예시

다음은 이 문제를 해결한 실제 과정입니다:

```bash
# 1. 현재 상태 확인
git status
# Output: On branch main
#         Your branch and 'origin/main' have diverged...

# 2. 원격 저장소 확인
git remote -v
# Output: origin https://github.com/username/repo.git (fetch)
#         origin https://github.com/username/repo.git (push)

# 3. Merge 전략 설정 (가장 안전한 방법)
git config pull.rebase false

# 4. Pull 실행
git pull origin main
# Output: Merge made by the 'ort' strategy.
#         README.md | 8 ++++++++
#         1 file changed, 8 insertions(+)

# 5. 변경사항 확인
git log --oneline -5
```

## 📊 전략 선택 가이드

| 전략 | 사용 시기 | 장점 | 단점 |
|------|-----------|------|------|
| **Merge** | - 팀 협업 시<br>- 기능 브랜치 통합 시<br>- 히스토리 보존이 중요한 경우 | - 모든 작업 내역 보존<br>- 충돌 해결 명확<br>- 안전함 | - 복잡한 히스토리<br>- 병합 커밋 생성 |
| **Rebase** | - 개인 작업 브랜치<br>- 깔끔한 히스토리 원할 때<br>- 커밋 정리가 필요한 경우 | - 선형적 히스토리<br>- 깔끔한 로그<br>- 불필요한 병합 커밋 없음 | - 히스토리 재작성<br>- 공유 브랜치에서 위험<br>- 충돌 해결 복잡 |
| **FF-only** | - 단순한 업데이트<br>- 로컬 변경사항 없을 때<br>- 안전성이 최우선인 경우 | - 가장 안전<br>- 예측 가능<br>- 히스토리 단순 | - 분기 시 실패<br>- 유연성 낮음 |

## ⚠️ 주의사항

1. **공유 브랜치에서 Rebase 주의**: 다른 사람과 공유하는 브랜치에서는 rebase를 피하세요
2. **충돌 발생 시**: merge/rebase 중 충돌이 발생하면 충돌을 해결한 후 계속 진행
3. **기본 설정 고려**: `--global` 옵션은 모든 저장소에 영향을 미치므로 신중히 선택

## 💡 권장 설정

대부분의 개발자에게 권장하는 설정:

```bash
# 기본적으로 merge 사용
git config --global pull.rebase false

# 자동으로 로컬 브랜치 설정
git config --global branch.autoSetupMerge always

# Pull 시 자동으로 원격 브랜치 추적
git config --global branch.autoSetupRebase never
```

## 🔍 추가 정보

- [Git 공식 문서 - git pull](https://git-scm.com/docs/git-pull)
- [Git 2.27.0 릴리스 노트](https://github.com/git/git/blob/master/Documentation/RelNotes/2.27.0.txt)
- 문제가 지속되면 `git --version`으로 Git 버전을 확인하고 필요시 업데이트

---

*이 가이드는 Git 2.27.0 이상 버전 기준으로 작성되었습니다.*