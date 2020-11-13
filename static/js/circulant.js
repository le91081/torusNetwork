const xmlns = "http://www.w3.org/2000/svg";

function getCIST() {
    const kVal = document.getElementById('k_val').value;
    const d = document.getElementById('destination').value;
    const par = { k: kVal, d: d };

    $.ajax({
        url: 'DNGCirculant',
        type: 'POST',
        data: par,
        dataType: 'json',
        success: function (data) {
            // console.log(data);
            draw(data);
        },
    })
}

function draw(data) {
    let contentDiv = document.getElementById('content');
    contentDiv.innerHTML = "";
    const kVal = document.getElementById('k_val').value;
    const cist = data.CIST;

    // 愚蠢的解決線把點蓋住的方法
    let svg = createSvg('svg');
    contentDiv.appendChild(svg);
    vSet = renderVertex(svg, kVal);
    svg.appendChild(vSet);
    renderPath(svg, cist[0].edges, cist[0].color);
    svg.appendChild(vSet);

    let svg1 = createSvg('svg1');
    contentDiv.appendChild(svg1);
    vSet1 = renderVertex(svg1, kVal);
    svg1.appendChild(vSet1);
    renderPath(svg1, cist[1].edges, cist[1].color);
    svg1.appendChild(vSet1);

    let svg2 = createSvg('svg2');
    contentDiv.appendChild(svg2);
    vSet2 = renderVertex(svg2, kVal);
    svg2.appendChild(vSet2);
    renderRouting(svg2, data.RoutingPath);
    // svg2.appendChild(vSet2);
}

function renderVertex(svg, k) {
    x = 500;
    y = 100;
    r = 400;

    n = 2 * k * k + 2 * k + 1;

    let g = document.createElementNS(xmlns, 'g');
    for (let i = 0; i < n; i++) {
        let id = (i * k) % n;
        createCircle(svg, g, x, y, id.toString());
        let a = (r * Math.cos(Math.PI / 180 * -(360 / n) * (i + 1)));
        let b = (r * Math.sin(Math.PI / 180 * -(360 / n) * (i + 1)));
        x = 500 - b;
        y = 500 - a;
    }
    return g;
}

function renderPath(svg, edgeList, color) {
    let g = document.createElementNS(xmlns, 'g');
    for (var edge of edgeList) {
        // console.log(edge);
        createPath(svg, g, edge[0], edge[1], color);
    }
    svg.appendChild(g);
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
        // console.log(edge.path)
        createDirectPath(svg, edge.path[0], edge.path[1], edge.pathType, edge.color);
    }

}

function createDirectPath(svg, id1, id2, pathType, color) {
    const v1 = document.getElementById(`${svg.id}-${id1}`);
    const v2 = document.getElementById(`${svg.id}-${id2}`);
    const v1_xid = parseInt(id1, 10);
    const v2_xid = parseInt(id2, 10);

    let size = 1;
    if (pathType === 'm') {
        size = 4;
    } else {
        size = 2;
    }

    let path = document.createElementNS(xmlns, 'path');
    path.setAttributeNS(null, 'stroke', color);
    path.setAttributeNS(null, 'stroke-width', size);

    if (v1_xid > v2_xid) {
        const M = `M${v2.cx.animVal.value},${v2.cy.animVal.value}`;
        const L = `L${v1.cx.animVal.value},${v1.cy.animVal.value}`;
        path.setAttributeNS(null, 'd', M + L);
        path.setAttributeNS(null, 'marker-start', `url(#${color}-start)`);
    } else if (v2_xid > v1_xid) {
        const M = `M${v1.cx.animVal.value},${v1.cy.animVal.value}`;
        const L = `L${v2.cx.animVal.value},${v2.cy.animVal.value}`;
        path.setAttributeNS(null, 'd', M + L);
        path.setAttributeNS(null, 'marker-end', `url(#${color})`);
    }

    svg.appendChild(path);
}

function createSvg(svg_id) {
    let svg = document.createElementNS(xmlns, 'svg');
    svg.setAttributeNS(null, 'width', 1000);
    svg.setAttributeNS(null, 'height', 1000);
    svg.setAttributeNS(null, 'class', 'svg');
    svg.id = svg_id;
    return svg;
}

function createCircle(svg, pg, x, y, id) {
    let g = document.createElementNS(xmlns, 'g');
    let circle = document.createElementNS(xmlns, 'circle');
    circle.setAttributeNS(null, 'cx', x);
    circle.setAttributeNS(null, 'cy', y);
    circle.setAttributeNS(null, 'r', '15');
    circle.setAttributeNS(null, 'id', `${svg.id}-${id}`);
    circle.setAttributeNS(null, 'stroke', '#333');
    circle.setAttributeNS(null, 'stroke-width', '3');
    circle.setAttributeNS(null, 'fill', 'rgb(238, 238, 238)');
    g.appendChild(circle);

    let text = document.createElementNS(xmlns, 'text');
    text.textContent = id;
    const textLength = id.length * 8;
    text.setAttributeNS(null, 'x', x - textLength / 2);
    text.setAttributeNS(null, 'y', y + 6);
    g.appendChild(text);

    pg.appendChild(g);
}

function createPath(svg, g, id1, id2, color) {
    const v1 = document.getElementById(`${svg.id}-${id1}`);
    const v2 = document.getElementById(`${svg.id}-${id2}`);

    let path = document.createElementNS(xmlns, 'path');
    path.setAttributeNS(null, 'stroke', color);
    path.setAttributeNS(null, 'stroke-width', '4');

    const M = `M${v2.cx.animVal.value},${v2.cy.animVal.value}`;
    const L = `L${v1.cx.animVal.value},${v1.cy.animVal.value}`;
    path.setAttributeNS(null, 'd', M + L);

    g.appendChild(path);
}