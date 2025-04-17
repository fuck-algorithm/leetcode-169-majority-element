# Boyer-Moore 投票算法可视化

<div align="center">
  <img src="https://img.shields.io/badge/React-18-blue?logo=react" alt="React 18" />
  <img src="https://img.shields.io/badge/TypeScript-5-blue?logo=typescript" alt="TypeScript 5" />
  <img src="https://img.shields.io/badge/D3.js-7-orange?logo=d3.js" alt="D3.js 7" />
  <img src="https://img.shields.io/badge/LeetCode-169-green?logo=leetcode" alt="LeetCode 169" />
  <br/>
  <a href="https://fuck-algorithm.github.io/leetcode-169-majority-element/">
    <img src="https://img.shields.io/badge/在线演示-Live%20Demo-brightgreen?style=for-the-badge" alt="在线演示" />
  </a>
</div>

## 📝 项目简介

这是一个交互式可视化工具，用于演示**Boyer-Moore 多数投票算法**的工作原理。该算法是解决 [LeetCode 169. 多数元素](https://leetcode.cn/problems/majority-element/) 问题的最优解法，具有 O(n) 时间复杂度和 O(1) 空间复杂度。

### 🌟 [点击这里访问在线演示](https://fuck-algorithm.github.io/leetcode-169-majority-element/)

## ✨ 特点

- 📊 **交互式动画**：直观展示算法每一步的执行过程
- 🔍 **详细解释**：每个步骤都有详细说明，帮助理解算法原理
- 🎮 **可控制**：支持播放、暂停、步进和速度调节
- 📱 **响应式设计**：适配各种屏幕尺寸
- 🎲 **自定义输入**：支持输入自定义数组或生成随机数据
- 🖥️ **代码同步**：动画与算法代码同步高亮显示

## 🖼️ 屏幕截图

<div align="center">
  <img src="https://via.placeholder.com/800x450.png?text=Boyer-Moore+Algorithm+Visualization" alt="Boyer-Moore算法可视化截图" width="80%" />
</div>

## 🧠 算法原理

Boyer-Moore 投票算法是一种高效寻找数组中多数元素（出现次数超过半数）的算法。其核心思想是：

1. 维护一个**候选值** `candidate` 和一个**计数器** `count`
2. 遍历数组时：
   - 若 `count == 0`，将当前元素设为候选值
   - 若当前元素与候选值相同，`count++`；否则 `count--`
3. 遍历结束后，`candidate` 即为多数元素

算法基于一个关键假设：如果一个元素是多数元素，那么将它的出现记为 +1，其他元素记为 -1，整个数组的总和必然是正数。

## 🛠️ 技术栈

- **React** + **TypeScript**：前端框架与类型系统
- **D3.js**：数据可视化库
- **Styled Components**：CSS-in-JS 样式解决方案
- **GitHub Actions**：自动部署到 GitHub Pages

## 🚀 本地开发

如果您想在本地运行此项目：

```bash
# 克隆仓库
git clone https://github.com/fuck-algorithm/leetcode-169-majority-element.git

# 进入项目目录
cd leetcode-169-majority-element

# 安装依赖
npm install

# 启动开发服务器
npm start
```

## 📚 相关资源

- [LeetCode 169. 多数元素](https://leetcode.cn/problems/majority-element/)
- [Boyer-Moore 投票算法解析](https://leetcode.cn/problems/majority-element/solution/duo-shu-yuan-su-by-leetcode-solution/)
- [更多 LeetCode Hot 100 题解](https://fuck-algorithm.github.io/leetcode-hot-100/)

## 📄 许可证

本项目基于 MIT 许可证开源 - 查看 [LICENSE](LICENSE) 文件获取更多信息。

---

<div align="center">
  <a href="https://fuck-algorithm.github.io/leetcode-hot-100/">
    ⬅️ 返回 LeetCode Hot 100 列表
  </a>
</div> 