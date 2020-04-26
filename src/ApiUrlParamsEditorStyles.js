import { css } from 'lit-element';

export default css`
:host {
  display: block;
  margin: 8px 12px;
}

.empty-message {
  font-style: var(--no-info-message-font-style, italic);
  font-size: var(--no-info-message-font-size, 16px);
  color: var(--no-info-message-color, rgba(0, 0, 0, 0.74));
}

[hidden] {
  display: none !important;
}
`;
