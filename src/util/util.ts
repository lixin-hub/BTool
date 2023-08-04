import { DocNodeData, Line, MenuNodeData } from "@/types";

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