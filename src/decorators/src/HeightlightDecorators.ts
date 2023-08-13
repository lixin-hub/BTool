// import { message } from "ant-design-vue";
// import { Topics } from "@/types";
// // 定义 HightLightDescriptor 装饰器
// function HightlightDecorators(target: any, key: string, descriptor: PropertyDescriptor) {
//     const originalMethod = descriptor.value;

//     descriptor.value = async function (...args: any[]) {
//         try {
//             // 高亮节点
//             PubSub.publish(Topics.HIGHT_LIGHT_NODES, { ids: this.id, ms: 0, type: "info" });

//             // 执行原始方法
//             const playload = await originalMethod.apply(this, args);

//             // 取消高亮节点
//             PubSub.publish(Topics.DEHIGHT_LIGHT_NODES, { id: this.id, type: "info" });

//             console.log("exec", this.label, playload);
//             return playload;
//         } catch (error) {
//             // 高亮节点并显示错误信息
//             PubSub.publish(Topics.HIGHT_LIGHT_NODES, { ids: this.id, ms: 5000, type: "error" });
//             PubSub.publish(Topics.DEHIGHT_LIGHT_NODES, { id: this.id, type: "info" });
//             message.error("发生错误");
//             return;
//         }
//     };

//     return descriptor;
// }