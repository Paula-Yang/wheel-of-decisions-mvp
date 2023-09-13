import styled, { createGlobalStyle } from 'styled-components';


// Define global styles (similar to :root in CSS)
export const GlobalStyles = createGlobalStyle`
  :root {
    --wheel-font: 'Arial', sans-serif;
    --wheel-size: 450px;
    --wheel-border-size: 8px;
    --wheel-color: hsl(212, 85%, 45%);
    --neutral-color: #f8f8f8;
    --highlight-color: hsl(42, 90%, 50%);
    --PI: 3.14159265358979;
    --nb-item: 0;
    --item-nb: 0;
    --selected-item: 0;
    --nb-turn: 5;
    --spinning-duration: 5s;
    --reset-duration: 0.3s;
  }
`;

export const WheelContainer = styled.div`
  display: block;
  position: relative;
  box-sizing: content-box;
  width: calc(var(--wheel-size) + 2 * var(--wheel-border-size));
  height: calc(var(--wheel-size) + 2 * var(--wheel-border-size));
  padding: 4px;
  margin: 2em auto;
  background-color: var(--neutral-color);
  border: solid var(--highlight-color) 3px;
  border-radius: 50%;
  user-select: none;
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);

  &::before {
    content: '';
    display: block;
    position: absolute;
    width: 0;
    height: 0;
    top: 50%;  /* Center the triangle vertically */
    right: -20px;
    transform: translateY(-50%);

    /* Triangle creation using borders */
    border-top: 15px solid transparent;
    border-bottom: 15px solid transparent;
    border-right: 25px solid var(--wheel-color);
  }
`;

export const WheelStyled = styled.div`
  display: block;
  position: relative;
  box-sizing: content-box;
  margin: auto;
  width: var(--wheel-size);
  height: var(--wheel-size);
  overflow: hidden;
  border-radius: 50%;
  border: solid var(--wheel-color) var(--wheel-border-size);
  background: linear-gradient(45deg, var(--wheel-color), var(--highlight-color));
  transition: transform var(--reset-duration);
  transform: rotate(0deg);
  cursor: pointer;

  &.spinning {
    transition: transform var(--spinning-duration);
    transform: rotate(calc(var(--nb-turn) * 360deg + (-360deg * var(--selected-item) / var(--nb-item, 1))));
  }

  &::after {
    display: block;
    position: absolute;
    content: '';
    background-color: var(--neutral-color);
    width: 40px;
    height: 40px;
    z-index: 2;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    border: 3px solid var(--highlight-color);
  }
`;

export const WheelItem = styled.div`
  display: block;
  position: absolute;
  box-sizing: border-box;
  top: 50%;
  left: 50%;
  width: 50%;
  transform-origin: center left;
  transform: translateY(-50%) rotate(calc(var(--item-nb) * (360deg / var(--nb-item, 1))));
  color: var(--neutral-color);
  text-align: right;
  padding: 0 30px 0 55px;
  font-family: var(--wheel-font);
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);

  &:before {
    content: ' ';
    display: block;
    position: absolute;
    box-sizing: border-box;
    z-index: -1;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    opacity: 0.5;
    --slice-max-width: calc(var(--PI) * var(--wheel-size) + var(--wheel-size) / 2);
    --slice-width: calc((var(--slice-max-width) / var(--nb-item)) - var(--wheel-border-size));
    border: solid transparent calc(var(--slice-width) / 2);
    border-left: solid transparent 0;
    border-right: solid rgba(255, 255, 255, 0.2) calc(var(--wheel-size) / 2);
  }
`;

export const SpinButton = styled.button`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 5;
  padding: 15px 25px;
  background-color: var(--highlight-color);
  border: none;
  border-radius: 50px;
  font-size: 18px;
  cursor: pointer;
  outline: none;
  color: var(--neutral-color);
  transition: background-color 0.3s, transform 0.2s;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: var(--wheel-color);
    transform: translate(-50%, -50%) scale(1.05);
  }
`;

export const Wrapper = styled.div`
  padding: 3px;
  margin: auto;
`;
