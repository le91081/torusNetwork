var x;
var y;
const xmlns = "http://www.w3.org/2000/svg";


function init() {
    x = 50;
    y = 50;
}

function getCIST() {
    const mVal = document.getElementById('m_val').value;
    const nVal = document.getElementById('n_val').value;
    const d = document.getElementById('destination').value;
    const par = { m: mVal, n: nVal, d: d };
    $.ajax({
        url: 'test',
        type: 'POST',
        data: par,
        dataType: 'json',
        success: function (data) {
            console.log(data);
            render(data);
        }
    })
}

function getRandom() {
    const mVal = document.getElementById('m_val').value;
    const nVal = document.getElementById('n_val').value;
    const sink_num = document.getElementById('sink_num').value;
    const par = { m: mVal - 1, n: nVal - 1, number: sink_num };
    $.ajax({
        url: 'random',
        type: 'POST',
        data: par,
        dataType: 'json',
        success: function (data) {
            console.log(data);
            rederRandom(data);
        }
    })
}

function render(torusData) {

    let contentDiv = document.getElementById('content');
    contentDiv.innerHTML = "";
    let mVal = document.getElementById('m_val').value;
    let nVal = document.getElementById('n_val').value;

    cist = torusData.CIST;
    let svg = createSvg(mVal, nVal, 'svg');
    contentDiv.appendChild(svg);
    renderVertex(svg, mVal, nVal);
    renderPath(svg, cist[0].edges, cist[0].color);

    let svg1 = createSvg(mVal, nVal, 'svg1');
    contentDiv.appendChild(svg1);
    renderVertex(svg1, mVal, nVal);
    renderPath(svg1, cist[1].edges, cist[1].color);

    let svg2 = createSvg(mVal, nVal, 'svg2');
    contentDiv.appendChild(svg2);
    renderVertex(svg2, mVal, nVal);
    renderRouting(svg2, torusData.RoutingPath);
}

function rederRandom(data) {
    let contentDiv = document.getElementById('content');
    // contentDiv.innerHTML = "";
    let mVal = document.getElementById('m_val').value;
    let nVal = document.getElementById('n_val').value;

    let svg3 = createSvg(mVal, nVal, 'svg3');
    contentDiv.appendChild(svg3);
    renderVertex(svg3, mVal, nVal);
    renderPathWithCount(svg3, data)
}

function createSvg(m, n, svg_id) {
    let svg = document.createElementNS(xmlns, 'svg');
    svg.setAttributeNS(null, 'width', n * 105);
    svg.setAttributeNS(null, 'height', m * 100);
    svg.setAttributeNS(null, 'class', 'svg');
    svg.id = svg_id;
    return svg;
}


function createCircle(svg, x, y, id) {
    let g = document.createElementNS(xmlns, 'g');
    let circle = document.createElementNS(xmlns, 'circle');
    circle.setAttributeNS(null, 'cx', x);
    circle.setAttributeNS(null, 'cy', y);
    circle.setAttributeNS(null, 'r', '20');
    circle.setAttributeNS(null, 'id', `${svg.id}-${id}`);
    circle.setAttributeNS(null, 'stroke', '#333');
    circle.setAttributeNS(null, 'stroke-width', '2');
    circle.setAttributeNS(null, 'fill', 'rgb(238, 238, 238)');
    g.appendChild(circle);

    let text = document.createElementNS(xmlns, 'text');
    text.textContent = id;
    const textLength = id.length * 8 - 4;
    text.setAttributeNS(null, 'x', x - textLength / 2);
    text.setAttributeNS(null, 'y', y + 5);
    g.appendChild(text);

    svg.appendChild(g);
}

function createPath(svg, id1, id2, color) {
    const v1 = document.getElementById(`${svg.id}-${id1}`);
    const v2 = document.getElementById(`${svg.id}-${id2}`);
    const v1_xid = parseInt(id1.split(',')[0], 10);
    const v1_yid = parseInt(id1.split(',')[1], 10);
    const v2_xid = parseInt(id2.split(',')[0], 10);
    const v2_yid = parseInt(id2.split(',')[1], 10);
    let path = document.createElementNS(xmlns, 'path');
    path.setAttributeNS(null, 'stroke', color);
    path.setAttributeNS(null, 'stroke-width', '4');

    if ((v1_yid - v2_yid) > 1) {
        const M = `M${v2.cx.animVal.value + 15},${v2.cy.animVal.value - 15}`;
        const Q = ` Q${(v1.cx.animVal.value - v2.cx.animVal.value) / 2 + v2.cx.animVal.value} ${v1.cy.animVal.value - 70} `;
        const L = `${v1.cx.animVal.value - 15},${v1.cy.animVal.value - 15}`;
        path.setAttributeNS(null, 'd', M + Q + L);
        path.setAttributeNS(null, 'fill', 'transparent');
    } else if ((v1_xid - v2_xid) > 1) {
        const M = `M${v2.cx.animVal.value + 15},${v2.cy.animVal.value + 15}`;
        const Q = ` Q${v1.cx.animVal.value + 80} ${(v1.cy.animVal.value - v2.cy.animVal.value) / 2 + v2.cy.animVal.value} `;
        const L = `${v1.cx.animVal.value + 15},${v1.cy.animVal.value - 15}`;
        path.setAttributeNS(null, 'd', M + Q + L);
        path.setAttributeNS(null, 'fill', 'transparent');
    } else if (v1_xid > v2_xid) {
        const M = `M${v2.cx.animVal.value},${v2.cy.animVal.value + 20}`;
        const L = `L${v1.cx.animVal.value},${v1.cy.animVal.value - 20}`;
        path.setAttributeNS(null, 'd', M + L);
    } else if (v1_yid > v2_yid) {
        const M = `M${v2.cx.animVal.value + 20},${v2.cy.animVal.value}`;
        const L = `L${v1.cx.animVal.value - 20},${v1.cy.animVal.value}`;
        path.setAttributeNS(null, 'd', M + L);
    } else if ((v2_yid - v1_yid) > 1) {
        const M = `M${v1.cx.animVal.value + 15},${v1.cy.animVal.value - 15}`;
        const Q = ` Q${(v2.cx.animVal.value - v1.cx.animVal.value) / 2 + v1.cx.animVal.value} ${v2.cy.animVal.value - 70} `;
        const L = `${v2.cx.animVal.value - 15},${v2.cy.animVal.value - 15}`;
        path.setAttributeNS(null, 'd', M + Q + L);
        path.setAttributeNS(null, 'fill', 'transparent');
    } else if ((v2_xid - v1_xid) > 1) {
        const M = `M${v1.cx.animVal.value + 15},${v1.cy.animVal.value + 15}`;
        const Q = ` Q${v2.cx.animVal.value + 80} ${(v2.cy.animVal.value - v1.cy.animVal.value) / 2 + v1.cy.animVal.value} `;
        const L = `${v2.cx.animVal.value + 15},${v2.cy.animVal.value - 15}`;
        path.setAttributeNS(null, 'd', M + Q + L);
        path.setAttributeNS(null, 'fill', 'transparent');
    } else if (v2_xid > v1_xid) {
        const M = `M${v1.cx.animVal.value},${v1.cy.animVal.value + 20}`;
        const L = `L${v2.cx.animVal.value},${v2.cy.animVal.value - 20}`;
        path.setAttributeNS(null, 'd', M + L);
    } else {
        const M = `M${v1.cx.animVal.value + 20},${v1.cy.animVal.value}`;
        const L = `L${v2.cx.animVal.value - 20},${v2.cy.animVal.value}`;
        path.setAttributeNS(null, 'd', M + L);
    }

    svg.appendChild(path);
}

function createPathWithCount(svg, id1, id2, count) {
    const v1 = document.getElementById(`${svg.id}-${id1}`);
    const v2 = document.getElementById(`${svg.id}-${id2}`);
    const v1_xid = parseInt(id1.split(',')[0], 10);
    const v1_yid = parseInt(id1.split(',')[1], 10);
    const v2_xid = parseInt(id2.split(',')[0], 10);
    const v2_yid = parseInt(id2.split(',')[1], 10);
    let path = document.createElementNS(xmlns, 'path');
    path.setAttributeNS(null, 'stroke', 'red');
    path.setAttributeNS(null, 'stroke-width', 2 + (1.03 ** count));

    let text = document.createElementNS(xmlns, 'text');
    text.textContent = count;
    text.setAttributeNS(null, 'stroke', 'blue');

    if ((v1_yid - v2_yid) > 1) {
        const M = `M${v2.cx.animVal.value + 15},${v2.cy.animVal.value - 15}`;
        const Q = ` Q${(v1.cx.animVal.value - v2.cx.animVal.value) / 2 + v2.cx.animVal.value} ${v1.cy.animVal.value - 70} `;
        const L = `${v1.cx.animVal.value - 15},${v1.cy.animVal.value - 15}`;
        path.setAttributeNS(null, 'd', M + Q + L);
        path.setAttributeNS(null, 'fill', 'transparent');
        text.setAttributeNS(null, 'x', v2.cx.animVal.value + 15);
        text.setAttributeNS(null, 'y', v2.cy.animVal.value - 15);
    } else if ((v1_xid - v2_xid) > 1) {
        const M = `M${v2.cx.animVal.value + 15},${v2.cy.animVal.value + 15}`;
        const Q = ` Q${v1.cx.animVal.value + 80} ${(v1.cy.animVal.value - v2.cy.animVal.value) / 2 + v2.cy.animVal.value} `;
        const L = `${v1.cx.animVal.value + 15},${v1.cy.animVal.value - 15}`;
        path.setAttributeNS(null, 'd', M + Q + L);
        path.setAttributeNS(null, 'fill', 'transparent');
        text.setAttributeNS(null, 'x', v2.cx.animVal.value + 15);
        text.setAttributeNS(null, 'y', v2.cy.animVal.value + 15);
    } else if (v1_xid > v2_xid) {
        const M = `M${v2.cx.animVal.value},${v2.cy.animVal.value + 20}`;
        const L = `L${v1.cx.animVal.value},${v1.cy.animVal.value - 20}`;
        path.setAttributeNS(null, 'd', M + L);
        text.setAttributeNS(null, 'x', v2.cx.animVal.value);
        text.setAttributeNS(null, 'y', v2.cy.animVal.value + 20);
    } else if (v1_yid > v2_yid) {
        const M = `M${v2.cx.animVal.value + 20},${v2.cy.animVal.value}`;
        const L = `L${v1.cx.animVal.value - 20},${v1.cy.animVal.value}`;
        path.setAttributeNS(null, 'd', M + L);
        text.setAttributeNS(null, 'x', v2.cx.animVal.value + 20);
        text.setAttributeNS(null, 'y', v2.cy.animVal.value);
    } else if ((v2_yid - v1_yid) > 1) {
        const M = `M${v1.cx.animVal.value + 15},${v1.cy.animVal.value - 15}`;
        const Q = ` Q${(v2.cx.animVal.value - v1.cx.animVal.value) / 2 + v1.cx.animVal.value} ${v2.cy.animVal.value - 70} `;
        const L = `${v2.cx.animVal.value - 15},${v2.cy.animVal.value - 15}`;
        path.setAttributeNS(null, 'd', M + Q + L);
        path.setAttributeNS(null, 'fill', 'transparent');
        text.setAttributeNS(null, 'x', v1.cx.animVal.value + 15);
        text.setAttributeNS(null, 'y', v1.cy.animVal.value - 15);
    } else if ((v2_xid - v1_xid) > 1) {
        const M = `M${v1.cx.animVal.value + 15},${v1.cy.animVal.value + 15}`;
        const Q = ` Q${v2.cx.animVal.value + 80} ${(v2.cy.animVal.value - v1.cy.animVal.value) / 2 + v1.cy.animVal.value} `;
        const L = `${v2.cx.animVal.value + 15},${v2.cy.animVal.value - 15}`;
        path.setAttributeNS(null, 'd', M + Q + L);
        path.setAttributeNS(null, 'fill', 'transparent');
        text.setAttributeNS(null, 'x', v1.cx.animVal.value + 15);
        text.setAttributeNS(null, 'y', v1.cy.animVal.value + 15);
    } else if (v2_xid > v1_xid) {
        const M = `M${v1.cx.animVal.value},${v1.cy.animVal.value + 20}`;
        const L = `L${v2.cx.animVal.value},${v2.cy.animVal.value - 20}`;
        path.setAttributeNS(null, 'd', M + L);
        text.setAttributeNS(null, 'x', v1.cx.animVal.value);
        text.setAttributeNS(null, 'y', v1.cy.animVal.value + 20);
    } else {
        const M = `M${v1.cx.animVal.value + 20},${v1.cy.animVal.value}`;
        const L = `L${v2.cx.animVal.value - 20},${v2.cy.animVal.value}`;
        path.setAttributeNS(null, 'd', M + L);
        text.setAttributeNS(null, 'x', v1.cx.animVal.value + 20);
        text.setAttributeNS(null, 'y', v1.cy.animVal.value);
    }

    svg.appendChild(path);



    svg.appendChild(text);

}

function createDirectPath(svg, id1, id2, pathType, color) {
    console.log(id1, id2);
    const v1 = document.getElementById(`${svg.id}-${id1}`);
    const v2 = document.getElementById(`${svg.id}-${id2}`);
    const v1_xid = parseInt(id1.split(',')[0], 10);
    const v1_yid = parseInt(id1.split(',')[1], 10);
    const v2_xid = parseInt(id2.split(',')[0], 10);
    const v2_yid = parseInt(id2.split(',')[1], 10);

    let size = 1;
    if (pathType === 'm') {
        size = 4;
    } else {
        size = 2;
    }

    let path = document.createElementNS(xmlns, 'path');
    path.setAttributeNS(null, 'stroke', color);
    path.setAttributeNS(null, 'stroke-width', size);
    if ((v1_yid - v2_yid) > 1) {
        const M = `M${v2.cx.animVal.value + 15},${v2.cy.animVal.value - 15}`;
        const Q = ` Q${(v1.cx.animVal.value - v2.cx.animVal.value) / 2 + v2.cx.animVal.value} ${v1.cy.animVal.value - 70} `;
        const L = `${v1.cx.animVal.value - 15},${v1.cy.animVal.value - 15}`;
        path.setAttributeNS(null, 'd', M + Q + L);
        path.setAttributeNS(null, 'fill', 'transparent');
        path.setAttributeNS(null, 'marker-start', `url(#${color}-start)`);
    } else if ((v1_xid - v2_xid) > 1) {
        const M = `M${v2.cx.animVal.value + 15},${v2.cy.animVal.value + 15}`;
        const Q = ` Q${v1.cx.animVal.value + 80} ${(v1.cy.animVal.value - v2.cy.animVal.value) / 2 + v2.cy.animVal.value} `;
        const L = `${v1.cx.animVal.value + 15},${v1.cy.animVal.value - 15}`;
        path.setAttributeNS(null, 'd', M + Q + L);
        path.setAttributeNS(null, 'fill', 'transparent');
        path.setAttributeNS(null, 'marker-start', `url(#${color}-start)`);
    } else if (v1_xid > v2_xid) {
        const M = `M${v2.cx.animVal.value},${v2.cy.animVal.value + 20}`;
        const L = `L${v1.cx.animVal.value},${v1.cy.animVal.value - 20}`;
        path.setAttributeNS(null, 'd', M + L);
        path.setAttributeNS(null, 'marker-start', `url(#${color}-start)`);
    } else if (v1_yid > v2_yid) {
        const M = `M${v2.cx.animVal.value + 20},${v2.cy.animVal.value}`;
        const L = `L${v1.cx.animVal.value - 20},${v1.cy.animVal.value}`;
        path.setAttributeNS(null, 'd', M + L);
        path.setAttributeNS(null, 'marker-start', `url(#${color}-start)`);
    } else if ((v2_yid - v1_yid) > 1) {
        const M = `M${v1.cx.animVal.value + 15},${v1.cy.animVal.value - 15}`;
        const Q = ` Q${(v2.cx.animVal.value - v1.cx.animVal.value) / 2 + v1.cx.animVal.value} ${v2.cy.animVal.value - 70} `;
        const L = `${v2.cx.animVal.value - 15},${v2.cy.animVal.value - 15}`;
        path.setAttributeNS(null, 'd', M + Q + L);
        path.setAttributeNS(null, 'fill', 'transparent');
        path.setAttributeNS(null, 'marker-end', `url(#${color})`);
    } else if ((v2_xid - v1_xid) > 1) {
        const M = `M${v1.cx.animVal.value + 15},${v1.cy.animVal.value + 15}`;
        const Q = ` Q${v2.cx.animVal.value + 80} ${(v2.cy.animVal.value - v1.cy.animVal.value) / 2 + v1.cy.animVal.value} `;
        const L = `${v2.cx.animVal.value + 15},${v2.cy.animVal.value - 15}`;
        path.setAttributeNS(null, 'd', M + Q + L);
        path.setAttributeNS(null, 'fill', 'transparent');
        path.setAttributeNS(null, 'marker-end', `url(#${color})`);
    } else if (v2_xid > v1_xid) {
        const M = `M${v1.cx.animVal.value},${v1.cy.animVal.value + 20}`;
        const L = `L${v2.cx.animVal.value},${v2.cy.animVal.value - 20}`;
        path.setAttributeNS(null, 'd', M + L);
        path.setAttributeNS(null, 'marker-end', `url(#${color})`);
    } else {
        const M = `M${v1.cx.animVal.value + 20},${v1.cy.animVal.value}`;
        const L = `L${v2.cx.animVal.value - 20},${v2.cy.animVal.value}`;
        path.setAttributeNS(null, 'd', M + L);
        path.setAttributeNS(null, 'marker-end', `url(#${color})`);
    }

    svg.appendChild(path);
}

function renderVertex(svg, m, n) {
    init();
    for (var i = 0; i < m; i++) {
        for (var j = 0; j < n; j++) {
            const id = `${i},${j}`;
            createCircle(svg, x, y, id);
            x += 100;
        }
        x = 50;
        y += 100;
    }
}

function renderPath(svg, edgeList, color) {
    for (var edge of edgeList) {
        createPath(svg, edge[0], edge[1], color);
    }
}

function renderPathWithCount(svg, edgeList) {
    for (var edge of edgeList) {
        createPathWithCount(svg, edge[0], edge[1], edge[2]);
    }
}

function renderRouting(svg, edgeList) {
    let defs = document.createElementNS(xmlns, 'defs');
    colorList = edgeList.map(e => e.color);
    colorList.filter((v, i) => colorList.indexOf(v) == i).forEach(m => {

        let path = document.createElementNS(xmlns, 'path');
        path.setAttributeNS(null, 'd', 'M0,0 V4 L2,2 Z');
        path.setAttributeNS(null, 'stroke', m);
        path.setAttributeNS(null, 'fill', m);
        let markerEnd = document.createElementNS(xmlns, 'marker');
        markerEnd.setAttributeNS(null, 'id', m);
        markerEnd.setAttributeNS(null, 'orient', 'auto');
        markerEnd.setAttributeNS(null, 'markerWidth', '5');
        markerEnd.setAttributeNS(null, 'markerHeight', '5');
        markerEnd.setAttributeNS(null, 'refX', '2.3');
        markerEnd.setAttributeNS(null, 'refY', '2');
        markerEnd.appendChild(path);
        defs.appendChild(markerEnd);

        let path_copy = document.createElementNS(xmlns, 'path');
        path_copy.setAttributeNS(null, 'd', 'M0,0 V4 L2,2 Z');
        path_copy.setAttributeNS(null, 'stroke', m);
        path_copy.setAttributeNS(null, 'fill', m);
        let marker = document.createElementNS(xmlns, 'marker');
        marker.setAttributeNS(null, 'id', m + '-start');
        marker.setAttributeNS(null, 'orient', 'auto-start-reverse');
        marker.setAttributeNS(null, 'markerWidth', '5');
        marker.setAttributeNS(null, 'markerHeight', '5');
        marker.setAttributeNS(null, 'refX', '2.3');
        marker.setAttributeNS(null, 'refY', '2');
        marker.appendChild(path_copy);
        defs.appendChild(marker);
    });;

    svg.appendChild(defs);

    for (let edge of edgeList) {
        createDirectPath(svg, edge.path[0], edge.path[1], edge.pathType, edge.color);
    }

}


init();

