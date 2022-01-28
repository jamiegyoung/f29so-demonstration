/* eslint-disable jsx-a11y/no-static-element-interactions */
import { useEffect, useState } from 'react';
import { HexColorInput, HexColorPicker } from 'react-colorful';
import { hex } from 'wcag-contrast';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { clearEditingPixel } from '../features/wall/wallSlice';
import { LocalPixel } from '../types';
import styles from './PixelEditor.module.css';
import StyledButton from './StylesButton';

type PixelEditorProps = {
  onApply: (pixel: LocalPixel) => void;
};

function PixelEditor({ onApply }: PixelEditorProps) {
  const currentPixel = useAppSelector((state) => state.wall.editingPixel);
  const [newColor, setNewColor] = useState(currentPixel?.color || '#000000');
  const [applyButtonTextColor, setApplyButtonTextColor] = useState('#FFFFFF');
  const dispatch = useAppDispatch();

  function applyChange() {
    if (currentPixel) {
      onApply({
        ...currentPixel,
        color: newColor,
      });
    }
  }

  useEffect(() => {
    if (hex(newColor, '#FFF') <= 4.5) {
      setApplyButtonTextColor('#000');
      return;
    }
    setApplyButtonTextColor('#FFF');
  }, [newColor]);

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
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
      <div
        className={styles.container}
        style={{
          borderColor: newColor,
        }}
        onMouseDown={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
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
    </div>
  );
}

export default PixelEditor;
