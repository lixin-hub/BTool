import { NotificationPlacement, message, notification } from "ant-design-vue";
import { DocNodeData, NodeType, Topics } from "@/types";
// 定义 节点高亮 装饰器
export default function HightlightDecorators() {
    return function enhancer(_target: any, _propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = async function (...args: any[]) {
            let that = this as DocNodeData
            if (!that) return originalMethod.apply(this, args);
            try {
                notification.open({
                    key: that.id,
                    message: `节点：${that.id} 正在运行`,
                    duration: 0,
                    placement: 'bootomRight' as NotificationPlacement
                });
                // 高亮节点     
                PubSub.publish(Topics.HIGHT_LIGHT_NODES, { ids: that.id, ms: 0, type: "run" });

                // 执行原始方法
                const playload = await originalMethod.apply(this, args);
                notification.close(that.id)
                if (!playload&&that.type!=NodeType.TYPE_OUTPUT) {
                    PubSub.publish(Topics.HIGHT_LIGHT_NODES, { ids: that.id, ms: 3000, type: "error" });
                    message.error("高亮节点运行失败")
                    return
                }
                message.success("节点运行成功！")
                // 取消高亮节点
                PubSub.publish(Topics.DEHIGHT_LIGHT_NODES, { id: that.id, type: "run" });
                return playload;
            } catch (error) {
                PubSub.publish(Topics.DEHIGHT_LIGHT_NODES, { id: that.id, type: "run" });
                message.error("执行出错");
                notification.close(that.id)
                console.log(error);
            }

        };

        return descriptor;
    }
}

