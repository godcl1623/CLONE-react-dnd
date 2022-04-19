# clone-react-dnd

애플리케이션 소개
*clone-react-dnd*는 [React DnD](https://react-dnd.github.io/react-dnd/about) 라이브러리를 참고하여 만든 드래그 앤 드롭 라이브러리입니다.

연산 수행 및 상태 관리 수행을 통해 사용자의 드래그 앤 드롭 기능 구현을 보조하는 것을 목적으로 하고 있습니다.

## 목차
* 기획 배경 및 상세 소개
* 프로젝트 구조
* 기능 명세 및 상세 화면
* 기술 스택

## 기획 배경 및 상세 소개
* [libmanage-client](https://github.com/godcl1623/libmanage-client) 프로젝트를 진행하던 중 드래그 앤 드롭을 사용한 정렬 기능을 추가하고자 했습니다.
	* HTML 드래그 앤 드롭 API 자체는 다뤄본 경험이 있었기에, 이미 존재하는 라이브러리([React DnD](https://react-dnd.github.io/react-dnd/about))를 그대로 사용하기보다 직접 구현하는 것을 목표로 삼았습니다.

* 참조한 라이브러리인 [React DnD](https://react-dnd.github.io/react-dnd/about)는 React.js의 Custom Hook 형태로 개발됐는데, 이제까지 개발을 진행하며 Custom Hook을 다뤄본 적이 없었습니다.
	* 이번 프로젝트를 통해 Custom Hook을 직접 구현해 봄으로써 React.js에 대한 이해도를 높이고자 했습니다.

* 참조한 라이브러리인 [React DnD](https://react-dnd.github.io/react-dnd/about)를 참조하여 패키지 매니저를 통해 설치 및 사용하는 것을 상정하고 개발을 진행했습니다.
	* 패키지 매니저를 통한 실제 배포는 진행하지 않았습니다.

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

## 사용 방법
<details>
<summary>useDragClone</summary>
<div markdown="1">

* `useDragClone`은 react-dnd의 `useDrag` Hook에 해당합니다.
  * `ref`를 지정한 대상, 자식 요소에 `draggable` 속성을 부여함으로써 드래그 가능하도록 만들어줍니다.

* **상세 기능**
  * 대상에 토글 가능한 드래그 속성 부여
  * 드래그 시작 지점, 종료 지점의 좌표, 드래그 대상 정보 제공

  <details>
  <summary>상세 설명</summary>
  <div markdown="1">

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

    const { updateGlobalDragTarget, makeDraggable, setRefresher } = setSettings;

    return (
      <div
        ref={dragRef}
        onDragStart={e => updateGlobalDragTarget(e.target)}
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
    * **[1]**(`dragInfo`): 드래그 앤 드롭 구현에 사용할 수 있는 데이터를 담은 객체입니다. 시작 지점 정보를 담은 `startInfo` 객체, 드롭 지점 정보를 담은 `lastInfo` 객체를 포함합니다.
      * `*Info` 객체는 각각 `*EleInfo`, `*Coords` 객체를 포함합니다.
      * `*EleInfo`는 `getBoundingClientRect()`로 반환된 정보를 담고 있습니다.
      * `*Coords`는 `DragEvent`로 반환된 정보를 담고 있습니다.
    * **[2]**(`setSettings`): 드래그 앤 드롭 구현에 사용할 수 있는 메서드를 포함하는 객체입니다.
      * `updateGlobalDragTarget()`**(필수)**: `dragInfo` 계산을 위해 현재 드래그중인 대상을 지정하는 메서드입니다.
        * `onDragStart` 이벤트의 이벤트 대상을 파라미터로 합니다.
      * `setRefresher()`: DOM 노드가 새로 생성되어 재렌더링이 발생했을 때, 새로 생성된 노드에도 드래그 속성을 부여하기 위해 사용하는 메서드입니다.
        * `onChange` 이벤트의 이벤트 대상을 파라미터로 합니다.
      * `makeDraggable(param: boolean)`: 드래그 속성이 토글 형식으로 부여되도록 설정하는 메서드입니다.
        * 드래그 속성이 필요 없는경우 `false`를, 드래그 속성이 필요한 경우 `true`를 값으로 받습니다.

  </div>
  </details>

</div>
</details>

<details>
<summary>useDropClone</summary>
<div markdown="1">

* `useDropClone`은 react-dnd의 `useDrop` Hook에 해당합니다.
  * `ref`를 지정한 대상, 자식 요소에 카테고리를 부여함으로써 드래그 대상과의 상호작용이 가능하도록 합니다.

* **상세 기능**
  * 대상에 드롭 이벤트 부여
  * 드래그 대상과의 카테고리 비교를 통해 드롭 이벤트 실행

  <details>
  <summary>상세 설명</summary>
  <div markdown="1">

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
      * **[1]**(`lastDropResult`): 디버깅 용도로 사용할 수 있는 정보를 담은 객체입니다. `lastDroppedLevel` 프로퍼티와 `lastDroppedResult` 프로퍼티를 담고 있습니다.
        * `lastDroppedLevel`: 드래그 대상이 드롭된 깊이를 나타냅니다. `dropRef`를 기준으로 0부터 시작하며, 중첩이 발생할 때마다 1씩 증가합니다.
        * `lastDroppedResult`: 드롭된 대상이 `dropRef`인지, 자식 요소인지를 나타냅니다. 드롭 대상이 `dropRef`일 경우 `root`, 자식 요소일 경우 `child`가 값이 됩니다.

  </div>
  </details>

</div>
</details>

<details>
<summary>useGlobalStates</summary>
<div markdown="1">

* `useGlobalStates`는 디버깅 목적을 위해 clone-react-dnd 내부에서 사용되는 각종 상태를 반환하는 메서드입니다.

  <details>
  <summary>상세 설명</summary>
  <div markdown="1">

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

</div>
</details>


## 기술 스택
* Front-End
	* React.js
	* TypeScript
