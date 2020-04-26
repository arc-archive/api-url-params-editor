import { css } from 'lit-element';

export default css`
:host {
  display: block;
}

.param-value .input {
  display: flex;
  flex-direction: row;
  flex: 1;
}

.has-enable-button .docs {
  margin-left: 32px;
}

.value-input {
  display: flex;
  flex-direction: row;
  align-items: center;
  flex: 1;
}

api-property-form-item,
api-url-params-custom-input {
  flex: 1;
}

[hidden] {
  display: none !important;
}

.enable-checkbox {
  margin-right: 8px;
}

.params-title {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.params-title ::slotted(*) {
  margin: 0.83em 8px;
  letter-spacing: 0.1rem;
  font-size: 20px;
  font-weight: 200;
}

:host([compatibility]) .params-title ::slotted(*) {
  font-size: 18px;
  font-weight: 400;
  letter-spacing: initial;
}

.custom-row {
  display: flex;
  flex-direction: row;
  flex: 1;
}

.custom-row.narrow {
  flex-direction: column;
}

.custom-row anypoint-input,
.custom-row api-property-form-item {
  flex: 1;
  width: auto;
}

[data-optional] {
  display: none;
}

:host([optionalopened]) [data-optional] {
  display: flex;
  flex-direction: column;
}

/* Array items */
.value-input.is-array {
  align-items: flex-start;
}

.is-array .enable-checkbox {
  margin-top: 8px;
}

.is-array api-property-form-item {
  margin-top: 8px;
}

.is-array .hint-icon {
  margin-top: 8px;
}

.icon {
  display: inline-block;
  width: 24px;
  height: 24px;
  fill: currentColor;
}
`;
