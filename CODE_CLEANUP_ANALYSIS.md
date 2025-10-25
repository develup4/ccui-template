# 코드베이스 정리 분석 보고서

## 개요
Explorer 프로젝트의 불필요한 코드와 정리 대상을 분석한 결과입니다.

## 1. Dead Code - logGuiAction 함수 (높은 우선순위)

### 문제
- `logGuiAction` 함수가 import 되지만 어디서도 정의/export 되지 않음
- 실제로 호출되는 곳: 4곳

### 영향 범위
```
파일: /app/components/IPInstanceFlowPanel.tsx:24
- 행 257: logGuiAction(newVisibility ? `show_ports ${nodeId}` : `hide_ports ${nodeId}`)
- 행 282: logGuiAction(`create_binding -from ${fromPort} -to ${toPort}`)
- 행 298: logGuiAction(`select_objects ${edge.source}`)

파일: /app/(layouts)/fullscreen.tsx:12
- 행 51: logGuiAction(`current_instance ${instance.hierarchy}`)
- 행 62: logGuiAction(`current_instance ${node.hierarchy}`)
```
C61E-678D

### 조치
- [ ] `logGuiAction` 함수 구현 또는 import 제거

---

## 2. 빈 파일 (중간 우선순위)

### 문제
- **파일**: `/app/components/IPInstanceBindingPanel/types.ts`
- **상태**: 파일 존재하지만 내용이 완전히 비어있음 (0 바이트)

### 조치
- [ ] 파일 삭제 또는 필요한 타입 정의 추가

---

## 3. 사용되지 않는 레이아웃 컴포넌트 (중간 우선순위)

### 문제
- **파일**: `/app/(layouts)/vertical.tsx`
- **상태**: 완성된 컴포넌트이지만 프로젝트 어디서도 import 되지 않음
- **크기**: 21줄의 레이아웃 코드

### 조치
- [ ] 사용 예정이 없으면 삭제
- [ ] 또는 사용할 곳에 import 하고 활성화

---

## 4. TODO 작업 (낮은 우선순위)

### 문제
`/app/(layouts)/fullscreen.tsx`에 4개의 미완료 서버 액션 TODO

```typescript
// 행 63-64
// TODO: Call server action to update IPInstance
// await updateIPInstance(node);

// 행 73-74
// TODO: Call server action to update IPInstance with port changes
// await updateIPInstance(selectedNode);

// 행 83-84
// TODO: Call server action to update IPInstance with binding changes
// await updateIPInstance(selectedNode);

// 행 92-93
// TODO: Call server action to update IPInstance
// await updateIPInstance(selectedNode);
```

### 조치
- [ ] 서버 액션 구현
- [ ] 또는 주석 제거 (필요 없으면)

---

## 5. 중복 파싱 로직 (낮은 우선순위)

### 문제
유사한 문자열 파싱 로직이 여러 곳에 존재

```
- `/app/lib/console/commandExecutor.ts:10` - parseArgs()
- `/app/lib/console/commandHistory.ts:129` - parseBindCommand()
```

### 조치
- [ ] 공유 유틸리티 모듈로 추출 (`/app/lib/console/parseUtils.ts`)
- [ ] 두 파일에서 공유 함수 사용

---

## 6. 테스트 파일 정리 (낮은 우선순위)

### 문제
테스트 파일이 루트 레벨에 분산되어 있음
- `/home/develup4/repo/explorer/test-ir.ts`
- `/home/develup4/repo/explorer/test-ranged-ir.ts`
- npm test 스크립트에 포함되지 않음

### 조치
- [ ] `__tests__` 또는 `tests` 디렉토리로 이동
- [ ] npm test 스크립트에 추가

---

## 7. 타입 정의 통합 (낮은 우선순위)

### 문제
타입 정의가 여러 파일에 산재
- `data-structure.ts` - 메인 타입 정의
- `sample-data.ts` - 유사한 인터페이스
- `IPInstanceBindingPanel/types.ts` - 빈 파일

### 조치
- [ ] 모든 타입을 `data-structure.ts`로 통합
- [ ] 불필요한 타입 파일 제거

---

## 요약

| 항목 | 우선순위 | 상태 | 파일 수 |
|-----|---------|------|--------|
| logGuiAction 제거 | 높음 | 대기 중 | 2 |
| 빈 파일 삭제 | 중간 | 대기 중 | 1 |
| 사용 안 함 컴포넌트 제거 | 중간 | 대기 중 | 1 |
| 서버 액션 TODO | 낮음 | 대기 중 | 1 |
| 파싱 로직 리팩토링 | 낮음 | 대기 중 | 2 |
| 테스트 파일 정리 | 낮음 | 대기 중 | 2 |
| 타입 정의 통합 | 낮음 | 대기 중 | 3 |

**총 제거/정리 대상**: 약 12개 파일/위치

---

## 다음 단계

1. **높은 우선순위**: logGuiAction 함수 구현 또는 제거
2. **중간 우선순위**: 불필요한 파일 삭제
3. **낮은 우선순위**: 코드 리팩토링 및 구조 개선
