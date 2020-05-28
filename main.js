const buttons = document.querySelectorAll('.mdc-button');
for (const button of buttons) {
  mdc.ripple.MDCRipple.attachTo(button);
}

const textFields = document.querySelectorAll('.mdc-text-field');
for (const textField of textFields) {
  mdc.textField.MDCTextField.attachTo(textField);
}

const gridSizeSlider = new mdc.slider.MDCSlider(document.querySelector('#grid-size-slider'));
gridSizeSlider.listen('MDCSlider:input', () => setGridSize(parseInt(gridSizeSlider.value)));


const scaleNoiseSlider = new mdc.slider.MDCSlider(document.querySelector("#scale-noise-slider"));
scaleNoiseSlider.listen('MDCSlider:change', () => {noiseScale = parseFloat(scaleNoiseSlider.value); regeneratePerlinNoiseArray();});