import { useEffect, useState } from 'react';
import { HexColorInput, HexColorPicker } from 'react-colorful';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { clearEditingPixel } from '../features/wall/wallSlice';
import useContrastingColor from '../hooks/useContrastingColor';
import { History, Pixel } from '../types';
import styles from './PixelEditor.module.css';
import StyledButton from './StyledButton';

type PixelEditorProps = {
  onApply: (pixel: Pixel) => void;
};

// TODO: add recently used colors, add history
function PixelEditor({ onApply }: PixelEditorProps) {
  const currentPixel = useAppSelector((state) => state.wall.editingPixel);
  const [newColor, setNewColor] = useState(currentPixel?.color || '#000000');
  const [applyButtonTextColor, setApplyButtonTextColor] = useState('#FFFFFF');
  const dispatch = useAppDispatch();
  const [sortedHistory, setSortedHistory] = useState<History[]>([]);

  function applyChange() {
    if (currentPixel && newColor !== currentPixel.color) {
      onApply({
        ...currentPixel,
        color: newColor,
      });
    }
  }

  useEffect(() => {
    setApplyButtonTextColor(useContrastingColor(newColor));
  }, [newColor]);

  useEffect(() => {
    if (currentPixel) {
      const newHistory = [...currentPixel.history];
      newHistory.sort((a, b) => b.timestamp - a.timestamp);
      setSortedHistory(newHistory);
    }
  }, [currentPixel]);

  function handleKeyDown(e: { key: string }) {
    if (e.key === 'Escape') {
      dispatch(clearEditingPixel());
    }
    if (e.key === 'Enter') {
      applyChange();
    }
  }

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events
    <div
      onMouseDown={() => dispatch(clearEditingPixel())}
      onKeyDown={handleKeyDown}
      className={styles.backdrop}
    >
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */}
      <div
        onMouseDown={(e) => e.stopPropagation()}
        className={styles.container}
      >
        <div
          className={styles.editorContainer}
          style={{
            borderColor: newColor,
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <h1 style={{ textAlign: 'center' }}>
              Editing
              <br />({currentPixel?.x}, {currentPixel?.y})
            </h1>
            <div
              className={styles.previewPixel}
              style={{
                backgroundColor: newColor,
              }}
            />
          </div>
          <HexColorPicker
            className={styles.hexPicker}
            color={currentPixel?.color}
            onChange={setNewColor}
          />
          <HexColorInput
            prefixed
            className={styles.hexInput}
            color={newColor}
            onChange={setNewColor}
          />
          <StyledButton
            style={{ backgroundColor: newColor, color: applyButtonTextColor }}
            type="button"
            onClick={() => {
              applyChange();
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                applyChange();
              }
              if (e.key === 'Escape') {
                dispatch(clearEditingPixel());
              }
            }}
            tabIndex={0}
          >
            contribute
          </StyledButton>
        </div>
        {sortedHistory.length > 0 ? (
          <div className={styles.historyContainer}>
            <h1>History</h1>
            {sortedHistory.map((pixel) => (
              <div
                key={`${pixel.historyID}:${pixel.timestamp}:${pixel.color}:${pixel.userID}`}
                className={styles.historyEditContainer}
                style={{
                  borderColor: pixel.color,
                }}
              >
                <p>[ {pixel.userID} ]</p>
                <p>Edited {new Date(pixel.timestamp).toLocaleString()}</p>
                <p>Color: {pixel.color}</p>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default PixelEditor;
