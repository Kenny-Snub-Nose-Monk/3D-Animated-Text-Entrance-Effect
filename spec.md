# 3D Animated Text Entrance Effect


## 最終效果
https://github.com/user-attachments/assets/e53740f6-67c0-4478-bdef-b89519f3feef



## 內容與樣式
- **文字內容**:
  - 第一行: `" Team Taiwan! Team Taiwan!` (注意開頭空格)
  - 第二行: `Taiwan is a great country! "` (注意結尾空格)
- **位置**: 文字區塊需在螢幕垂直與水平置中。
- **基本樣式**:
  - 文字顏色 (`color`): `#FFFFFF` (白色)
  - 背景顏色 (`background`): `#000000` (黑色)
  - 字體 Poppins
  - 建議設定容器 (`fx-parent`) 的 `perspective` CSS 屬性，以啟用子元素的 3D 效果 (例如: `perspective: 800px;`)。

## 動畫方式與原則

### 1. 逐字入場 (Staggered Reveal)
- **原則**: 文字不是整行或整詞同時顯示，而是以「單個字母」為單位，依序進場。
- **實現**: 使用 GSAP 的 `stagger` 功能，為每個字母的動畫設定微小的延遲時間 (使用 `stagger: 0.01`)，創造流暢的波浪效果，同時保持字母間的連貫性。

### 2. 3D 螺旋進場 (3D Transform Animation)
- **目標**: 每個字母從初始狀態動畫到最終的標準位置與樣式。
- **初始狀態 (`gsap.set`)**:
    - **透明度 (`opacity`)**: `0` (完全透明)
    - **X 軸旋轉 (`rotationX`)**: `90deg` (從視覺上看似躺平)
    - **Z 軸旋轉 (`rotationZ`)**: `-15deg` (製造輕微螺旋感)
    - **縮放 (`scale`)**: `0.2` (從遠處縮小感)
    - **位置 (X, Y)**:
        - `x`: 設定一個較小的正值，使字母從右側進入 (e.g., `x: 30`)。可以考慮根據字母索引微調位置 (e.g., `x: (index) => 30 + index * 1`)，增強字母的立體感。
        - `y`: 使用固定值 (`y: 100`) 讓所有字母從下方進入。
    - **變換原點 (`transformOrigin`)**: 建議設為 `"center center"`，讓旋轉和縮放以字母中心為基準。
- **結束狀態 (`gsap.to`)**:
    - **位置與外觀動畫**: 使用單獨的 tween
        - **透明度 (`opacity`)**: `1` (完全不透明)
        - **縮放 (`scale`)**: `1` (恢復原始大小)
        - **位置 (`x`, `y`)**: `0` (回到其在文本流中的自然位置)
        - **緩動函數**: `ease: "power4.out"` (提供平滑的減速效果)
    - **旋轉動畫**: 使用單獨的 tween
        - **X 軸旋轉 (`rotationX`)**: `0deg` (恢復直立)
        - **Z 軸旋轉 (`rotationZ`)**: `0deg` (恢復水平)
        - **緩動函數**: `ease: "expoScale.out"` (提供更戲劇性的旋轉效果)
- **動畫時間 (`duration`)**: `1.5` 秒，對於所有動畫屬性保持一致。

### 3. 進場軌跡微調
- **深度感**: 由於使用了較小的 Z 軸旋轉 (-15deg)，整體視覺重點更加集中在 X 軸翻轉和流暢的入場，保持文字在相近的視覺平面上。

## 技術實現方式
- **核心技術**: React + GSAP。
- **分離動畫屬性**: 為獲得最佳效果，分離動畫屬性至兩個不同的 `gsap.to()` 調用:
    1. 位置、比例、透明度使用 `power4.out` 緩動
    2. 旋轉使用 `expoScale.out` 緩動
- **React 結構**:
    - 使用 `useRef` 取得父元素參考。
    - 使用 `useGSAP` hook 執行動畫設定。
    - 使用 helper 函數將文字拆分為單個字母的 spans。
    - 為父容器添加 `fx-parent` class，為每個字母添加 `fx-letter` class。

## 最終 React 組件結構
```jsx
import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import './App.css';

function splitTextIntoSpans(text, baseClass = 'fx-letter') {
  return text.split('').map((char, index) => (
    <span
      key={`${baseClass}-${index}`}
      className={`${baseClass} ${baseClass}--${index + 1}`}
      aria-hidden="true"
    >
      {char === ' ' ? '\u00A0' : char}
    </span>
  ));
}

function App() {
  const container = useRef();
  const pRef1 = useRef();
  const pRef2 = useRef();

  const text1 = '" Team Taiwan! Team Taiwan!';
  const text2 = 'Taiwan is a great country! "';

  useGSAP(() => {
    const letters1 = pRef1.current.querySelectorAll('.fx-letter');
    const letters2 = pRef2.current.querySelectorAll('.fx-letter');
    const allLetters = ".fx-letter";
    const parents = ".fx-parent";

    let startY = 100;

    gsap.set(parents, { visibility: 'visible' });

    // Initial state for line 1
    gsap.set(letters1, {
      opacity: 0,
      rotationX: 90,
      rotationZ: -15,
      scale: 0.2,
      x: (index) => 30 + index * 1,
      y: startY,
      transformOrigin: 'center center',
    });

    // Initial state for line 2
    gsap.set(letters2, {
      opacity: 0,
      rotationX: 90,
      rotationZ: -15,
      scale: 0.2,
      x: (index) => 30 + index * 1,
      y: startY,
      transformOrigin: 'center center',
    });

    const animationDuration = 1.5;
    const animationStagger = 0.01;

    // Animation for position, scale, opacity
    gsap.to(allLetters, {
      opacity: 1,
      scale: 1,
      x: 0,
      y: 0,
      duration: animationDuration,
      ease: 'power4.out',
      stagger: animationStagger,
    });

    // Separate animation for rotation with different ease
    gsap.to(allLetters, {
      rotationX: 0,
      rotationZ: 0,
      duration: animationDuration,
      ease: 'expoScale.out', 
      stagger: animationStagger,
    });

  }, { scope: container, dependencies: [] });

  return (
    <div className="app-container" ref={container}>
      <p className="fx-parent" ref={pRef1} aria-label={text1}>
        {splitTextIntoSpans(text1)}
      </p>
      <p className="fx-parent" ref={pRef2} aria-label={text2}>
        {splitTextIntoSpans(text2)}
      </p>
    </div>
  );
}
```
