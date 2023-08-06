import { DocNodeData, Line, MenuNodeData } from "@/types";
import { message } from "ant-design-vue";
import { FileWithPath, fromEvent } from 'file-selector';
import { throttle } from 'lodash';
function uuid(len: number, radix: number): string {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    var uuid = [], i;
    radix = radix || chars.length;

    if (len) {
        // Compact form
        for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
    } else {
        // rfc4122, version 4 form
        var r;

        // rfc4122 requires these characters
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
        uuid[14] = '4';

        // Fill in random data.  At i==19 set the high bits of clock sequence as
        // per rfc4122, sec. 4.1.5
        for (i = 0; i < 36; i++) {
            if (!uuid[i]) {
                r = 0 | Math.random() * 16;
                uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
            }
        }
    }

    return uuid.join('');
}

export function UUID(radix?: number): string { return uuid(radix || 10, 16) }

export function findDocNodeById(docs: DocNodeData[], id: string): DocNodeData | undefined {
    for (let child of docs) {
        if (child.id === id)
            return child;
    }
    return undefined;
}

export function findMenuNodeByKey(menuItems: MenuNodeData[], key: string): MenuNodeData | undefined {
    for (let children of menuItems) {
        if (children.children)
            for (let child of children.children) {
                if (child.key === key)
                    return child;
            }

    }
    return undefined;
}

//找到node节点
export function findParentNode(element: HTMLElement, clazz: string): HTMLElement | null {
    let currentElement: HTMLElement | null = element;

    while (currentElement && !currentElement.classList.contains(clazz)) {
        currentElement = currentElement.parentElement;
    }

    return currentElement;
}
//随时获取鼠标位置

export function createMousePositionTracker(throttleTime: number) {
    let mouseX = 0;
    let mouseY = 0;

    const updateMousePosition = throttle((event) => {
        mouseX = event.clientX; // 获取鼠标相对于浏览器窗口的水平坐标
        mouseY = event.clientY; // 获取鼠标相对于浏览器窗口的垂直坐标
    }, throttleTime);

    document.addEventListener('mousemove', updateMousePosition);

    return {
        getMousePosition: () => ({ x: mouseX, y: mouseY }),
        destroy: () => {
            document.removeEventListener('mousemove', updateMousePosition);
        }
    };
}
//获取文件
export async function openFileManager(accept: string): Promise<File> {
    return await (new Promise(function (resolve) {
        let input = document.createElement('input');
        input.type = 'file';
        input.accept = accept; // 指定要选择的文件格式
        input.addEventListener('change', (event) => {
            const files = (event.target as HTMLInputElement).files;

            if (files && files.length > 0) {
                const selectedFile = files[0];
                // 执行文件处理逻辑，比如读取文件内容、上传文件等
                resolve(selectedFile);
            }
        });
        input.click();
    }))
}
//将节点列表转换为map
export function nodeListToMap(nodeList: Array<DocNodeData>): Map<string, DocNodeData> {
    let map = new Map<string, DocNodeData>();
    nodeList.forEach((node: DocNodeData) => {
        map.set(node.id, node);
    });
    return map;
}//将节点列表转换为map
export function graphNodeListToMap(nodeList: Array<GraphNode>): Map<string, GraphNode> {
    let map = new Map<string, GraphNode>();
    nodeList.forEach((node: GraphNode) => {
        map.set(node.id, node);
    });
    return map;
}
//判断那些节点构成了环
export function findCycle(lineList: Line[]): string[] {
    const adjacencyList: { [key: string]: string[] } = {};
    const visited: { [key: string]: boolean } = {};
    const cycle: string[] = [];

    // 构建邻接列表
    for (const line of lineList) {
        if (!adjacencyList[line.from]) {
            adjacencyList[line.from] = [];
        }
        adjacencyList[line.from].push(line.to);
    }

    function dfs(node: string, path: string[]): string[] | null {
        if (visited[node]) {
            const cycleStart = path.indexOf(node);
            return path.slice(cycleStart);
        }
        visited[node] = true;

        if (adjacencyList[node]) {
            for (const neighbor of adjacencyList[node]) {
                const cyclePath = dfs(neighbor, [...path, node]);
                if (cyclePath) {
                    return cyclePath;
                }
            }
        }

        visited[node] = false;
        return null;
    }

    for (const node in adjacencyList) {
        const cyclePath = dfs(node, []);
        if (cyclePath) {
            cycle.push(...cyclePath);
        }
    }

    return cycle;
}
//图节点
export interface GraphNode {
    id: string;
    inputs: string[];
    outputs: string[];
}
//拓扑排序
export function createDirectedGraph(nodeList: DocNodeData[], lineList: Line[]): DocNodeData[] {
    const graph: { nodes: GraphNode[]; edges: Line[] } = {
        nodes: [],
        edges: []
    };

    // 步骤 1: 将节点添加到有向图中
    nodeList.forEach(node => {
        graph.nodes.push({
            id: node.id,
            inputs: [],
            outputs: []
        });
    });
    let nodesMap = graphNodeListToMap(graph.nodes)

    // 步骤 2: 连接节点，并记录输入和输出边数
    lineList.forEach(line => {
        nodesMap.get(line.from)
        const fromNode = nodesMap.get(line.from)
        const toNode = nodesMap.get(line.to)

        if (fromNode && toNode) {
            fromNode.outputs.push(toNode.id);
            toNode.inputs.push(fromNode.id);
            graph.edges.push(line);
        }
    });

    // 步骤 4: 创建队列，并将没有输入边的节点入队
    const queue: GraphNode[] = [];
    graph.nodes.forEach(node => {
        if (node.inputs.length === 0) {
            queue.push(node);
        }
    });
    let orderedNodesMap = nodeListToMap(nodeList)

    // 步骤 6: 拓扑排序，生成有序列表
    const orderedNodes: DocNodeData[] = [];
    while (queue.length > 0) {
        const currentNode = queue.shift();
        if (currentNode) {
            let node = orderedNodesMap.get(currentNode.id)
            if (node)
                orderedNodes.push(node);
            // 更新与当前节点相连的节点的输入边数
            currentNode.outputs.forEach(outputNodeId => {
                const outputNode = graph.nodes.find(node => node.id === outputNodeId);
                if (outputNode) {
                    outputNode.inputs = outputNode.inputs.filter(inputId => inputId !== currentNode.id);

                    // 如果更新后的节点没有输入边，则加入队列
                    if (outputNode.inputs.length === 0) {
                        queue.push(outputNode);
                    }
                }
            });
        }
    }

    // 步骤 8: 检查是否存在循环依赖
    const hasCycle = graph.nodes.some(node => node.inputs.length > 0);
    if (hasCycle) {
        message.error('有向图中存在循环依赖，无法形成有序的输出');
        return [];
    }
    return orderedNodes;
}

export function hasSingleNode(lineList: Line[], nodeList: DocNodeData[]): DocNodeData[] {
    const connectedNodeIds = new Set<string>();
    lineList.forEach(line => {
        connectedNodeIds.add(line.from);
        connectedNodeIds.add(line.to);
    });
    let singleNodes = []
    for (const node of nodeList) {
        if (!connectedNodeIds.has(node.id)) {
            singleNodes.push(node);
        }
    }

    return singleNodes;
}