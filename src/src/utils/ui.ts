import {Node} from '../classes/node.ts';

export function setupSlider(selector: string, options: {
    name: any;
    precision?: number;
    min?: number;
    step?: number;
    value?: number;
    max?: number;
    slide?: any;
    uiPrecision?: undefined;
    uiMult?: number;
}) {
    let parent = document.querySelector(selector);
    if (!parent) {
        // like jquery don't fail on a bad selector
        return;
    }
    if (!options.name) {
        options.name = selector.substring(1);
    }
    return createSlider(parent, options); // eslint-disable-line
}

export function createSlider(parent: { innerHTML: string; querySelector: (arg0: string) => any; }, options: {
    precision?: number;
    min?: number;
    step?: number;
    value?: number;
    max?: number;
    slide?: any;
    name: any;
    uiPrecision?: undefined;
    uiMult?: number;
}) {
    let precision = options.precision || 0;
    let min = options.min || 0;
    let step = options.step || 1;
    let value = options.value || 0;
    let max = options.max || 1;
    let fn = options.slide;
    let name = options.name;
    let uiPrecision = options.uiPrecision === undefined ? precision : options.uiPrecision;
    let uiMult = options.uiMult || 1;

    min /= step;
    max /= step;
    value /= step;

    parent.innerHTML = `
      <div class="flex flex-col">
        <div class="gman-widget-label">${name}</div>
        <div class="flex gap-2">
        <input class="gman-widget-slider" type="range" min="${min}" max="${max}" value="${value}" />
        <div class="gman-widget-value"></div>
        </div>
      </div>
    `;
    let valueElem = parent.querySelector(".gman-widget-value");
    let sliderElem = parent.querySelector(".gman-widget-slider");

    function updateValue(value: number) {
        valueElem.textContent = (value * step * uiMult).toFixed(uiPrecision);
    }

    updateValue(value);

    function handleChange(event: { target: { value: string; }; }) {
        let value = parseInt(event.target.value);
        updateValue(value);
        fn(event, {value: value * step});
    }

    sliderElem.addEventListener('input', handleChange);
    sliderElem.addEventListener('change', handleChange);

    return {
        elem: parent,
        updateValue: (v: number) => {
            v /= step;
            sliderElem.value = v;
            updateValue(v);
        },
    };
}

export function setupColorPicker(selector: string, options: { name: any; value: string, picker?: any }) {
    console.log("tes")
    let parent = document.querySelector(selector);
    if (!parent) {
        // like jquery don't fail on a bad selector
        return;
    }
    if (!options.name) {
        options.name = selector.substring(1);
    }
    return createColorPicker(parent, options); // eslint-disable-line
}

export function createColorPicker(parent: { innerHTML: string; querySelector: (arg0: string) => any; }, options: {
    name: any;
    value?: string;
    picker?: any
}) {
    let name = options.name;
    let value = options.value || '#000';
    let fn = options.picker;

    parent.innerHTML = `
      <div class="flex flex-col">
        <div class="gman-widget-label">${name}</div>
        <div class="flex gap-2">
        <input class="gman-widget-picker" type="color" value="${value}" />
        <div class="gman-widget-value"></div>
        </div>
      </div>
    `;
    let valueElem = parent.querySelector(".gman-widget-value");
    let pickerElem = parent.querySelector(".gman-widget-picker");

    function updateValue(value: string) {
        valueElem.textContent = value;
    }

    updateValue(value);

    function handleChange(event: { target: { value: string; }; }) {
        updateValue(event.target.value);
        console.log(event.target.value);
        fn(event, {value: event.target.value});
    }

    pickerElem.addEventListener('input', handleChange);
    pickerElem.addEventListener('change', handleChange);

    return {
        elem: parent,
        updateValue: (v: string) => {
            pickerElem.value = v;
            updateValue(v);
        },
    };
}

export function createButton(parent: HTMLElement | null, options: { name: any; onClick: any; }) {
    if (parent != null) {
        let button = document.createElement('button');
        button.textContent = options.name;
        button.className = 'gman-widget-button bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2';
        button.addEventListener('click', options.onClick);

        parent.appendChild(button);

        return button;
    }

}

export function createObjectHierarcy(node: Node, parent: HTMLElement, setSelectedNode: (node: Node) => void) {
    // parent.innerHTML = ''
    const styleIl: string = 'inline-block w-full p-4 bg-purple-900 text-white rounded';
    const styleButton: string = 'inline-block p-1 px-2 mx-2 bg-blue-600 text-white rounded hover:bg-blue-700';
    // const styleUl : string = 'fill-current';

    if (node.children.length === 0) {
        const il = document.createElement('il');
        il.innerHTML = node.name; // node.name
        il.className = styleIl;
        parent.appendChild(il);

        const button = document.createElement('button');
        button.textContent = 'select';
        button.className = styleButton;
        button.addEventListener('click', () => {
            setSelectedNode(node)
        })
        il.appendChild(button);
    } else {
        const il = document.createElement('il');
        il.innerHTML = node.name; // node.name
        il.className = styleIl;
        parent.appendChild(il);

        const button = document.createElement('button');
        button.textContent = 'select';
        button.className = styleButton;
        button.addEventListener('click', () => {
            setSelectedNode(node)
        })
        il.appendChild(button);

        const ul = document.createElement('ul');
        // ul.className = styleUl;
        ul.id = parent + "child";
        il.appendChild(ul);

        node.children.forEach(element => {
            createObjectHierarcy(element, ul, setSelectedNode);
        });
    }

}

export function clearPointLightProp() {
    document.getElementById('lightPosX')!.innerHTML = ''
    document.getElementById('lightPosY')!.innerHTML = ''
    document.getElementById('lightPosZ')!.innerHTML = ''
    document.getElementById('lightAttA')!.innerHTML = ''
    document.getElementById('lightAttB')!.innerHTML = ''
    document.getElementById('lightAttC')!.innerHTML = ''
}

export function clearDirectionalLightProp() {
    document.getElementById('lightDirX')!.innerHTML = ''
    document.getElementById('lightDirY')!.innerHTML = ''
    document.getElementById('lightDirZ')!.innerHTML = ''
}

export function clearBasicMaterialProp() {
    document.getElementById('basicProp')!.innerHTML = ''
}

export function showPhongMaterialProp() {
    const elements = document.getElementsByClassName('phong-properties');
    for (let i = 0; i < elements.length; i++) {
        elements[i].classList.remove('hidden');
    }
}

export function clearPhongMaterialProp() {
    document.getElementById('diffuseColor')!.innerHTML = ''
    document.getElementById('ambientColor')!.innerHTML = ''
    document.getElementById('specularColor')!.innerHTML = ''
    document.getElementById('shininess')!.innerHTML = ''
    document.getElementById('displacementBias')!.innerHTML = ''
    document.getElementById('displacementFactor')!.innerHTML = ''
    const elements = document.getElementsByClassName('phong-properties');
    for (let i = 0; i < elements.length; i++) {
        elements[i].classList.add('hidden');
    }
}

export function clearNodeProp() {
    const elements = document.getElementsByClassName('selected-node-prop');
    for (let i = 0; i < elements.length; i++) {
        elements[i].classList.add('hidden');
    }
}

export function showNodeProp() {
    const elements = document.getElementsByClassName('selected-node-prop');
    for (let i = 0; i < elements.length; i++) {
        elements[i].classList.remove('hidden');
    }
}