const xmlns = "http://www.w3.org/2000/svg";
let marginVertexAry = [];

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
            renderGaussian(data);
        },
    })
}

function mod(n, m) {
    return ((n % m) + m) % m;
}

function storeMarginVertex(id) {
    if (!marginVertexAry.includes(id)) {
        marginVertexAry.push(id);
    }
}

function renderGaussian(data) {
    marginVertexAry = [];
    let contentDiv = document.getElementById('content');
    contentDiv.innerHTML = "";
    const kVal = parseInt(document.getElementById('k_val').value);
    const cist = data.CIST;

    // 愚蠢的解決線把點蓋住的方法
    let svg = createSvgWithSize(kVal, 'svg');
    contentDiv.appendChild(svg);
    vSet = renderGaussianVertex(svg, kVal);
    svg.appendChild(vSet);
    renderPath(svg, cist[0].edges, cist[0].color, kVal);
    svg.appendChild(vSet);

    let svg1 = createSvgWithSize(kVal, 'svg1');
    contentDiv.appendChild(svg1);
    vSet = renderGaussianVertex(svg1, kVal);
    svg1.appendChild(vSet);
    renderPath(svg1, cist[1].edges, cist[1].color, kVal);
    svg1.appendChild(vSet);

    let svg2 = createSvgWithSize(kVal, 'svg2');
    contentDiv.appendChild(svg2);
    vSet2 = renderGaussianVertex(svg2, kVal);
    svg2.appendChild(vSet2);
    renderRouting(svg2, data.RoutingPath, kVal);
    svg2.appendChild(vSet2);

}

function renderGaussianVertex(svg, k) {
    let n = 2 * k * k + 2 * k + 1;
    let g = document.createElementNS(xmlns, 'g');
    x = 100;
    y = svg.height.animVal.value / 2;
    let temp = y;
    for (let i = 1; i <= 2 * k + 1; i += 2) {
        let t = (i - 1) / 2;
        let id = mod((-(k - t) * k % n + (k + 1) * t), n);
        storeMarginVertex(id);
        temp = y;
        for (let j = 0; j < i; j++) {
            if (j === (i - 1)) {
                storeMarginVertex(id);
            }
            createCircle(svg, g, x, y, id.toString());
            id = mod((id - (k + 1)), n);
            y += 80;
        }
        x += 80;
        y = temp - 80;
    }
    y = temp + 80;
    for (let i = 2 * k - 1; i >= 1; i -= 2) {
        let t = (i - 1) / 2;
        let id = mod(((k - t) * k % n + (k + 1) * t), n);
        storeMarginVertex(id);
        temp = y;
        for (let j = 0; j < i; j++) {
            if (j === (i - 1)) {
                storeMarginVertex(id);
            }
            createCircle(svg, g, x, y, id.toString());
            id = mod((id - (k + 1)), n);
            y += 80;
        }
        x += 80;
        y = temp + 80;
    }
    // console.log(marginVertexAry);
    return g;
}
function renderPath(svg, edgeList, color, k) {
    let g = document.createElementNS(xmlns, 'g');
    for (var edge of edgeList) {
        // console.log(edge);
        createPath(svg, g, edge[0], edge[1], color, k);
    }
    svg.appendChild(g);
}

function renderRouting(svg, edgeList, k) {
    // console.log(edgeList)
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
    let g = document.createElementNS(xmlns, 'g');
    for (let edge of edgeList) {
        createDirectPath(svg, k, g, edge.path[0], edge.path[1], edge.pathType, edge.color);
    }
    svg.appendChild(g);
}

function createDirectPath(svg, k, g, id1, id2, pathType, color) {
    const v1 = document.getElementById(`${svg.id}-${id1}`);
    const v2 = document.getElementById(`${svg.id}-${id2}`);
    const n = 2 * k * k + 2 * k + 1;
    let size = 1;
    if (pathType === 'm') {
        size = 4;
    } else {
        size = 2;
    }

    let path = document.createElementNS(xmlns, 'path');
    path.setAttributeNS(null, 'stroke', color);
    path.setAttributeNS(null, 'stroke-width', size);

    d = mod((parseInt(id2) - parseInt(id1)), n);
    // console.log(id1, id2, d);

    if (d === k) {
        // console.log('from: ' + id1, 'To: ' + id2, 'D:' + d, 'E')
        const M = `M${v1.cx.animVal.value},${v1.cy.animVal.value}`;
        const H = `H${v1.cx.animVal.value + 65}`;
        path.setAttributeNS(null, 'd', M + H);
        path.setAttributeNS(null, 'marker-end', `url(#${color})`);
        g.appendChild(path);

        if (marginVertexAry.includes(parseInt(id1))) {
            createWraparoungCircle(svg, g, v1.cx.animVal.value + 80, v1.cy.animVal.value, id2);
            let path1 = document.createElementNS(xmlns, 'path');
            path1.setAttributeNS(null, 'stroke', color);
            path1.setAttributeNS(null, 'stroke-width', size);
            const M1 = `M${v2.cx.animVal.value - 15},${v2.cy.animVal.value}`;
            const H1 = `H${v2.cx.animVal.value - 65}`;
            path1.setAttributeNS(null, 'd', M1 + H1);
            path1.setAttributeNS(null, 'marker-start', `url(#${color}-start)`);
            g.appendChild(path1);
            createWraparoungCircle(svg, g, v2.cx.animVal.value - 80, v2.cy.animVal.value, id1);
        }

    } else if (d === (k + 1)) {
        // console.log('from: ' + id1, 'To: ' + id2, 'D:' + d, 'N')
        const M = `M${v1.cx.animVal.value},${v1.cy.animVal.value}`;
        const V = `V${v1.cy.animVal.value - 65}`;
        path.setAttributeNS(null, 'd', M + V);
        path.setAttributeNS(null, 'marker-end', `url(#${color})`);
        g.appendChild(path);

        if (marginVertexAry.includes(parseInt(id1))) {
            createWraparoungCircle(svg, g, v1.cx.animVal.value, v1.cy.animVal.value - 80, id2);
            let path1 = document.createElementNS(xmlns, 'path');
            path1.setAttributeNS(null, 'stroke', color);
            path1.setAttributeNS(null, 'stroke-width', size);
            const M1 = `M${v2.cx.animVal.value},${v2.cy.animVal.value + 15}`;
            const V1 = `V${v2.cy.animVal.value + 65}`;
            path1.setAttributeNS(null, 'd', M1 + V1);
            path1.setAttributeNS(null, 'marker-start', `url(#${color}-start)`);
            g.appendChild(path1);
            createWraparoungCircle(svg, g, v2.cx.animVal.value, v2.cy.animVal.value + 80, id1);
        }
    } else if ((parseInt(id2) - parseInt(id1)) === -k || mod(parseInt(id1) - parseInt(id2), n) === k) {
        // console.log('from: ' + id1, 'To: ' + id2, 'D:' + d, 'W')
        const M = `M${v1.cx.animVal.value},${v1.cy.animVal.value}`;
        const H = `H${v1.cx.animVal.value - 65}`;
        path.setAttributeNS(null, 'd', M + H);
        path.setAttributeNS(null, 'marker-end', `url(#${color})`);
        g.appendChild(path);

        if (marginVertexAry.includes(parseInt(id1))) {
            createWraparoungCircle(svg, g, v1.cx.animVal.value - 80, v1.cy.animVal.value, id2);
            let path1 = document.createElementNS(xmlns, 'path');
            path1.setAttributeNS(null, 'stroke', color);
            path1.setAttributeNS(null, 'stroke-width', size);
            const M1 = `M${v2.cx.animVal.value + 15},${v2.cy.animVal.value}`;
            const H1 = `H${v2.cx.animVal.value + 65}`;
            path1.setAttributeNS(null, 'd', M1 + H1);
            path1.setAttributeNS(null, 'marker-start', `url(#${color}-start)`);
            g.appendChild(path1);
            createWraparoungCircle(svg, g, v2.cx.animVal.value + 80, v2.cy.animVal.value, id1);
        }

    } else {
        // console.log('from: ' + id1, 'To: ' + id2, 'D:' + d, 'S')
        const M = `M${v1.cx.animVal.value},${v1.cy.animVal.value}`;
        const V = `V${v1.cy.animVal.value + 65}`;
        path.setAttributeNS(null, 'd', M + V);
        path.setAttributeNS(null, 'marker-end', `url(#${color})`);
        g.appendChild(path);

        if (marginVertexAry.includes(parseInt(id1))) {
            createWraparoungCircle(svg, g, v1.cx.animVal.value, v1.cy.animVal.value + 80, id2);
            let path1 = document.createElementNS(xmlns, 'path');
            path1.setAttributeNS(null, 'stroke', color);
            path1.setAttributeNS(null, 'stroke-width', size);
            const M1 = `M${v2.cx.animVal.value},${v2.cy.animVal.value - 15}`;
            const V1 = `V${v2.cy.animVal.value - 65}`;
            path1.setAttributeNS(null, 'd', M1 + V1);
            path1.setAttributeNS(null, 'marker-start', `url(#${color}-start)`);
            g.appendChild(path1);
            createWraparoungCircle(svg, g, v2.cx.animVal.value, v2.cy.animVal.value - 80, id1);
        }

    }
}

function createSvgWithSize(k, svg_id) {
    let svg = document.createElementNS(xmlns, 'svg');
    svg.setAttributeNS(null, 'width', k * 2 * 115);
    svg.setAttributeNS(null, 'height', k * 2 * 115);
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

function createWraparoungCircle(svg, pg, x, y, id) {
    let g = document.createElementNS(xmlns, 'g');
    // let circle = document.createElementNS(xmlns, 'circle');
    // circle.setAttributeNS(null, 'cx', x);
    // circle.setAttributeNS(null, 'cy', y);
    // circle.setAttributeNS(null, 'r', '15');
    // circle.setAttributeNS(null, 'id', `${svg.id}-${id}-1`);
    // circle.setAttributeNS(null, 'stroke', '#333');
    // circle.setAttributeNS(null, 'stroke-width', '2');
    // circle.setAttributeNS(null, 'fill', 'rgb(238, 238, 238)');
    // g.appendChild(circle);

    let text = document.createElementNS(xmlns, 'text');
    text.textContent = id;
    const textLength = id.length * 8;
    text.setAttributeNS(null, 'x', x - textLength / 2);
    text.setAttributeNS(null, 'y', y + 6);
    g.appendChild(text);

    pg.appendChild(g);
}

function createPath(svg, g, id1, id2, color, k) {
    const v1 = document.getElementById(`${svg.id}-${id1}`);
    const v2 = document.getElementById(`${svg.id}-${id2}`);
    let path = document.createElementNS(xmlns, 'path');
    path.setAttributeNS(null, 'stroke', color);
    path.setAttributeNS(null, 'stroke-width', '4');
    if (marginVertexAry.includes(parseInt(id1))) {
        d = mod((parseInt(id2) - parseInt(id1)), 2 * k * k + 2 * k + 1);
        // console.log(id1, id2, d);

        if (d === k) {
            const M = `M${v1.cx.animVal.value},${v1.cy.animVal.value}`;
            const H = `H${v1.cx.animVal.value + 65}`;
            path.setAttributeNS(null, 'd', M + H);
            g.appendChild(path);
            createWraparoungCircle(svg, g, v1.cx.animVal.value + 80, v1.cy.animVal.value, id2);

            let path1 = document.createElementNS(xmlns, 'path');
            path1.setAttributeNS(null, 'stroke', color);
            path1.setAttributeNS(null, 'stroke-width', '4');
            const M1 = `M${v2.cx.animVal.value},${v2.cy.animVal.value}`;
            const H1 = `H${v2.cx.animVal.value - 65}`;
            path1.setAttributeNS(null, 'd', M1 + H1);
            g.appendChild(path1);
            createWraparoungCircle(svg, g, v2.cx.animVal.value - 80, v2.cy.animVal.value, id1);

        } else if (d === (k + 1)) {
            const M = `M${v1.cx.animVal.value},${v1.cy.animVal.value}`;
            const V = `V${v1.cy.animVal.value - 65}`;
            path.setAttributeNS(null, 'd', M + V);
            g.appendChild(path);
            createWraparoungCircle(svg, g, v1.cx.animVal.value, v1.cy.animVal.value - 80, id2);

            let path1 = document.createElementNS(xmlns, 'path');
            path1.setAttributeNS(null, 'stroke', color);
            path1.setAttributeNS(null, 'stroke-width', '4');
            const M1 = `M${v2.cx.animVal.value},${v2.cy.animVal.value}`;
            const V1 = `V${v2.cy.animVal.value + 65}`;
            path1.setAttributeNS(null, 'd', M1 + V1);
            g.appendChild(path1);
            createWraparoungCircle(svg, g, v2.cx.animVal.value, v2.cy.animVal.value + 80, id1);
        }
    } else {
        const M = `M${v2.cx.animVal.value},${v2.cy.animVal.value}`;
        const L = `L${v1.cx.animVal.value},${v1.cy.animVal.value}`;
        path.setAttributeNS(null, 'd', M + L);
        g.appendChild(path);

    }
}