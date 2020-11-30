import math
import random


class DensGaussianNetwork():

    def __init__(self, k):
        self.__k = k
        self.__n = 2*k*k+2*k+1
        if k % 2 == 1:
            self.__constructOddCISTs()
        else:
            self.__constructEvenCIST()

    def getCirculantGraph(self):
        mainSet = []
        sndSet = []
        for i in range(self.__n):
            a = (i, (i+3) % self.__n)
            if not((a[0], a[1]) in mainSet or (a[1], a[0]) in mainSet):
                mainSet.append(a)
            b = (i, (i+4) % self.__n)
            if not((b[0], b[1]) in sndSet or (b[1], b[0]) in sndSet):
                sndSet.append(b)
        return mainSet, sndSet

    def __swapEdge(self, edgeList):
        temp = []
        for edge in edgeList:
            if (edge[1] - edge[0]) % self.__n != self.__k and (edge[1] - edge[0]) % self.__n != self.__k+1:
                temp.append((edge[1], edge[0]))
            else:
                temp.append(edge)
        return temp

    def __constructOddCISTs(self):
        k = self.__k
        d = 2*k + 1
        n = 2*k*k+2*k+1
        w = [2*k*k*k % n, (2*k*k + 2*k)*k % n]
        edgeList = []
        for i in range(2):
            S = [[] for i in range(k+1)]
            V = [[] for i in range(2)]
            edges = []
            for l in range(k+1):
                if i == 1 and l == 0:
                    S[0].append(0)
                for j in range(2*k*l+1, 2*k*(l+1)+1):
                    S[l].append(j*k % n)
                if i == 0 and l == k:
                    S[k].append(0)
            for x in range(0, k, 2):
                V[0] += S[x]
            for x in range(1, k+1, 2):
                V[1] += S[x]
            for segment in S:
                for v in segment:
                    if v != w[i]:
                        edges.append(self.__oddPartner(
                            i, v, segment, V, k, d, n))
            edgeList.append(edges)
        self.__b = self.__swapEdge(edgeList[0])
        self.__r = self.__swapEdge(edgeList[1])

    def __oddPartner(self, i, v, segment, V, k, d, n):
        if v in V[i] and v != segment[-1]:
            return (v, (v+k) % n)
        elif v in V[i] and v == segment[-1]:
            return (v, (v+d*k) % n)
        elif v in V[1-i] and v == segment[0]:
            return (v, (v-k) % n)
        elif v in V[1-i] and v != segment[0]:
            return (v, (v-d*k) % n)

    def __constructEvenCIST(self):
        k = self.__k
        d = 2*k + 1
        n = 2*k*k+2*k+1
        w = [-(k+2)*k % n, -(k+1)*k % n]
        edgeList = []
        for i in range(2):
            S = [[] for i in range(k)]
            V = [[] for i in range(2)]
            S_bar = []
            edges = []
            for j in range(-k-1, k+2):
                S[0].append(j*k % n)
            for l in range(1, k):
                for m in range((2*k+2)*(l-1)+k+2, (2*k+2)*l+k+2):
                    S[l].append(m*k % n)

                if i == 0 and l % 2 == 1:
                    for index in range(len(S[l][2:-2])):
                        q = math.floor(index/(k-1))
                        r = -(l+index) % (k-1)
                        if (r == 0 and q == r) or (r != 0 and r % 2 == 1):
                            S_bar.append('f')
                        elif (r == 0 and q > r) or (r != 0 and r % 2 == 0):
                            S_bar.append('b')
                elif i == 1 and (l % 2 == 0 and l != 0):
                    for index in range(len(S[l][1:-1])):
                        r = -(l+index) % k
                        q = (l+index+r)/k-2
                        if (r == 0 and r > q) or ((r % 2 == 1 and r != 0) and q != 0) or ((r % 2 == 0 and r != 0) and q == 0):
                            S_bar.append('f')
                        elif (r == 0 and q == 0) or ((r % 2 == 0 and r != 0) and q != 0) or ((r % 2 == 1 and r != 0) and q == 0):
                            S_bar.append('b')

            for segment in range(len(S)):
                for v in S[segment]:
                    if v != w[i]:
                        edges.append(self.__evenPartner(
                            i, k, n, v, d, S[segment], segment, S_bar))
            edgeList.append(edges)
        self.__b = self.__swapEdge(edgeList[0])
        self.__r = self.__swapEdge(edgeList[1])

    def __evenPartner(self, i, k, n, v, d, segment, Sindex, S_bar):

        if i == 0:
            if Sindex == 0:
                if v in [(-k-1)*k % n, (-k)*k % n]+[(x*k) % n for x in range(k-1)]:
                    return (v, (v+k) % n)
                elif v in [x for x in range((-k+2)*k % n, (-1)*k % n+1, k)]+[(k*k) % n, ((k+1)*k) % n]:
                    return (v, (v-k) % n)
                elif v == (-k+1)*k % n:
                    return (v, (v+d*k) % n)
                elif v == (k-1)*k % n:
                    return (v, (v-d*k) % n)

            elif Sindex % 2 == 0 and Sindex != 0:
                if v == segment[0]:
                    return (v, (v+k) % n)
                elif v == segment[1]:
                    return (v, (v+d*k) % n)
                else:
                    return (v, (v-k) % n)

            if Sindex % 2 == 1:
                if v == segment[1]:
                    return (v, (v-k) % n)
                elif v == segment[-2]:
                    return (v, (v+k) % n)
                elif v == segment[0] or v == segment[-1]:
                    return (v, (v+d*k) % n)
                else:
                    y = int((Sindex-1)/2)
                    num = (2*k-2)*y
                    sBarIndex = segment.index(v)-2+num
                    if S_bar[sBarIndex] == 'b':
                        return (v, (v-d*k) % n)
                    elif S_bar[sBarIndex] == 'f':
                        return (v, (v+d*k) % n)
        if i == 1:
            if Sindex == 0:
                if v in [x for x in range(-k*k % n, -2*k % n+1, 2*k)] + [0] + [x for x in range(1*k % n, (k+2)*k % n, 2*k)]:
                    return (v, (v+d*k) % n)
                elif v in [x for x in range((-k+1)*k % n, -1*k % n+1, 2*k)] + [x for x in range(2*k % n, (k+1)*k % n, 2*k)]:
                    return (v, (v-d*k) % n)
            elif Sindex % 2 == 1:
                if v == segment[-1]:
                    return (v, (v+k) % n)
                elif v == segment[1]:
                    return (v, (v+d*k) % n)
                else:
                    return (v, (v-k) % n)

            elif Sindex % 2 == 0 and Sindex != 0:
                if v == segment[0] or v == segment[-1]:
                    return (v, (v+d*k) % n)
                else:
                    y = int((Sindex-1)/2)
                    num = (2*k)*y
                    sBarIndex = segment.index(v)-1+num
                    if S_bar[sBarIndex] == 'b':
                        return (v, (v-d*k) % n)
                    elif S_bar[sBarIndex] == 'f':
                        return (v, (v+d*k) % n)

    def getCISTs(self):
        return self.__b, self.__r

    def getStringCIST(self):
        r = []
        b = []
        for x in self.__r:
            edge = []
            for node in x:
                n = "{}".format(node)
                edge.append(n)
            r.append(edge)

        for x in self.__b:
            edge = []
            for node in x:
                n = "{}".format(node)
                edge.append(n)
            b.append(edge)
        return b, r

    def __changeEdgeToString(self, edgeList):
        tempList = []
        for edge in edgeList:
            tempEdge = []
            for node in edge:
                n = "{}".format(node)
                tempEdge.append(n)
            tempList.append(tempEdge)
        return tempList

    def __getProtectionRouting(self, d):
        t1 = set(self.__r)
        t2 = set(self.__b)
        deg1 = {}
        deg2 = {}
        l1 = []
        l2 = []

        while d not in deg2:
            for i in t1:
                if i[0] not in deg1:
                    deg1[i[0]] = 1
                else:
                    deg1[i[0]] += 1

                if i[1] not in deg1:
                    deg1[i[1]] = 1
                else:
                    deg1[i[1]] += 1

            for i in t2:
                if i[0] not in deg2:
                    deg2[i[0]] = 1
                else:
                    deg2[i[0]] += 1

                if i[1] not in deg2:
                    deg2[i[1]] = 1
                else:
                    deg2[i[1]] += 1

            if deg2[d] != 1:
                t1, t2 = t2, t1
                deg1 = {}
                deg2 = {}
                l1 = []
                l2 = []

        for i in deg1.keys():
            if deg1[i] == 1 and deg2[i] != 1:
                l1.append(i)
            if deg2[i] == 1:
                l2.append(i)

        treeAry = [t1, t2]
        lAry = [l1, l2]
        edgeSet = set()
        tempSet1 = set()
        tempSet2 = set()
        for i in range(2):
            for edge in treeAry[i]:
                if i == 0 and (edge[0] in lAry[i] or edge[1] in lAry[i]):
                    tempSet1.add(edge)
                elif i == 1 and (edge[0] in lAry[i] or edge[1] in lAry[i]) and (edge[0] != d and edge[1] != d):
                    tempSet2.add(edge)

        tHat1 = t1.difference(tempSet1)
        tHat2 = t2.difference(tempSet2)
        ed = list(tHat1.union(tHat2))
        keyList = list(deg1.keys())
        lll = [0]*len(keyList)
        lll[keyList.index(d)] = 1
        mainPath = []
        snhPath = []
        while 0 in lll:
            for i in range(len(ed)):
                if (ed[i][0] == d or ed[i][1] == d) and \
                        (lll[keyList.index(ed[i][0])] != 1 and lll[keyList.index(ed[i][1])] != 1):
                    if ed[i][1] == d:
                        mainPath.append((ed[i][0], ed[i][1]))
                        lll[keyList.index(ed[i][0])] = 1
                    else:
                        mainPath.append((ed[i][1], ed[i][0]))
                        lll[keyList.index(ed[i][1])] = 1
                elif lll[keyList.index(ed[i][1])] == 1 and lll[keyList.index(ed[i][0])] != 1:
                    mainPath.append((ed[i][0], ed[i][1]))
                    lll[keyList.index(ed[i][0])] = 1
                elif lll[keyList.index(ed[i][0])] == 1 and lll[keyList.index(ed[i][1])] != 1:
                    mainPath.append((ed[i][1], ed[i][0]))
                    lll[keyList.index(ed[i][1])] = 1

                if 0 not in lll:
                    break

        for e in tempSet1:
            if e[0] in l1:
                snhPath.append((e[0], e[1]))
            else:
                snhPath.append((e[1], e[0]))
        for e in tempSet2:
            if e[0] in l2:
                snhPath.append((e[0], e[1]))
            else:
                snhPath.append((e[1], e[0]))

        mainPath.sort()
        snhPath.sort()

        self.__mainPath = mainPath
        self.__snhPath = snhPath

    def getRoutingPath(self, d):
        self.__getProtectionRouting(d)
        return self.__mainPath, self.__snhPath

    def getStringRoutingPath(self, d):
        self.__getProtectionRouting(d)
        return self.__changeEdgeToString(self.__mainPath), self.__changeEdgeToString(self.__snhPath)

    def getMultiRandomSinkToDestinationPath(self, pairNum, times):
        obj = {}
        maxP = 0
        k = self.__k
        n = 2*k*k+2*k+1
        r = 1
        while r <= times:
            total = []
            isUse = []
            while len(total) != pairNum:
                d = random.randint(0, n-1)
                s = random.randint(0, n-1)
                if s == d or (s, d) in isUse or s in isUse:
                    continue
                print(s, d)
                mainPath, _ = self.getRoutingPath(d)
                p = []
                isUse.append((s, d))
                isUse.append(s)
                while s != d:
                    for edge in mainPath:
                        if edge[0] == s:
                            p.append(edge)
                            s = edge[1]
                total.append(p)
            for edgeList in total:
                period = r
                for edge in edgeList:
                    e = (edge[0], edge[1], period)
                    if e in obj:
                        obj[e] += 1
                    else:
                        obj[e] = 1
                    period += 1
                if period > maxP:
                    maxP = (period - 1)
            r += 1
        edgePeriodList = []
        for p in range(maxP):
            temp = []
            for i in obj.items():
                if i[0][2] == (p+1):
                    n1 = '{}'.format(i[0][0])
                    n2 = '{}'.format(i[0][1])
                    temp.append([n1, n2, i[1]])
            edgePeriodList.append({'P': p+1, 'PeriodList': temp})
        edgePeriodObj = {'maxPeriod': maxP, 'edgePeriodList': edgePeriodList}
#         print(edgePeriodObj)

        return edgePeriodObj
