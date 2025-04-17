import React from 'react';
import styled from 'styled-components';
import BoyerMooreAnimation from './components/BoyerMooreAnimation';

const AppContainer = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f0f2f5;
  overflow: hidden;
`;

const Header = styled.header`
  background: #1a1a1a;
  color: white;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const LeftHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const BackLink = styled.a`
  color: white;
  text-decoration: none;
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  
  &:hover {
    text-decoration: underline;
  }
  
  svg {
    margin-right: 5px;
  }
`;

const Title = styled.h1`
  margin: 0;
  font-size: 1.5rem;
`;

const HeaderLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const MainContent = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

// 返回箭头图标
const BackArrow = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
    <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
  </svg>
);

// GitHub徽标SVG组件
const GitHubLogo = () => (
  <svg width="24" height="24" viewBox="0 0 16 16" fill="white">
    <path fillRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
  </svg>
);

function App() {
  // 示例数组
  const nums = [2, 2, 1, 1, 1, 2, 2];

  return (
    <AppContainer>
      <Header>
        <LeftHeader>
          <BackLink href="https://fuck-algorithm.github.io/leetcode-hot-100/" title="返回LeetCode Hot 100列表">
            <BackArrow /> 返回LeetCode Hot 100
          </BackLink>
          <Title>Boyer-Moore 投票算法演示</Title>
        </LeftHeader>
        <HeaderLinks>
          <a href="https://leetcode.cn/problems/majority-element/" target="_blank" rel="noopener noreferrer" style={{ color: 'white' }}>
            LeetCode 169
          </a>
          <a href="https://github.com/fuck-algorithm/leetcode-169-majority-element" target="_blank" rel="noopener noreferrer" title="查看GitHub源码">
            <GitHubLogo />
          </a>
        </HeaderLinks>
      </Header>
      <MainContent>
        <BoyerMooreAnimation nums={nums} />
      </MainContent>
    </AppContainer>
  );
}

export default App; 