import { useState } from 'preact/hooks';
import init, { update_button_text } from './wasm/wasm_api.js';

export function App() {
  const [text, setText] = useState('Click me!');
  
  const handleClick = async () => {
    await init();
    const newText = update_button_text();
    setText(newText);
  };

  return (
    <div>
      <div>Rust WASM project demo</div>
      <button onClick={handleClick}>{text}</button>
    </div>
  );
}
