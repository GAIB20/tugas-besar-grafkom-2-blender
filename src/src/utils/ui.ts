import {Node} from '../classes/node';

export function setupSlider(selector: string, options: { name: any; precision?: number; min?: number; step?: number; value?: number; max?: number; slide?: any; uiPrecision?: undefined; uiMult?: number; }) {
    var parent = document.querySelector(selector);
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
    var precision = options.precision || 0;
    var min = options.min || 0;
    var step = options.step || 1;
    var value = options.value || 0;
    var max = options.max || 1;
    var fn = options.slide;
    var name = options.name;
    var uiPrecision = options.uiPrecision === undefined ? precision : options.uiPrecision;
    var uiMult = options.uiMult || 1;

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
    var valueElem = parent.querySelector(".gman-widget-value");
    var sliderElem = parent.querySelector(".gman-widget-slider");

    function updateValue(value: number) {
        valueElem.textContent = (value * step * uiMult).toFixed(uiPrecision);
    }

    updateValue(value);

    function handleChange(event: { target: { value: string; }; }) {
        var value = parseInt(event.target.value);
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

export function createObjectHierarcy(node : Node, parent: HTMLElement){
    const styleIl : string = 'inline-block p-4 bg-blue-600 text-white rounded';
    const styleButton : string = 'inline-block p-1 px-2 mx-2 bg-green-500 text-white rounded hover:bg-green-700';
    const styleUl : string = 'fill-current';

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
            // TODO
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
            // TODO
        })
        il.appendChild(button);

        const ul = document.createElement('ul');
        // ul.className = styleUl;
        ul.id = parent + "child";
        il.appendChild(ul);

        node.children.forEach(element => {
            createObjectHierarcy(element, ul);
        });
    }

}