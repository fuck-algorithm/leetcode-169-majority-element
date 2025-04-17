import React, { useEffect, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import * as d3 from 'd3';
import { ArrayElement, AnimationStep } from '../types';

interface Props {
  nums: number[];
}

// 脉冲动画
const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(255, 193, 7, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(255, 193, 7, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 193, 7, 0);
  }
`;

// 呼吸动画
const breath = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

// 上浮动画
const float = keyframes`
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
`;

// 定义颜色常量，统一管理颜色
const COLORS = {
  CURRENT: "#FFC107", // 黄色 - 当前处理的元素
  CANDIDATE: "#9C27B0", // 紫色边框 - 候选值
  CANDIDATE_MATCH: "#4CAF50", // 绿色 - 与候选值匹配的元素
  NON_MATCH: "#F44336", // 红色 - 与候选值不匹配的元素
  NEUTRAL: "#BBBBBB", // 灰色 - 未处理或中立状态
};

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

const AnimationPanel = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 15px;
  background: #f5f5f5;
  overflow: hidden;
`;

const CodePanel = styled.div`
  width: 35%;
  padding: 15px;
  background: #263238;
  color: white;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

// 添加颜色图例组件样式
const Legend = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 10px 0;
  justify-content: center;
  font-size: 13px;
  background: rgba(255, 255, 255, 0.8);
  padding: 8px;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  margin-right: 10px;
`;

const ColorBox = styled.div<{ color: string }>`
  width: 15px;
  height: 15px;
  margin-right: 5px;
  background-color: ${props => props.color};
  border-radius: 3px;
`;

const Controls = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
  flex-wrap: wrap;
  justify-content: center;
`;

const Button = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background: #4CAF50;
  color: white;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: #45a049;
  }
`;

const ResetButton = styled(Button)`
  background: #f44336;
  
  &:hover {
    background: #d32f2f;
  }
`;

const RandomButton = styled(Button)`
  background: #2196F3;
  
  &:hover {
    background: #1976D2;
  }
`;

const Status = styled.div`
  display: flex;
  gap: 15px;
  margin: 15px 0;
  flex-wrap: wrap;
  justify-content: center;
`;

const StatusItem = styled.div<{ isCandidate?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 15px;
  border-radius: 4px;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  animation: ${props => props.isCandidate ? breath : 'none'} 2s infinite;
`;

const StatusLabel = styled.div`
  font-size: 12px;
  color: #666;
  margin-bottom: 3px;
`;

const StatusValue = styled.div<{ isPositive?: boolean; isZero?: boolean }>`
  font-size: 18px;
  font-weight: bold;
  color: ${props => props.isPositive ? '#4CAF50' : props.isZero ? '#FFC107' : '#F44336'};
`;

const CodePreview = styled.div`
  flex: 1;
  overflow-y: auto;
  padding-right: 10px;
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-track {
    background: #37474F;
  }
  &::-webkit-scrollbar-thumb {
    background: #607D8B;
    border-radius: 4px;
  }
`;

const CodeLine = styled.pre<{ isActive: boolean }>`
  margin: 0;
  padding: 5px 10px;
  font-family: 'Consolas', monospace;
  color: #EEFFFF;
  background: ${props => props.isActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent'};
  border-left: ${props => props.isActive ? '3px solid #FFC107' : '3px solid transparent'};
`;

const InputContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
  width: 100%;
`;

const Input = styled.input`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  flex-grow: 1;
`;

const AlgorithmExplanation = styled.div`
  margin-top: 15px;
  padding: 15px;
  background: #37474F;
  border-radius: 4px;
  font-size: 0.9rem;
  overflow-y: auto;
  max-height: 150px;
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-track {
    background: #37474F;
  }
  &::-webkit-scrollbar-thumb {
    background: #607D8B;
    border-radius: 4px;
  }
`;

const Title = styled.h3`
  margin-top: 0;
  margin-bottom: 10px;
  color: #E1F5FE;
  font-size: 1.2rem;
`;

const SVGContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

// 添加描述面板样式
const StepDescription = styled.div`
  background: rgba(255, 255, 255, 0.9);
  border-radius: 4px;
  padding: 10px 15px;
  margin: 10px 0;
  border-left: 4px solid #2196F3;
  font-size: 14px;
  line-height: 1.5;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const BoyerMooreAnimation: React.FC<Props> = ({ nums: initialNums }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [steps, setSteps] = useState<AnimationStep[]>([]);
  const [nums, setNums] = useState<number[]>(initialNums);
  const [inputValue, setInputValue] = useState('');

  // 算法代码
  const algorithmCode = [
    'function majorityElement(nums) {',
    '  let count = 0;',
    '  let candidate = null;',
    '',
    '  for (let num of nums) {',
    '    if (count === 0) {',
    '      candidate = num;',
    '    }',
    '    count += (num === candidate) ? 1 : -1;',
    '  }',
    '',
    '  return candidate;',
    '}'
  ];

  // 生成动画步骤
  useEffect(() => {
    const generateSteps = () => {
      const newSteps: AnimationStep[] = [];
      let candidate: number | null = null;
      let count = 0;
      
      // 初始状态
      const initialElements: ArrayElement[] = nums.map((value, i) => ({
        value,
        index: i,
        isCurrent: false,
        isCandidateMatch: false
      }));
      
      newSteps.push({
        elements: initialElements,
        candidate: null,
        count: 0,
        codeLine: 0,
        description: "初始状态：候选值candidate为null，计数器count为0。我们将开始遍历数组，寻找多数元素。"
      });

      nums.forEach((num, index) => {
        // 先处理当前元素标记和描述
        let codeLine = 0;
        let description = "";
        let newCandidate = candidate;
        let newCount = count;
        
        // 创建数组元素，计算出每个元素的状态
        const elements: ArrayElement[] = nums.map((value, i) => {
          const isCurrent = i === index;

          // 根据实际逻辑确定元素是否匹配候选值
          // 对于当前处理的元素，需要按照处理逻辑确定其匹配状态
          let isCandidateMatch = false;
          
          if (i < index) {
            // 已处理的元素，根据最终候选值确定颜色
            isCandidateMatch = value === candidate;
          } else if (i === index) {
            // 当前元素，暂时未确定匹配状态
            // 将在下面的处理逻辑中设置
            isCandidateMatch = false;
          } else {
            // 未处理的元素，保持中性色
            isCandidateMatch = false;
          }
          
          return {
            value,
            index: i,
            isCurrent,
            isCandidateMatch
          };
        });

        // 处理计数逻辑
        if (count === 0) {
          // 当计数器为0时，设置新的候选值
          description = `当前正在处理元素 ${num}（黄色标记）。\n计数器count为0，将当前元素 ${num} 设为新的候选值candidate。\n现在candidate = ${num}, count = 1。`;
          newCandidate = num;
          newCount = 1;
          codeLine = 6; // if (count === 0) { ... }
          
          // 当前元素变为候选值
          elements[index].isCandidateMatch = true;
        } else if (num === candidate) {
          // 当前元素与候选值相同，计数器加1
          newCount = count + 1;
          description = `当前正在处理元素 ${num}（黄色标记）。\n由于元素值等于当前候选值 ${candidate}，计数器count加1。\n现在candidate = ${candidate}, count = ${newCount}。`;
          codeLine = 8; // count += (num === candidate) ? 1 : -1;
          
          // 当前元素与候选值匹配
          elements[index].isCandidateMatch = true;
        } else {
          // 当前元素与候选值不同，计数器减1
          newCount = count - 1;
          description = `当前正在处理元素 ${num}（黄色标记）。\n由于元素值不等于当前候选值 ${candidate}，计数器count减1。\n现在candidate = ${candidate}, count = ${newCount}。`;
          codeLine = 8; // count += (num === candidate) ? 1 : -1;
          
          // 当前元素与候选值不匹配
          elements[index].isCandidateMatch = false;
        }

        // 保存这一步的状态
        newSteps.push({
          elements,
          candidate: newCandidate,
          count: newCount,
          codeLine,
          description
        });
        
        // 更新状态为下一步做准备
        candidate = newCandidate;
        count = newCount;
      });
      
      // 最终状态 - 突出显示所有匹配的元素
      const finalElements: ArrayElement[] = nums.map((value, i) => ({
        value,
        index: i,
        isCurrent: false,
        isCandidateMatch: value === candidate
      }));
      
      newSteps.push({
        elements: finalElements,
        candidate,
        count,
        codeLine: 11, // return candidate;
        description: `遍历结束！在Boyer-Moore投票算法中，最终的候选值 ${candidate} 就是多数元素。\n所有等于多数元素的值都标记为绿色。\nBoyer-Moore算法基于一个前提：如果一个元素出现次数超过数组长度的一半，则这个元素必然会被最终选为候选值。`
      });

      setSteps(newSteps);
      setCurrentStep(0);
      setIsPlaying(false);
    };

    generateSteps();
  }, [nums]);

  // D3动画逻辑
  useEffect(() => {
    if (!svgRef.current || steps.length === 0 || currentStep >= steps.length) return;

    const svgContainer = d3.select(svgRef.current);
    
    // 获取SVG容器尺寸
    const containerWidth = svgRef.current.clientWidth || 600;
    const containerHeight = svgRef.current.clientHeight || 300;
    
    // 根据数组长度调整元素大小
    const elementWidth = Math.min(60, containerWidth / (nums.length + 2));
    const elementHeight = Math.min(60, containerHeight / 4);

    // 清除现有内容
    svgContainer.selectAll("*").remove();

    // 创建数组元素
    const elements = svgContainer.selectAll(".array-element")
      .data(steps[currentStep].elements)
      .enter()
      .append("g")
      .attr("class", "array-element")
      .attr("transform", (d, i) => {
        const x = i * (elementWidth + 5) + (containerWidth - nums.length * (elementWidth + 5)) / 2;
        return `translate(${x}, ${containerHeight/3})`;
      });

    // 添加矩形背景 - 使用统一的颜色常量
    elements.append("rect")
      .attr("width", elementWidth)
      .attr("height", elementHeight)
      .attr("rx", 5)
      .attr("fill", d => {
        if (d.isCurrent) {
          return COLORS.CURRENT; // 当前元素为黄色
        } else if (d.value === steps[currentStep].candidate) {
          // 如果值等于当前候选值
          return COLORS.CANDIDATE_MATCH; // 匹配元素为绿色
        } else {
          return COLORS.NON_MATCH; // 不匹配元素为红色
        }
      })
      .attr("opacity", d => d.isCurrent ? 1 : 0.8)
      .attr("stroke", d => d.value === steps[currentStep].candidate ? COLORS.CANDIDATE : "none")
      .attr("stroke-width", 3);

    // 添加数字文本
    elements.append("text")
      .attr("x", elementWidth / 2)
      .attr("y", elementHeight / 2 + 5)
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .attr("font-size", Math.min(18, elementWidth / 2))
      .attr("font-weight", "bold")
      .text(d => d.value);

    // 添加当前元素指示器
    elements.filter(d => d.isCurrent)
      .append("path")
      .attr("d", `M${elementWidth/2 - 10},${elementHeight + 5} L${elementWidth/2},${elementHeight + 15} L${elementWidth/2 + 10},${elementHeight + 5}`)
      .attr("fill", "#FFC107");

    // 计数器可视化 - 使用统一的颜色常量
    const countValue = steps[currentStep].count;
    const maxBarHeight = containerHeight / 3;
    const barHeight = Math.min(Math.abs(countValue) * 15, maxBarHeight);
    const barY = containerHeight * 2/3; // 底部位置
    
    svgContainer.append("rect")
      .attr("x", containerWidth - 70)
      .attr("y", countValue >= 0 ? barY - barHeight : barY)
      .attr("width", 30)
      .attr("height", barHeight || 2) // 至少2px高度，确保0值可见
      .attr("fill", countValue > 0 ? COLORS.CANDIDATE_MATCH : countValue < 0 ? COLORS.NON_MATCH : COLORS.CURRENT);
    
    svgContainer.append("line")
      .attr("x1", containerWidth - 80)
      .attr("y1", barY)
      .attr("x2", containerWidth - 30)
      .attr("y2", barY)
      .attr("stroke", "#333")
      .attr("stroke-width", 2);

    // 添加计数器标签
    svgContainer.append("text")
      .attr("x", containerWidth - 55)
      .attr("y", barY + 20)
      .attr("text-anchor", "middle")
      .attr("fill", "#333")
      .text("计数器");

    // 在这里添加当前步骤描述的显示
    svgContainer.append("foreignObject")
      .attr("x", 10)
      .attr("y", 10)
      .attr("width", containerWidth - 100)
      .attr("height", containerHeight / 4)
      .append("xhtml:div")
      .style("font-family", "sans-serif")
      .style("font-size", "14px")
      .style("background-color", "rgba(255, 255, 255, 0.85)")
      .style("padding", "10px")
      .style("border-radius", "5px")
      .style("border-left", "4px solid #2196F3")
      .style("box-shadow", "0 2px 4px rgba(0, 0, 0, 0.1)")
      .html(steps[currentStep].description.replace(/\n/g, '<br>'));

  }, [currentStep, steps, nums]);

  // 动画控制
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= steps.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 1000 / speed);

    return () => clearInterval(interval);
  }, [isPlaying, speed, steps.length]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(0, prev - 1));
  };

  const handleNextStep = () => {
    setCurrentStep(prev => Math.min(steps.length - 1, prev + 1));
  };

  const handleReset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSpeed(parseFloat(e.target.value));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputSubmit = () => {
    try {
      let rawInput = inputValue.trim();
      
      // 尝试处理非严格JSON格式，如 [2, 2, 1, 1, 1, 2, 2] 或 2, 2, 1, 1, 1, 2, 2
      if (!rawInput.startsWith('[')) {
        rawInput = `[${rawInput}]`;
      }
      
      // 解析输入的数组
      const newNums = JSON.parse(rawInput);
      if (Array.isArray(newNums) && newNums.every(num => typeof num === 'number')) {
        // 限制数组长度，避免性能问题
        const limitedArray = newNums.slice(0, 15);
        setNums(limitedArray);
        if (limitedArray.length < newNums.length) {
          alert('数组太长，已截取前15个元素进行演示');
        }
      } else {
        alert('请输入有效的数字数组，例如: [2, 2, 1, 1, 1, 2, 2]');
      }
    } catch (e) {
      alert('请输入有效的数组格式，例如: [2, 2, 1, 1, 1, 2, 2] 或 2, 2, 1, 1, 1, 2, 2');
    }
  };

  const handleRandomArray = () => {
    // 生成更有意义的随机数组
    const length = Math.floor(Math.random() * 5) + 5; // 5-9的随机长度，避免数组过长
    const majorityElementValue = Math.floor(Math.random() * 5); // 0-4的随机值
    const majorityCount = Math.floor(length / 2) + 1; // 保证多数元素超过一半

    const randomArray: number[] = [];
    // 添加多数元素
    for (let i = 0; i < majorityCount; i++) {
      randomArray.push(majorityElementValue);
    }
    // 添加其他随机元素，确保它们不同于多数元素
    for (let i = majorityCount; i < length; i++) {
      let randomNum: number;
      do {
        randomNum = Math.floor(Math.random() * 5);
      } while (randomNum === majorityElementValue);
      randomArray.push(randomNum);
    }

    // 打乱数组
    const shuffled = [...randomArray];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    setNums(shuffled);
    setInputValue(JSON.stringify(shuffled));
  };

  return (
    <Container>
      <AnimationPanel>
        <InputContainer>
          <Input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="输入数组，例如: [2, 2, 1, 1, 1, 2, 2]"
          />
          <Button onClick={handleInputSubmit}>确定</Button>
          <RandomButton onClick={handleRandomArray}>随机</RandomButton>
        </InputContainer>

        <Controls>
          <Button onClick={handlePlayPause}>
            {isPlaying ? '⏸️ 暂停' : '▶️ 播放'}
          </Button>
          <Button onClick={handlePrevStep}>⏮️ 上一步</Button>
          <Button onClick={handleNextStep}>⏭️ 下一步</Button>
          <ResetButton onClick={handleReset}>🔄 重置</ResetButton>
          <div>
            <span>速度: </span>
            <input
              type="range"
              min="0.5"
              max="3"
              step="0.5"
              value={speed}
              onChange={handleSpeedChange}
            />
            <span>{speed}x</span>
          </div>
        </Controls>

        {/* 添加颜色图例说明 */}
        <Legend>
          <LegendItem>
            <ColorBox color={COLORS.CURRENT} />
            <span>当前处理元素</span>
          </LegendItem>
          <LegendItem>
            <ColorBox color={COLORS.CANDIDATE_MATCH} />
            <span>与候选值匹配</span>
          </LegendItem>
          <LegendItem>
            <ColorBox color={COLORS.NON_MATCH} />
            <span>与候选值不匹配</span>
          </LegendItem>
          <LegendItem>
            <div style={{ width: '15px', height: '15px', marginRight: '5px', border: `2px solid ${COLORS.CANDIDATE}`, borderRadius: '3px' }}></div>
            <span>当前候选值</span>
          </LegendItem>
        </Legend>

        {/* 添加操作指引 */}
        {currentStep === 0 && (
          <div style={{ 
            textAlign: 'center', 
            margin: '10px 0', 
            padding: '8px', 
            background: '#E3F2FD', 
            borderRadius: '4px',
            color: '#0D47A1'
          }}>
            <p style={{ margin: '0 0 5px 0' }}>
              <strong>👆 点击按钮开始演示，或使用上面的控制按钮逐步查看</strong>
            </p>
            <p style={{ margin: '0', fontSize: '13px' }}>
              可以尝试输入自定义数组或生成随机数组来测试不同情况
            </p>
          </div>
        )}

        <SVGContainer>
          <svg ref={svgRef} width="100%" height="100%" />
        </SVGContainer>

        {/* 添加当前步骤的文字描述 */}
        <StepDescription>
          {steps[currentStep]?.description.split('\n').map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </StepDescription>

        <Status>
          <StatusItem isCandidate={true}>
            <StatusLabel>当前候选值</StatusLabel>
            <StatusValue>{steps[currentStep]?.candidate ?? '未设置'}</StatusValue>
          </StatusItem>
          <StatusItem>
            <StatusLabel>计数器</StatusLabel>
            <StatusValue 
              isPositive={steps[currentStep]?.count > 0}
              isZero={steps[currentStep]?.count === 0}
            >
              {steps[currentStep]?.count ?? 0}
            </StatusValue>
          </StatusItem>
          <StatusItem>
            <StatusLabel>当前步骤</StatusLabel>
            <StatusValue>{currentStep} / {steps.length - 1}</StatusValue>
          </StatusItem>
        </Status>
      </AnimationPanel>

      <CodePanel>
        <Title>算法代码</Title>
        <CodePreview>
          {algorithmCode.map((line, index) => (
            <CodeLine 
              key={index} 
              isActive={steps[currentStep]?.codeLine === index}
            >
              {line}
            </CodeLine>
          ))}
        </CodePreview>

        <AlgorithmExplanation>
          <Title>Boyer-Moore 投票算法原理</Title>
          <p>此算法用于寻找数组中的多数元素（出现次数超过数组长度一半的元素）。</p>
          <p>核心思想：维护一个候选值和计数器，如果当前元素与候选值相同，计数器加1，否则减1。当计数器为0时，更换候选值。</p>
          <p>时间复杂度：O(n)，空间复杂度：O(1)</p>
        </AlgorithmExplanation>
      </CodePanel>
    </Container>
  );
};

export default BoyerMooreAnimation; 