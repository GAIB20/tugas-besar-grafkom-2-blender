import {Node} from '../classes/node.ts';

export function setupSlider(selector: string, options: { name: any; precision?: number; min?: number; step?: number; value?: number; max?: number; slide?: any; uiPrecision?: undefined; uiMult?: number; }) {
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

export function createSlider(parent: { innerHTML: string; querySelector: (arg0: string) => any; }, options: { precision?: number; min?: number; step?: number; value?: number; max?: number; slide?: any; name: any; uiPrecision?: undefined; uiMult?: number; }) {
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
      <div class="gman-widget-outer">
        <div class="gman-widget-label">${name}</div>
        <div class="gman-widget-value"></div>
        <input class="gman-widget-slider" type="range" min="${min}" max="${max}" value="${value}" />
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
        fn(event, { value: value * step });
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

export function createObjectHierarcy(node : Node, parent: HTMLElement, setSelectedNode: (node: Node) => void){
    const styleIl : string = 'inline-block p-4 bg-blue-600 text-white rounded';
    const styleButton : string = 'inline-block p-1 px-2 mx-2 bg-green-500 text-white rounded hover:bg-green-700';
    // const styleUl : string = 'fill-current';

    if(parent === null){
        throw new Error("Parent HTML Element is null");
    }
    if(node.children.length === 0){
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
    }
    else{
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