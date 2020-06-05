class TorusNetwork:
        
    def __init__(self,m,k):
        
        if k % 2 == 1 and m % 2 == 0:
            self.__constructionExONetwork(m,k) # Even x Odd
        elif k % 2 == 0:
            self.__constructionEvenNetwork(m,k) # Odd x Even or Even x Even
        else:
            self.__constructionOddNetwork(m,k) # Odd x Odd
        
    def __constructionEvenNetwork(self,m,k):
        nodeSet = []
        edgeSet = []
        for i in range(m):
            temp = []
            for j in range(k):
                node = (i,j)
                if j % 2 == 0:
                    if i != m-1:
                        temp.append((node,'b'))
                    else:
                        temp.append((node,'r'))
                else:
                    if i != 0:
                        temp.append((node,'r'))
                    else:
                        temp.append((node,'b'))

                if i == 0 and j > 0:
                    edgeSet.append(((temp[j-1][0],temp[j][0]),'b'))

                if i == m-1 and j > 0:
                    edgeSet.append(((temp[j-1][0],temp[j][0]),'r'))

                if i > 0 and  j % 2 == 0:
                    edgeSet.append(((node,nodeSet[i-1][j][0]),'b'))
                    if i == m-1:
                        edgeSet.append(((node,nodeSet[0][j][0]),'r'))
                    if i != m-1 and j > 0:
                        edgeSet.append(((temp[j-1][0],temp[j][0]),'b'))

                if i > 0 and j % 2 == 1:
                    edgeSet.append((((node,nodeSet[i-1][j][0]),'r')))
                    if i == m - 1:
                        edgeSet.append(((node,nodeSet[0][j][0]),'b'))
                    if i != m-1 and j > 0:
                        edgeSet.append(((temp[j-1][0],temp[j][0]),'r'))
                    if i != m-1 and i != 0 and j == (k-1):
                        edgeSet.append(((temp[j][0],temp[0][0]),'b'))
            
            nodeSet.append(temp)
            
        self.__nodeSet = nodeSet
        self.__edgeSet = edgeSet
        
    def __constructionExONetwork(self,m,k):
        nodeSet = []
        edgeSet = []
        for i in range(m):
            temp = []
            for j in range(k):
                node = (i,j)
                if i % 2 != 0:
                    if j != k-1:
                        temp.append((node,'b'))
                    else:
                        temp.append((node,'r'))
                else:
                    if j != 0:
                        temp.append((node,'r'))
                    else:
                        temp.append((node,'b'))

                if j == 0 and i > 0:
                    edgeSet.append(((nodeSet[i-1][0][0],node),'b'))

                if j == k-1 and i > 0:
                    edgeSet.append(((nodeSet[i-1][k-1][0],node),'r'))

                if j > 0 and i % 2 == 0:
                    edgeSet.append(((temp[j-1][0],temp[j][0]),'r'))
                    if j == k-1:
                        edgeSet.append(((temp[0][0],temp[j][0]),'b'))
                    if j != k-1 and i > 0:
                        edgeSet.append(((nodeSet[i-1][j][0],node),'b'))

                if j > 0 and i % 2 == 1:
                    edgeSet.append(((temp[j-1][0],temp[j][0]),'b'))
                    if j == k-1:
                        edgeSet.append(((temp[0][0],temp[j][0]),'r'))
                    if j != k-1 and i > 0:
                        edgeSet.append(((nodeSet[i-1][j][0],node),'r'))
                    if j != k-1 and j != 0 and i == (m-1):
                        edgeSet.append(((nodeSet[0][j][0],node),'b'))


            nodeSet.append(temp)

        self.__nodeSet = nodeSet
        self.__edgeSet = edgeSet

    def __constructionOddNetwork(self,m,k):
        T = [(((0,0),(0,1)),'b'),(((0,1),(0,2)),'r'),(((0,0),(0,2)),'r'),(((0,0),(1,0)),'r'),(((0,2),(1,2)),'r'),
             (((1,0),(1,1)),'r'),(((1,1),(1,2)),'b'),(((1,0),(1,2)),'b'),(((1,1),(2,1)),'r'),(((1,0),(2,0)),'r'),
             (((1,2),(2,2)),'b'),(((2,0),(2,1)),'b'),(((2,1),(2,2)),'b'),(((2,0),(2,2)),'r'),(((0,1),(2,1)),'b'),
             (((0,2),(2,2)),'b')]
    
        H = [(((0,0),(0,1)),'r'),(((0,0),(1,0)),'r'),(((0,1),(1,1)),'b'),
             (((1,0),(1,1)),'b'),(((1,0),(2,0)),'b'),(((1,1),(2,1)),'r'),
             (((0,0),(2,0)),'b'),(((0,1),(2,1)),'r'),(((2,0),(2,1)),'r')]

        Y = [(((0,0),(0,1)),'b'),(((0,1),(0,2)),'r'),(((0,0),(0,2)),'b'),
             (((0,0),(1,0)),'b'),(((0,1),(1,1)),'r'),(((0,2),(1,2)),'b'),
             (((1,0),(1,1)),'r'),(((1,1),(1,2)),'b'),(((1,0),(1,2)),'r')]

        X = [(((0,0),(0,1)),'b'),(((0,0),(1,0)),'b'),(((1,0),(1,1)),'r'),(((0,1),(1,1)),'r')]

        if k == 3 and m == 3:
            self.__edgeSet = T
            return 
        else:
            for i in range(3,k-2+1,2):
                T = self.__columnInsertion(T,H,1,i)
                Y = self.__columnInsertion(Y,X,1,i)
            for i in range(3,m-2+1,2):
                T = self.__rowInsertion(T,Y,1,i)
        T.sort()
        self.__edgeSet = T
    
    def __columnInsertion(self,T,H,j,k=3):
        t = T[:]
        eSet = []
        newH = []

        for i in H:
            newH.append((((i[0][0][0],i[0][0][1]+(j+1)),(i[0][1][0],i[0][1][1]+(j+1))),i[1]))

        for i in t:
            if i[0][0][1] == 0 and i[0][1][1] == k-1:
                node = (((i[0][0][0],i[0][0][1]),(i[0][1][0],k+1)),i[1])
                eSet.append(node)
                continue

            if i[0][0][1] == k-1 and i[0][1][1] == 0:
                node = (((i[0][0][0],k+1),(i[0][1][0],i[0][1][1])),i[1])
                eSet.append(node)
                continue

            if i[0][0][1] == j and i[0][1][1] == i[0][0][1]+1 or i[0][1][1] == j and i[0][1][1] == i[0][0][1]-1:
                eSet.append(i)
                node = (((i[0][0][0],i[0][0][1]+2),(i[0][1][0],i[0][1][1]+2)),i[1])
                eSet.append(node)
                continue

            if i[0][0][1] > j and i[0][1][1] > j:
                node = (((i[0][0][0],i[0][0][1]+2),(i[0][1][0],i[0][1][1]+2)),i[1])
                eSet.append(node)
                continue

            eSet.append(i)

        e = eSet + newH
        return e
    
    def __rowInsertion(self,T,Y,j,t=3):
    
        newY = []
        eSet = []

        for i in Y:
            newY.append((((i[0][0][0]+(j+1),i[0][0][1]),(i[0][1][0]+(j+1),i[0][1][1])),i[1]))

        for i in T:
            if i[0][0][0] == 0 and i[0][1][0] == t-1:
                node = (((i[0][0][0],i[0][0][1]),(t+1,i[0][1][1])),i[1])
                eSet.append(node)
                continue

            if i[0][0][0] == t-1 and i[0][1][0] == 0:
                node = (((t+1,i[0][0][1]),(i[0][1][0],i[0][1][1])),i[1])
                eSet.append(node)
                continue

            if i[0][0][0] == j and i[0][1][0] == i[0][0][0]+1 or i[0][1][0] == j and i[0][1][0] == i[0][0][0]-1:
                eSet.append(i)
                node = (((i[0][0][0]+2,i[0][0][1]),(i[0][1][0]+2,i[0][1][1])),i[1])
                eSet.append(node)
                continue

            if i[0][0][0] > j and i[0][1][0] > j:
                node = (((i[0][0][0]+2,i[0][0][1]),(i[0][1][0]+2,i[0][1][1])),i[1])
                eSet.append(node)
                continue

            eSet.append(i)

        e = eSet + newY

        return e

    def getProtectionRouting(self,t1,t2,d):
        t1 = set(t1)
        t2 = set(t2)
        deg1 = {}
        deg2 = {}
        l1 = []
        l2 = []
        n = 30
#         d = (0,0)
        
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
            return self.getProtectionRouting(t2,t1,d)
            

        for i in deg1.keys():
            if deg1[i] == 1 and deg2[i] != 1:
                l1.append(i)
            if deg2[i] == 1:
                l2.append(i)

        treeAry = [t1,t2]
        lAry = [l1,l2]
        edgeSet=set()
        tempSet1=set()
        tempSet2=set()
        for i in range(2):
            for edge in treeAry[i]:
                if i==0 and (edge[0] in lAry[i] or edge[1] in lAry[i]) :
                    tempSet1.add(edge)
                elif i==1 and (edge[0] in lAry[i] or edge[1] in lAry[i]) and (edge[0] != d and edge[1] != d):
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
                        mainPath.append((ed[i][0],ed[i][1]))
                        lll[keyList.index(ed[i][0])] = 1
                    else:
                        mainPath.append((ed[i][1],ed[i][0]))
                        lll[keyList.index(ed[i][1])] = 1
                elif lll[keyList.index(ed[i][1])] == 1 and lll[keyList.index(ed[i][0])] != 1:
                    mainPath.append((ed[i][0],ed[i][1]))
                    lll[keyList.index(ed[i][0])] = 1
                elif lll[keyList.index(ed[i][0])] == 1 and lll[keyList.index(ed[i][1])] != 1:
                    mainPath.append((ed[i][1],ed[i][0]))
                    lll[keyList.index(ed[i][1])] = 1

                if 0 not in lll:
                    break
                
        for e in tempSet1:
            if e[0] in l1:
                snhPath.append((e[0],e[1]))
            else:
                snhPath.append((e[1],e[0]))
        for e in tempSet2:
            if e[0] in l2:
                snhPath.append((e[0],e[1]))
            else:
                snhPath.append((e[1],e[0]))
        
        mainPath.sort()
        snhPath.sort()
        
        self.__mainPath = mainPath
        self.__snhPath = snhPath
        
        # for i in mainPath:
        #     print(i[0],'-->',i[1],end='')
        #     for j in snhPath:
        #         if i[0] == j[0]:
        #             print(', SNH({}):'.format(i[0]),j[1])

        return mainPath,snhPath
    
    def getRoutingPath(self):
        return self.__changeEdgeToString(self.__mainPath),self.__changeEdgeToString(self.__snhPath)
    
    def getEdges(self):
        return self.__edgeSet
    
    def getCIST(self):
        r = []
        b = []
        for x in self.__edgeSet:
            if x[1] == 'r':
                edge = []
                for node in x[0]:
                    n = "{},{}".format(node[0],node[1])
                    edge.append(n)
                r.append(edge)
            elif x[1] == 'b':
                edge = []
                for node in x[0]:
                    n = "{},{}".format(node[0],node[1])
                    edge.append(n)
                b.append(edge)
        return r,b
    
    def __changeEdgeToString(self,edgeList):
        tempList = []
        for edge in edgeList:
            tempEdge = []
            for node in edge:
                n = "{},{}".format(node[0],node[1])
                tempEdge.append(n)
            tempList.append(tempEdge)
        return tempList
    
    def getCISTs(self):
        b = [x[0] for x in self.__edgeSet if x[1] == 'b']
        r = [x[0] for x in self.__edgeSet if x[1] == 'r']
        return b,r