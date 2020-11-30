function getRandomPeriod() {
    const kVal = document.getElementById('k_val').value;
    const sink_num = document.getElementById('sink_num').value;
    const times_num = document.getElementById('times_num').value;
    if (sink_num.length === 0) {
        setSnackBar('請輸入隨機數');
    } else if (kVal.length === 0) {
        setSnackBar('請輸入K');
    } else {
        const par = { k: kVal, number: sink_num, times: times_num };
        $.ajax({
            url: 'dgnRandomPair',
            type: 'POST',
            data: par,
            dataType: 'json',
            success: function (data) {
                console.log(data);
                edgePeriodObj = data;
                renderPeriod(data);
            },
            beforeSend: function () {
                // setLoader();
            },
            complete: function () {
                $('#loader').hide();
            }
        })
    }
}

function renderPeriod(data) {
    let contentDiv = document.getElementById('content');
    contentDiv.innerHTML = '';
    let div1 = document.createElement('div');
    let slider = document.createElement('input');
    slider.setAttribute('type', 'range');
    slider.setAttribute('id', 'slider');
    slider.setAttribute('min', 1);
    slider.setAttribute('max', data.maxPeriod)
    slider.setAttribute('value', 1)
    slider.setAttribute('oninput', 'changePeriod()');
    div1.appendChild(slider);
    let text = document.createElement('span')
    text.setAttribute('id', 'sliderValue');
    text.textContent = '目前時間點 : 1';
    div1.appendChild(text);
    contentDiv.appendChild(div1);

    let div2 = document.createElement('div');
    const kVal = document.getElementById('k_val').value;

    let svg4 = createSvgWithSize(kVal, 'svg4');
    div2.setAttribute('id', 'periodDiv');
    div2.appendChild(svg4);
    contentDiv.appendChild(div2);
    let edgePeriodList = edgePeriodObj.edgePeriodList;
    let periodList = edgePeriodList.find(e => e.P == 1).PeriodList;
    
    renderVertex(svg4, mVal, nVal);
    // renderPathWithCount(svg4, periodList, 'period');
    renderBidirectPeriodPath(svg4, periodList, 'period');
    let div3 = document.createElement('div');
    div3.setAttribute('id', 'pathText');
    contentDiv.appendChild(div3);
    renderPathText(periodList);
}

function createSvgWithSize(k, svg_id) {
    let svg = document.createElementNS(xmlns, 'svg');
    svg.setAttributeNS(null, 'width', k * 2 * 115);
    svg.setAttributeNS(null, 'height', k * 2 * 115);
    svg.setAttributeNS(null, 'class', 'svg');
    svg.id = svg_id;
    return svg;
}