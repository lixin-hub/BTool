import { Directive, onBeforeUnmount, onMounted } from 'vue';

const flowDragDirective: Directive = {
    mounted(el) {
        const handleMouseDown = (e: MouseEvent) => {
            if (e.button === 2) {
                // 右键不管
                return;
            }
            // 鼠标按下，计算当前原始距离可视区的高度
            let disX = e.clientX;
            let disY = e.clientY;
            document.body.style.cursor = 'move';

            const handleMouseMove = (e: MouseEvent) => {
                // 移动时禁止默认事件
                e.preventDefault();
                const left = e.clientX - disX;
                disX = e.clientX;
                document.documentElement.scrollLeft += -left;

                const top = e.clientY - disY;
                disY = e.clientY;
                document.documentElement.scrollTop += -top;
            };

            const handleMouseUp = () => {
                document.body.style.cursor = 'auto';
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };

            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        };


    }
};

export default flowDragDirective;
