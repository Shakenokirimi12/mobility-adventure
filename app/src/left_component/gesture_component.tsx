import React, { useState, useEffect } from 'react';
import { useDrag } from '@use-gesture/react';
import { animated, useSpring } from '@react-spring/web';
import Dear from './components/Dear'; // Import the Dog component
import { useDogs } from './util/useDogs'; // The combined useDogs hook

interface CroppableImageProps {
  src: string;
  sensitivity: number; // Sensitivity prop
}

const CroppableImage: React.FC<CroppableImageProps> = ({ src, sensitivity }) => {
  const [imgSize, setImgSize] = useState({ width: 0, height: 0 });
  const [centerX, setCenterX] = useState(0); // Initial X axis position
  const [centerY, setCenterY] = useState(0); // Initial Y axis position
  const [offsetX, setOffsetX] = useState(0); // Offset for dragging
  const [offsetY, setOffsetY] = useState(0); // Offset for dragging

  // Get dog positions from the useDogs hook
  const { dogs, moveDog } = useDogs([
    { id: 'dog1', x: 50, y: 50 },
    { id: 'dog2', x: 100, y: 100 },
    { id: 'dog3', x: 150, y: 150 },
  ]);

  // Calculate center of the image as soon as it's loaded
  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    setImgSize({ width: naturalWidth, height: naturalHeight });

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    setCenterX((windowWidth - naturalWidth) / 2);
    setCenterY((windowHeight - naturalHeight) / 2);
  };

  // Set the initial position of the image to be centered when the component loads
  const [style, api] = useSpring(() => ({ x: centerX, y: centerY }));

  // Update spring values when centerX and centerY change
  useEffect(() => {
    api.start({ x: centerX, y: centerY });
  }, [centerX, centerY, api]);

  // Bind drag gesture to the image and update both image and dog positions
  const bind = useDrag((state) => {
    const { offset } = state;
    const newOffsetX = offset[0] * sensitivity; // Apply sensitivity
    const newOffsetY = offset[1] * sensitivity; // Apply sensitivity

    // Update the map's position
    api.start({ x: newOffsetX + centerX, y: newOffsetY + centerY });

    // Update dog positions relative to the map's movement
    dogs.forEach((dog) => {
      moveDog(dog.id, dog.x + (newOffsetX - offsetX), dog.y + (newOffsetY - offsetY));
    });

    // Update the current offset for the next drag event
    setOffsetX(newOffsetX);
    setOffsetY(newOffsetY);
  });

  // Prevent default drag behavior to hide ghost image
  const handleDragStart = (e: React.DragEvent<HTMLImageElement>) => {
    e.preventDefault();
    const img = new Image();
    img.src = '';
    e.dataTransfer.setDragImage(img, 0, 0);
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        border: '1px solid black',
      }}
    >
      <animated.img
        {...bind()} // Bind the drag gesture
        src={src}
        alt="Croppable"
        onLoad={handleImageLoad} // Center image once it's loaded
        onDragStart={handleDragStart} // Hide ghost image when dragging
        style={{
          ...style,
          cursor: 'grab',
          userSelect: 'none',
          willChange: 'transform',
          width: `${imgSize.width}px`,
          height: `${imgSize.height}px`,
        }}
      />

      {/* Render each dog on top of the image */}
      {dogs.map((dog) => (
        <Dear
          key={dog.id}
          id={dog.id}
          x={dog.x} // Updated dog position
          y={dog.y} // Updated dog position
        />
      ))}
    </div>
  );
};

export default CroppableImage;

// import React, { useState } from 'react';
// import { useDrag } from '@use-gesture/react';
// import { animated, useSpring } from '@react-spring/web';
// import Dear from './components/Dear'; // Import the Dog component
// import { useDogs } from './util/useDogs';

// interface CroppableImageProps {
//     src: string;
//     sensitivity: number;
// }

// const CroppableImage: React.FC<CroppableImageProps> = ({ src, sensitivity }) => {
//     const [imgSize, setImgSize] = useState({ width: 0, height: 0 });
//     const [centerX, setCenterX] = useState(0); // Initial X axis position
//     const [centerY, setCenterY] = useState(0); // Initial Y axis position
//     const [offsetX, setOffsetX] = useState(0); // Offset for dragging
//     const [offsetY, setOffsetY] = useState(0); // Offset for dragging

//     // Get dog positions from the useDogs hook
//     const { dogs, moveDog } = useDogs([
//         { id: 'dog1', x: 50, y: 50 },
//         { id: 'dog2', x: 100, y: 100 },
//         { id: 'dog3', x: 150, y: 150 },
//     ]);

//     // Calculate image size and center the image on load
//     const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
//         const { naturalWidth, naturalHeight } = e.currentTarget;
//         setImgSize({ width: naturalWidth, height: naturalHeight });

//         const windowWidth = window.innerWidth;
//         const windowHeight = window.innerHeight;
//         setCenterX((windowWidth - naturalWidth) / 2);
//         setCenterY((windowHeight - naturalHeight) / 2);
//     };

//     // Use react-spring to manage drag animation (initialize at center position)
//     const [style, api] = useSpring(() => ({ x: centerX, y: centerY }));

//     // Bind drag gesture to the image and update both image and dog positions
//     const bind = useDrag((state) => {
//         const { offset } = state;
//         const newOffsetX = offset[0] * sensitivity;
//         const newOffsetY = offset[1] * sensitivity;

//         // Update the map's position
//         api.start({ x: newOffsetX + centerX, y: newOffsetY + centerY });

//         // Update dog positions relative to the map's movement
//         dogs.forEach((dog) => {
//             moveDog(dog.id, dog.x + (newOffsetX - offsetX), dog.y + (newOffsetY - offsetY));
//         });

//         // Update the current offset for the next drag event
//         setOffsetX(newOffsetX);
//         setOffsetY(newOffsetY);
//     });

//     // Prevent default drag behavior to hide ghost image
//     const handleDragStart = (e: React.DragEvent<HTMLImageElement>) => {
//         e.preventDefault();
//         const img = new Image();
//         img.src = '';
//         e.dataTransfer.setDragImage(img, 0, 0);
//     };

//     return (
//         <div
//             style={{
//                 position: 'absolute',
//                 top: 0,
//                 left: 0,
//                 width: `100vw`,
//                 height: `100vh`,
//                 overflow: 'hidden',
//                 border: '1px solid black',
//             }}
//         >
//             <animated.img
//                 {...bind()} // Bind the drag gesture
//                 src={src}
//                 alt="Croppable"
//                 onLoad={handleImageLoad}
//                 onDragStart={handleDragStart}
//                 style={{
//                     ...style,
//                     cursor: 'grab',
//                     userSelect: 'none',
//                     willChange: 'transform',
//                     width: `${imgSize.width}px`,
//                     height: `${imgSize.height}px`,
//                 }}
//             />

//             {/* Render each dog on top of the image */}
//             {dogs.map((dog) => (
//                 <Dear
//                     key={dog.id}
//                     id={dog.id}
//                     x={dog.x} // Updated dog position
//                     y={dog.y} // Updated dog position
//                 />
//             ))}
//         </div>
//     );
// };

// export default CroppableImage;


// import React, { useState } from 'react';
// import { useDrag } from '@use-gesture/react';
// import { animated, useSpring } from '@react-spring/web';

// interface CroppableImageProps {
//     src: string;
//     sensitivity: number;
// }

// const CroppableImage: React.FC<CroppableImageProps> = ({ src, sensitivity }) => {
//     const [imgSize, setImgSize] = useState({ width: 0, height: 0 });
//     const [centerX, setCenterX] = useState(0); // 初期位置のX軸
//     const [centerY, setCenterY] = useState(0); // 初期位置のY軸

//     // 画像サイズを取得して、中央位置を計算する
//     const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
//         const { naturalWidth, naturalHeight } = e.currentTarget;
//         setImgSize({ width: naturalWidth, height: naturalHeight });

//         // 画面の中央を計算して、画像の初期位置を中央に設定
//         const windowWidth = window.innerWidth;
//         const windowHeight = window.innerHeight;
//         setCenterX((windowWidth - naturalWidth) / 2);
//         setCenterY((windowHeight - naturalHeight) / 2);
//     };

//     // react-springを使ってアニメーションを管理（初期位置を中央に設定）
//     const [style, api] = useSpring(() => ({ x: centerX, y: centerY }));

//     // ドラッグ用のジェスチャーフック
//     const bind = useDrag((state) => {
//         const { offset } = state;
//         api.start({ x: offset[0] * sensitivity + centerX, y: offset[1] * sensitivity + centerY });
//     });

//     // dragstartイベントをハンドリングしてゴースト画像を隠す
//     const handleDragStart = (e: React.DragEvent<HTMLImageElement>) => {
//         e.preventDefault(); // ゴースト画像を無効化
//         const img = new Image();
//         img.src = ''; // 透明な画像として空のsrcをセット
//         e.dataTransfer.setDragImage(img, 0, 0); // ゴースト画像を透明にする
//     };

//     return (
//         <div
//             style={{
//                 position: 'absolute',
//                 top: 0,
//                 left: 0,
//                 width: `100vw`,
//                 height: `100vh`,
//                 overflow: 'hidden',
//                 border: '1px solid black',
//             }}
//         >
//             <animated.img
//                 {...bind()} // ドラッグジェスチャーを画像にバインド
//                 src={src}
//                 alt="Croppable"
//                 onLoad={handleImageLoad} // 画像がロードされたときにサイズを取得
//                 onDragStart={handleDragStart} // ゴースト画像を非表示にする処理を追加
//                 style={{
//                     ...style, // springスタイルを適用
//                     cursor: 'grab',
//                     userSelect: 'none',
//                     willChange: 'transform',
//                     width: `${imgSize.width}px`,  // 画像の幅を設定
//                     height: `${imgSize.height}px`, // 画像の高さを設定
//                 }}
//             />
//         </div>
//     );
// };

// export default CroppableImage;
