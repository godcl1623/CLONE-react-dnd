# clone-react-dnd

<br/><br/>

## 애플리케이션 소개
**clone-react-dnd**는 [React DnD](https://react-dnd.github.io/react-dnd/about) 라이브러리를 참고하여 만든 드래그 앤 드롭 라이브러리입니다.

연산 수행 및 상태 관리 수행을 통해 사용자의 드래그 앤 드롭 기능 구현을 보조하는 것을 목적으로 하고 있습니다.

<br/><br/>

## 목차
* 기획 배경 및 상세 소개
* 프로젝트 구조
* 사용 방법
* 기술 스택
* 기술적 고민

<br/><br/>

## 기획 배경 및 상세 소개
* [libmanage-client](https://github.com/godcl1623/libmanage-client) 프로젝트를 진행하던 중 드래그 앤 드롭을 사용한 정렬 기능을 추가하고자 했습니다.
	* HTML 드래그 앤 드롭 API 자체는 다뤄본 경험이 있었기에, 이미 존재하는 라이브러리([React DnD](https://react-dnd.github.io/react-dnd/about))를 그대로 사용하기보다 직접 구현하는 것을 목표로 삼았습니다.

* 참조한 라이브러리인 react-dnd는 React.js의 Custom Hook 형태로 개발됐는데, 이제까지 개발을 진행하며 Custom Hook을 다뤄본 적이 없었습니다.
	* 이번 프로젝트를 통해 Custom Hook을 직접 구현해 봄으로써 React.js에 대한 이해도를 높이고자 했습니다.

* 참조한 라이브러리인 react-dnd를 참조하여 패키지 매니저를 통해 설치 및 사용하는 것을 상정하고 개발을 진행했습니다.
	* 패키지 매니저를 통한 실제 배포는 진행하지 않았습니다.

****
<br/><br/>

## 프로젝트 구조
```
├── src/
│   ├── components/
│   │   └── CommonUtils.tsx
│   │
│   ├── hooks/
│   │   ├── useDragClone.tsx
│   │   ├── useDropClone.tsx
│   │   └── useGlobalStates.tsx
│   │
```

****
<br/><br/>

## 사용 방법

<details>
<summary>useDragClone</summary>
<div markdown="1">

* `useDragClone`은 react-dnd의 `useDrag` Hook에 해당합니다.
  * `ref`를 지정한 대상, 자식 요소에 `draggable` 속성을 부여함으로써 드래그할 수 있도록 만들어줍니다.

* **상세 기능**
  * 대상에 토글 가능한 드래그 속성 부여
  * 드래그 시작 지점 좌표, 드래그 대상 정보 제공

* **상세 설명**
  ```
  import cloneDnd, { DragOption } from 'cloneDnd';

  function App(props) {
    const { useDragClone } = cloneDnd;

    const dragOption: DragOption = {
      currentItemCategory: {
        level0: ['category1']
      },
      disableCurrent: true,
      applyToChildren: true
    };

    const [dragRef, dragInfo, setSettings] = useDragClone(dragOption);

    const { makeDraggable, setRefresher } = setSettings;

    return (
      <div
        ref={dragRef}
      >
        { ... }
      </div>
    );
  }
  ```

  * **파라미터**
    * `DragOption`: 대상에 드래그를 적용하기에 앞서 부여할 옵션입니다.
      * `currentItemCategory`**(필수)**: `(string | string[])[]` 타입이며, 동일한 카테고리가 부여된 드롭 대상과만 반응합니다.
      * `disableCurrent`(선택): `boolean` 타입이며, 기본값은 `true`입니다. `true`로 설정할 경우 `ref` 대상은 드래그 속성이 부여되지 않습니다.
        * `disableCurrent`와 `applyToChildren` 둘 중 하나는 반드시 `true`값이어야 합니다.
      * `applyToChildren`(선택): `boolean` 타입이며, 기본값은 `true`입니다. `true`로 설정할 경우 `ref` 대상의 자식 요소들에 드래그 속성이 부여됩니다.
        * `disableCurrent`와 `applyToChildren` 둘 중 하나는 반드시 `true`값이어야 합니다.

  * **반환 배열**
    * **[0]**(`dragRef`)**(필수)**: 대상에 드래그 속성을 부여합니다.
    * **[1]**(`dragInfo`): 드래그 앤 드롭 구현에 사용할 수 있는 데이터를 담은 객체로, 드래그 시작 시점의 드래그 요소의 좌표 정보, 스타일 정보를 반환합니다.
      * `dragInfo` 객체는 각각 `startEleInfo`, `startCoords` 객체를 포함합니다.
      * `startEleInfo`는 `getBoundingClientRect()`로 반환된 정보를 담고 있습니다.
      * `startCoords`는 `DragEvent`로 반환된 정보를 담고 있습니다.
    * **[2]**(`setSettings`): 드래그 앤 드롭 구현에 사용할 수 있는 메서드를 포함하는 객체입니다.
      * `setRefresher()`: DOM 노드가 새로 생성되어 재렌더링이 발생했을 때, 새로 생성된 노드에도 드래그 속성을 부여하기 위해 사용하는 메서드입니다.
        * `onChange` 이벤트의 `event.target`을 파라미터로 합니다.
      * `makeDraggable(param: boolean)`: 드래그 속성이 토글 형식으로 부여되도록 설정하는 메서드입니다.
        * 드래그 속성이 필요 없는경우 `false`를, 드래그 속성이 필요한 경우 `true`를 값으로 받습니다.

</div>
</details>

<br/>

<details>
<summary>useDropClone</summary>
<div markdown="1">

* `useDropClone`은 react-dnd의 `useDrop` Hook에 해당합니다.
  * `ref`를 지정한 대상, 자식 요소에 카테고리를 부여함으로써 드래그 대상과의 상호작용이 가능해지도록 합니다.

* **상세 기능**
  * 대상에 드롭 이벤트 부여
  * 드래그 대상과의 카테고리 비교를 통해 드롭 이벤트 실행

* **상세 설명**
  ```
  import cloneDnd, { DropOption } from 'cloneDnd';

  function App(props) {
    const { useDropClone } = cloneDnd;

    const dropOption: DropOption = {
      currentItemCategory: {
        level0: ['category1']
      },
      applyToChildren: true
    };

    const [dropRef, lastDropResult] = useDragClone(dragOption);

    return (
      <div
        ref={dropRef}
      >
        { ... }
      </div>
    );
  }
  ```

  * **파라미터**
    * `DropOption`: 대상에 드롭 이벤트를 적용하기에 앞서 부여할 옵션입니다.
      * `currentItemCategory`**(필수)**: `(string | string[])[]` 타입이며, 동일한 카테고리가 부여된 드래그 대상과만 반응합니다.
      * `applyToChildren`(선택): `boolean` 타입이며, 기본값은 `false`입니다. `true`로 설정할 경우 `ref` 대상을 포함해 자식 요소들 또한 드롭 이벤트의 대상이 됩니다.

  * **반환 배열**
    * **[0]**(`dropRef`)**(필수)**: 대상에 드롭 이벤트를 부여합니다.
    * **[1]**(`dropInfo`): 드래그 앤 드롭 구현에 사용할 수 있는 데이터를 담은 객체로, 드롭 시점의 드래그 요소의 좌표 정보, 스타일 정보를 반환합니다.
    * `dropInfo` 객체는 각각 `dropEleInfo`, `dropCoords` 객체를 포함합니다.
    * `dropEleInfo`는 `getBoundingClientRect()`로 반환된 정보를 담고 있습니다.
    * `dropCoords`는 `DragEvent`로 반환된 정보를 담고 있습니다.
    * **[2]**(`__DebugLastDropResult`): 디버깅 용도로 사용할 수 있는 정보를 담은 객체입니다. `__DebugLastDroppedLevel` 프로퍼티와 `__DebugLastDroppedResult` 프로퍼티를 담고 있습니다.
      * `__DebugLastDroppedLevel`: 드래그 대상이 드롭된 깊이를 나타냅니다. `dropRef`를 기준으로 0부터 시작하며, 중첩이 발생할 때마다 1씩 증가합니다.
      * `__DebugLastDroppedResult`: 드롭된 대상이 `dropRef`인지, 자식 요소인지를 나타냅니다. 드롭 대상이 `dropRef`일 경우 `root`, 자식 요소일 경우 `child`가 값이 됩니다.

</div>
</details>

<br/>

<details>
<summary>useGlobalStates</summary>
<div markdown="1">

* `useGlobalStates`는 디버깅 목적을 위해 clone-react-dnd 내부에서 사용되는 각종 상태를 반환하는 메서드입니다.

* **상세 설명**
  ```
  import cloneDnd from 'cloneDnd';

  function App(props) {
    const { useGlobalStates } = cloneDnd;

    const {
      currentDragTarget,
      currentDropTarget,
      currentDragCategory,
      currentDropCategory,
      dropMap,
      isDropped
    } = useGlobalStates();
  }
  ```

    * `currentDrag(Drop)Target`: 현재 드래그 중인 대상, 현재 드롭 이벤트가 발생한 대상을 나타냅니다.
    * `currentDrag(Drop)Category`: 현재 드래그 중인 대상의 카테고리, 현재 드롭 이벤트가 발생한 대상의 카테고리를 나타냅니다.
    * `dropMap`: 현재 `dropRef`의 DOM 트리를 배열을 값으로 하는 객체 형태로 표시합니다.
      * 예시 삽입
    * `isDropped`: 드롭 이벤트가 정상적으로 발생했는지 여부를 나타냅니다.

</div>
</details>

<br/>

<details>
<summary>useTouchDnd</summary>
<div markdown="1">

* `useTouchDnd`는 모바일 화면에서 터치 이벤트로 드래그 앤 드롭 기능을 구현해야 할 때 사용하는 hook 입니다.

* **상세 설명**
  ```
  import cloneDnd, { TouchStyleOptions } from 'cloneDnd';

  function App(props) {
    const { useTouchDnd } = cloneDnd;

    const touchStyleOptions: TouchStyleOptions = {
      cloneTgtStyle: {
        // Customize width, height, position, left, top, opacity, background
      },

      highlightStyles: {
        // Customize transition, currEleBoxShadow, dropTgtBoxShadow, exceptionsBoxShadow
      }
    }

    const [
      makeTouchTgtClone,
      trackClonedTgt,
      highlightDragItem,
      detectDropEvt
    ] = useDragClone(touchStyleOptions);

    function handleTouchStart(event: React.TouchEvent): void {
      const touchTgt = '' // define touch target here

      makeTouchTgtClone(event, touchTgt, dropRef.current);
    }

    function handleTouchMove(event: React.TouchEvent): void {
      trackClonedTgt(event);
      highlightDragItem(event, dropRef.current);
    }

    const updateStateFuncs = (dropRes: string[]): void => {
      // call state update functions here
    };

    function handleTouchEnd(event: React.TouchEvent): void {
      detectDropEvt(dropRef.current, updateStateFuncs);
    }

    return (
      <div
        ref={dropRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        { ... }
      </div>
    );
  }
  ```

  * **파라미터**
    * `touchStyleOptions`: 터치 이벤트를 적용하기에 앞서 부여할 옵션입니다.<br />
      드래그 대상을 드래그할 때 표시할 미리보기, 드래그 대상을 드롭할 자리 강조 등의
      효과를 부여할 수 있습니다.
      * `cloneTgtStyle`: 터치로 이동시킬 대상의 미리보기 스타일을 설정합니다.<br />
        대상의 width, height, position, left, top, opacity, background 전부 혹은 일부를 수정할 수 있습니다.
      * `highlightStyles`: 터치 후 드래그하는 동안 대상이 드롭될 자리를 강조하는 효과를 부여할 수 있습니다.<br />
        대상의 transition, currEleBoxShadow(= 현재 드래그 대상이 드롭될 자리 강조), dropTgtBoxShadow(= 드래그로 목록의 끝에 도달했을 때 마지막 요소의 강조 효과),
        exceptionBoxShadow(= 드롭될 자리 이외의 요소에서 강조 효과 제거 혹은 별도의 강조 효과 부여) 전부 혹은 일부를 수정할 수 있습니다.

  * **반환 배열**
    * **[0]**(`makeTouchTgtClone`): touchstart 시점에 드래그할 대상의 미리보기 요소를 생성하는 함수입니다.<br />
      * touchmove 시점에 드롭될 지점까지 이동하는 역할을 수행합니다.
      * 인자로 터치 이벤트, 드래그 대상(event.target 등), 드롭 대상을 차례로 받습니다.
    * **[1]**(`trackClonedTgt`): touchmove 시점에 touchstart에서 생성된 미리보기 요소를 손가락 움직임에 맞춰 이동시키는 함수입니다.
      * 인자로 터치 이벤트를 받습니다.
    * **[2]**(`highlightDragItem`): touchmove 시점에 현재 드래그 중인 요소가 드롭될 위치를 강조하여 표시하는 함수입니다.
      * 인자로 터치 이벤트, 드롭 대상을 차례로 받습니다.
    * **[3]**(`detectDropEvt`): touchend 시점에 드래그 중이던 요소를 드롭하고, 이에 맞춰 요소 목록의 순서를 변경하는 함수입니다.
      * 인자로 드롭 대상, 드롭 결과를 문자열 형태로 만들어 기존 상태값과 대체할 함수를 받습니다.

</div>
</details>

<br/><br/>

## 기술 스택
* Front-End
	* React.js
    	* React.js의 Custom Hook을 사용한 기능 개발을 목표로 삼았습니다.
        	* 이전 프로젝트에서 React.js는 계속 사용해 왔으나, Custom Hook은 직접 구현해본 경험이 없었기 때문입니다.
        	* 실제로 배포하진 않았으나, npm 등 패키지 매니저를 통해 설치 및 사용하는 것을 상정하고 개발을 진행했습니다.
	* Zustand
    	* 글로벌 상태 관리 및 Redux 이외의 상태 관리 라이브러리 체험을 위해 사용했습니다.
	* TypeScript
    	* 타입스크립트 강의를 수강한 후, 좀 더 기능에 익숙해지기 위해 타입스크립트를 사용했습니다.

<br/><br/>

## 기술적 고민

<details>
<summary><span style="font-weight: bold;">1. 모듈에 전역 상태 라이브러리 적용</span></summary>
<div markdown="1">

  * **요약**
    - 기존에 사용해오던 react-redux로는 프로젝트 외부에서 글로벌 상태 관리가 불가능하여 Zustand 라이브러리로 변경
  
  * **문제 상황**
    - 글로벌 상태 관리로 사용해오던 react-redux는 프로젝트 내부 테스트 환경에서는 잘 작동했으나, 외부에서 라이브러리 형태의 설치를 상정한 환경에서는 사용할 수 없었음
        - 커스텀 훅을 만든 후 프로젝트 내부에서 테스트하는 경우 react-redux로도 글로벌 상태 관리에 문제가 없었음
        - 커스텀 훅만 별도의 폴더에 분리해 다른 프로젝트에 로컬 설치하여 사용할 경우 상태관리 기능이 작동하지 않음
  
  * **접근 방법**
    - 원인 파악
        - 조사 결과, 라이브러리를 외부 프로젝트에 설치하는 환경에서는 react-redux를 사용할 수 없다는 것을 발견함
    - 대안 조사
        - npm trends를 기준으로 redux 계열을 제외한 상태 관리 라이브러리 종류를 목록화
        - 조사 시점 기준 가장 인기 있는 라이브러리인 MobX와 Zustand를 비교함
        - 둘 중 함수형 컴포넌트에 좀 더 적합하다는 평을 받은 Zustand를 사용하기로 함
  
  * **적용 결과**
    - 프로젝트 내부 테스트 환경에서도, 외부 프로젝트에 라이브러리 형태로 설치한 상황에서도 동일하게 작동하는 것을 확인
    - 단, 라이브러리 개발 시 Zustand에 Redux DevTools에서 열람할 수 있는 옵션을 부여한 경우, 배포 전 해당 옵션을 삭제하는 과정이 필요함
        - Zustand 사용 라이브러리와 본 프로젝트가 Redux DevTools 사용과 관련해 충돌이 발생할 경우, import로 불러온 Zustand 사용 라이브러리가 우선하는 문제가 발생함

</div>
</details>

<details>
<summary><span style="font-weight: bold">2. 드래그, 드롭 대상 카테고리 부여 로직 관련 오류</span></summary>

  * **요약**
    - 중첩 구조의 드래그, 드롭 대상마다 카테고리를 부여하는 로직을 구현했으나, 의도와 다르게 작동하는 문제를 수정함
  
  * **문제 상황**
    - 중첩 상태의 드래그, 드롭 대상마다 카테고리를 부여하기 위해 BFS 알고리즘에 착안한 로직을 구현함
        - 예를 들어 `루트(= dropRef) > (드롭 대상 1 > 드롭 대상 3) + (드롭 대상 2 > 드롭 대상 4)` 구조를 `루트 / 드롭 대상 1 + 드롭 대상 2 / 드롭 대상 3 + 드롭 대상 4`와 같이 읽어 들이는 것이 목표임
    - 실제 동작은 `루트 / 드롭 대상 1 + 드롭 대상 2 / 드롭 대상 3 / 드롭 대상 4`와 같이 나타나, 의도했던 것과 다른 로직이 구현됨
  
  * **접근 방법 및 해결**
    - 원인 파악
        - BFS 알고리즘을 작성할 때, 현재 탐색 중인 노드에 자식 노드가 존재할 경우 높이를 1 올리도록 코드를 작성함
        - 동일 계층에 속하는 노드들을 따로 분류하는 과정 없이, 탐색 큐에 현재 탐색 중인 노드의 자식을 바로 추가함
    - 해결안
        - 탐색 과정에서 현재 탐색 중인 노드의 다음 계층에 속하는 요소 개수를 구함
        - 현재 탐색 중인 노드의 다음 계층에 속하는 노드를 모으는 임시 배열을 선언하고, 배열의 길이가 요소 개수와 일치할 때까지 탐색 큐에서 추출한 노드를 추가함
        - 배열의 길이가 요소 개수와 일치하면 임시 배열을 계층 목록으로 저장, 임시 배열 내 노드들의 자식 노드를 탐색 큐에 추가하여 탐색을 계속함
  
  * **적용 결과**
    - 정상적으로 읽어 들인 중첩 구조를 바탕으로 중첩 구조 내 요소마다 카테고리를 부여할 수 있게 됨

</details>
