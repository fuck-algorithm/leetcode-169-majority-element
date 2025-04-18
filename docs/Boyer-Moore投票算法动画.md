### Boyer-Moore投票算法动画

## 算法介绍

Boyer-Moore投票算法是一种用于高效寻找数组**多数元素**（出现次数超过半数）的算法，其核心思想通过「元素抵消」实现**线性时间复杂度**和**常数空间复杂度**。

## **算法核心逻辑**

1. 候选值与计数器机制：
   - 维护一个候选值 `candidate` 和计数器 `count`
   - 遍历元素时：
     - 若 `count == 0`，将当前元素设为候选值
     - 若当前元素与候选值相同，`count++`；否则 `count--`
2. 多数元素验证（动画中隐含）：
   - 最终候选值需二次遍历验证是否为多数元素（动画通过动态匹配直接体现）

## 算法代码

```java
class Solution {
    public int majorityElement(int[] nums) {
        int count = 0;
        Integer candidate = null;

        for (int num : nums) {
            if (count == 0) {
                candidate = num;
            }
            count += (num == candidate) ? 1 : -1;
        }

        return candidate;
    }
}
```

### **镜头 1：初始化阶段**

- **画面元素**：
  - 空画布中心显示「Boyer-Moore 投票算法演示」标题，单击的时候在新页面打开 https://leetcode.cn/problems/majority-element/
  - 底部显示输入数组（例如 `[2, 2, 1, 1, 1, 2, 2]`）的静态横向排列，输入数组是用户输入或者单击随机按钮（骰子按钮）生成的随机数据样例
  - 右侧悬浮面板显示初始状态：
    - 候选值`candidate`：`null`
    - 计数器`count`：`0`
- **动画效果**：
  - 标题淡入，伴随粒子扩散效果
  - 数组元素逐个从底部升起，带弹性动画
  - 状态面板数值从 `?` 变为初始值
- **交互提示**：
  - 出现「点击开始」按钮闪烁提示

---

### **镜头 2：首元素处理**
- **画面焦点**：
  - 数组的第一个元素高亮（金色脉冲边框）
  - 候选值面板candidate从 `null` 切换为 第一个数组的值（紫色呼吸动画）
  - 计数器count从 `0` → `1`（绿色数字增长 + 柱状图上升）
- **动画细节**：
  - 元素下方显示「当前元素」标签，最好是个箭头指向
  - 候选值切换时触发粒子爆发动画
  - 计数器变化时伴随「+1」的浮动文字
- **代码高亮**：
  - 同步高亮 `if (count == 0) { candidate = num; }`

---

### **镜头 3：连续匹配阶段**
- **遍历过程**：
  1. 第二个 `2` 高亮 → 计数器 `1` → `2`（绿色持续增强）
  2. 第三个 `1` 高亮：
     - 元素变为红色下沉效果
     - 计数器 `2` → `1`（红色数字闪烁）
  3. 第四个 `1` 高亮 → 计数器 `1` → `0`（红色临界警告）
- **视觉反馈**：
  - 匹配时元素上浮 + 绿色光晕
  - 不匹配时元素下沉 + 红色冲击波
  - 计数器归零时画布震动效果
- **代码同步**：
  - 高亮 `count += (num == candidate) ? 1 : -1`

---

### **镜头 4：候选值切换时刻**
- **关键事件**：
  - 当计数器归零时触发：
    - 候选值从旧值切换为新值（紫色→橙色渐变动画）
    - 新候选值图标从当前元素位置飞入状态面板
- **镜头运动**：
  - 拉近镜头聚焦候选值切换过程
  - 旧候选值淡出时显示「失效」标签
  - 画布背景短暂变为警告色（黄色）

---

### **镜头 5：最终确认阶段**
- **决胜遍历**：
  - 遍历剩余元素，动态更新计数器与候选值：
    - 若元素与候选值匹配，计数器递增（绿色动画）
    - 若不匹配，计数器递减（红色动画）
  - 最终候选值锁定后：
    - 所有匹配元素脉冲高亮三次
    - 计数器柱状图突破画布顶部
    - 画面中心弹出「多数元素：X」的金色勋章动画

---

### **镜头 6：总结回放**
- **全局视角**：
  - 缩略时间轴展示完整遍历过程
  - 用颜色轨迹显示候选值变化路径
  - 动态折线图同步展示计数器值变化
- **对比演示**：
  - 左侧显示暴力解法（哈希表统计）
  - 右侧高亮Boyer-Moore的空间效率优势
- **交互提示**：
  - 「重播」按钮放大突出
  - 支持拖动时间轴自由查看任意步骤

---

### **镜头切换逻辑**
| 镜头名称       | 技术实现要点                   |
| -------------- | ------------------------------ |
| 初始化         | D3数据绑定 + CSS关键帧动画     |
| 首元素处理     | React状态驱动 + SVG滤镜动画    |
| 连续匹配       | 物理引擎模拟 + Canvas粒子系统  |
| 候选值切换     | FLIP动画技术 + Web Audio API   |
| 最终确认       | Three.js 3D效果 + 交互动画曲线 |
| 总结回放       | 双画布渲染 + 历史数据快照      |

---

### **特殊情形处理**
1. **全同数组**：
   - 直接触发全屏绿色脉冲，跳过中间步骤
2. **超大数组**：
   - 启用低精度模式（仅显示关键帧）
   - 添加加载进度条
3. **用户中断**：
   - 暂停时显示半透明蒙层
   - 记录断点状态可继续播放

---

### **动态时长说明**
- 动画总时长由输入数组长度和算法实际步骤决定：
  - 初始化阶段固定为最短时间（约占总时长5%）
  - 遍历阶段时间与元素数量线性相关
  - 候选值切换和最终确认阶段根据实际触发次数调整
- 交互功能支持：
  - 速度调节（0.5x、1x、2x）
  - 关键帧跳转（通过时间轴拖动）

---

通过动态镜头调度和算法逻辑绑定，动画节奏会自适应输入数据，确保演示的流畅性与逻辑清晰度。首次播放推荐1x速度，复杂数据集可切换至低速模式以观察细节。