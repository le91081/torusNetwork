from flask import Flask, render_template, request, url_for, redirect
from torusNetwork import TorusNetwork
from DenseGausian import DensGaussianNetwork
import random
import json

app = Flask(__name__)


@app.route('/test', methods=['POST'])
def CIST():
    m_val = request.form.get('m')
    n_val = request.form.get('n')
    d = request.form.get('d').split(',')
    t = TorusNetwork(int(m_val), int(n_val))
    x, y = t.getStringCIST()
    cist = [{'color': 'red', 'edges': x}, {'color': 'blue', 'edges': y}]
    mainPath, snhPath = t.getStringRoutingPath((int(d[0]), int(d[1])))
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


@app.route('/DNGCirculant', methods=['POST'])
def circulantCIST():
    k = request.form.get('k')
    d = request.form.get('d')
    # d = 0
    print('Call CIST function!!')
    t = DensGaussianNetwork(int(k))
    b, r = t.getStringCIST()
    cists = [{'color': 'blue', 'edges': b}, {'color': 'red', 'edges': r}]
    mainPath, snhPath = t.getStringRoutingPath(int(d))
    totalPath = []
    for m in mainPath:
        color = ''
        if m in b or m[::-1] in b:
            color = 'blue'
        elif m in r or m[::-1] in r:
            color = 'red'
        par = {'path': m, 'pathType': 'm', 'color': color}
        totalPath.append(par)
    for s in snhPath:
        color = 'gray'
        par = {'path': s, 'pathType': 's', 'color': color}
        totalPath.append(par)
    data = {'CIST': cists, 'RoutingPath': totalPath}
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
        mainPath, _ = t.getRoutingPath(d)
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


@app.route('/period', methods=['POST'])
def sinkToDPeriod():
    m_val = request.form.get('m')
    n_val = request.form.get('n')
    number = request.form.get('number')
    d = request.form.get('d').split(',')
    t = TorusNetwork(int(m_val), int(n_val))
    data = t.getSinkToDestinationPath(int(number), (int(d[0]), int(d[1])))
    return json.dumps(data)


@app.route('/randomPair', methods=['POST'])
def randomPairSToDPeriod():
    m_val = request.form.get('m')
    n_val = request.form.get('n')
    number = request.form.get('number')
    times = request.form.get('times')
    t = TorusNetwork(int(m_val), int(n_val))
    # data = t.getRandomSinkToDestinationPath(int(number))
    data = t.getMultiRandomSinkToDestinationPath(int(number), int(times))
    return json.dumps(data)


@app.route('/dgnRandomPair', methods=['POST'])
def dgnRandomPairSToDPeriod():
    k = request.form.get('k')
    number = request.form.get('number')
    times = request.form.get('times')
    t = DensGaussianNetwork(int(k))
    data = t.getMultiRandomSinkToDestinationPath(int(number), int(times))
    return json.dumps(data)


@ app.route('/')
def index():
    # return render_template('index.html')
    return redirect(url_for('routing'))

    # return render_template('svg.html')


@ app.route('/routing')
def routing():
    return render_template('routing.html')


@ app.route('/transmitt')
def transmitt():
    return render_template('transmitt.html')


@ app.route('/circulant')
def circulant():
    return render_template('circulant.html')


@ app.route('/dgn')
def dgn():
    return render_template('dgn.html')


@ app.route('/dngTransmitt')
def dngTransmitt():
    return render_template('dngTransmitt.html')


if __name__ == '__main__':
    app.config['TEMPLATES_AUTO_RELOAD'] = True
    app.jinja_env.auto_reload = True
    app.run(debug=True)
