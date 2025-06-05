import { render } from 'preact'
import './index.css'
import { App } from './app'

const appRoot = document.getElementById('app');

if (appRoot) {
    render(<App />, appRoot);
} else {
    console.error('Root element with ID "app" not found in the document.');
}