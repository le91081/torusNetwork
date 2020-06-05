from flask import Flask, render_template, request
from torusNetwork import TorusNetwork
import random
import json

app = Flask(__name__)


@app.route('/test', methods=['POST'])
def CIST():
    m_val = request.form.get('m')
    n_val = request.form.get('n')
    d = request.form.get('d').split(',')
    t = TorusNetwork(int(m_val), int(n_val))
    x, y = t.getCIST()
    cist = [{'color': 'red', 'edges': x}, {'color': 'blue', 'edges': y}]
    r, b = t.getCISTs()
    t.getProtectionRouting(r, b, (int(d[0]), int(d[1])))
    mainPath, snhPath = t.getRoutingPath()
    totalPath = []
    for m in mainPath:
        color = ''
        if m in x or m[::-1] in x:
            color = 'red'
        elif m or m[::-1] in y:
            color = 'blue'

        par = {'path': m, 'pathType': 'm', 'color': color}
        totalPath.append(par)

    for s in snhPath:
        color = 'gray'
        par = {'path': s, 'pathType': 's', 'color': color}
        totalPath.append(par)

    data = {'CIST': cist, 'RoutingPath': totalPath}

    return json.dumps(data)


@app.route('/random', methods=['POST'])
def randomSink():
    m_val = request.form.get('m')
    n_val = request.form.get('n')
    n = request.form.get('number')

    sinkList = []
    while len(sinkList) < int(n):
        node = (random.randint(0, int(m_val)), random.randint(0, int(n_val)))
        if node not in sinkList:
            sinkList.append(node)

    pathDict = {}
    for d in sinkList:
        t = TorusNetwork(int(m_val)+1, int(n_val)+1)
        r, b = t.getCISTs()
        mainPath, _ = t.getProtectionRouting(r, b, d)
        for edge in mainPath:
            if edge in pathDict:
                pathDict[edge] += 1
            elif edge[::-1] in pathDict:
                pathDict[edge[::-1]] += 1
            else:
                pathDict[edge] = 1

    pathloding = []
    for i in pathDict.items():
        pathloding.append(['{},{}'.format(i[0][0][0], i[0][0][1]),
                           '{},{}'.format(i[0][1][0], i[0][1][1]), i[1]])

    return json.dumps(pathloding)


@ app.route('/')
def index():
    return render_template('svg.html')


if __name__ == '__main__':
    app.config['TEMPLATES_AUTO_RELOAD'] = True
    app.jinja_env.auto_reload = True
    app.debug = True
    app.run()
