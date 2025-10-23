/**
 * Mock Data for Phase 6b: Data Fetching
 * Simulates backend API responses
 */

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  stock: number;
}

export interface Review {
  id: string;
  productId: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Recommendation {
  id: string;
  name: string;
  price: number;
  image: string;
}

// Mock Products Database
export const MOCK_PRODUCTS: Record<string, Product> = {
  '1': {
    id: '1',
    name: 'React 18 完全指南',
    price: 99.99,
    description: '深入学习 React 18 的新特性，包括并发渲染、Suspense、Server Components 等核心概念。适合中高级开发者。',
    image: 'https://picsum.photos/seed/react18/400/300',
    category: '编程书籍',
    stock: 50,
  },
  '2': {
    id: '2',
    name: 'TypeScript 实战教程',
    price: 79.99,
    description: '从零开始掌握 TypeScript，包含类型系统、泛型、装饰器、编译配置等实用知识。附带大量实战项目。',
    image: 'https://picsum.photos/seed/typescript/400/300',
    category: '编程书籍',
    stock: 30,
  },
  '3': {
    id: '3',
    name: 'Webpack 5 深度解析',
    price: 89.99,
    description: 'Webpack 5 核心原理与实践，涵盖模块打包、代码分割、Tree Shaking、HMR 等高级特性。',
    image: 'https://picsum.photos/seed/webpack5/400/300',
    category: '编程书籍',
    stock: 20,
  },
  '123': {
    id: '123',
    name: 'SSR 服务端渲染实战',
    price: 109.99,
    description: '全面讲解 React SSR 技术栈，包括 Next.js、流式渲染、SEO 优化、性能调优等核心内容。',
    image: 'https://picsum.photos/seed/ssr-guide/400/300',
    category: '编程书籍',
    stock: 15,
  },
};

// Mock Reviews Database
export const MOCK_REVIEWS: Record<string, Review[]> = {
  '1': [
    {
      id: 'r1',
      productId: '1',
      author: '张三',
      rating: 5,
      comment: '非常棒的 React 18 教程！讲解清晰，示例丰富，强烈推荐给想深入学习的同学。',
      date: '2025-10-20',
    },
    {
      id: 'r2',
      productId: '1',
      author: '李四',
      rating: 4,
      comment: '内容很全面，但有些章节比较难，需要反复阅读。总体来说是本好书。',
      date: '2025-10-18',
    },
    {
      id: 'r3',
      productId: '1',
      author: '王五',
      rating: 5,
      comment: 'Concurrent Mode 讲得很透彻，对我帮助很大！',
      date: '2025-10-15',
    },
  ],
  '2': [
    {
      id: 'r4',
      productId: '2',
      author: '赵六',
      rating: 5,
      comment: 'TypeScript 入门的最佳选择，例子很实用。',
      date: '2025-10-19',
    },
    {
      id: 'r5',
      productId: '2',
      author: '孙七',
      rating: 4,
      comment: '适合有一定 JavaScript 基础的人学习。',
      date: '2025-10-17',
    },
  ],
  '3': [
    {
      id: 'r6',
      productId: '3',
      author: '周八',
      rating: 5,
      comment: 'Webpack 配置不再是黑盒，这本书帮我理清了思路！',
      date: '2025-10-16',
    },
  ],
  '123': [
    {
      id: 'r7',
      productId: '123',
      author: '吴九',
      rating: 5,
      comment: 'SSR 实战指南，从原理到实践都讲得很好，推荐！',
      date: '2025-10-21',
    },
    {
      id: 'r8',
      productId: '123',
      author: '郑十',
      rating: 5,
      comment: '这是我见过最好的 SSR 教程，Next.js 部分特别详细。',
      date: '2025-10-22',
    },
  ],
};

// Mock Recommendations
export const MOCK_RECOMMENDATIONS: Record<string, Recommendation[]> = {
  '1': [
    {
      id: '2',
      name: 'TypeScript 实战教程',
      price: 79.99,
      image: 'https://picsum.photos/seed/typescript-sm/200/150',
    },
    {
      id: '123',
      name: 'SSR 服务端渲染实战',
      price: 109.99,
      image: 'https://picsum.photos/seed/ssr-sm/200/150',
    },
  ],
  '2': [
    {
      id: '1',
      name: 'React 18 完全指南',
      price: 99.99,
      image: 'https://picsum.photos/seed/react-sm/200/150',
    },
    {
      id: '3',
      name: 'Webpack 5 深度解析',
      price: 89.99,
      image: 'https://picsum.photos/seed/webpack-sm/200/150',
    },
  ],
  '3': [
    {
      id: '1',
      name: 'React 18 完全指南',
      price: 99.99,
      image: 'https://picsum.photos/seed/react-sm/200/150',
    },
  ],
  '123': [
    {
      id: '1',
      name: 'React 18 完全指南',
      price: 99.99,
      image: 'https://picsum.photos/seed/react-sm/200/150',
    },
    {
      id: '3',
      name: 'Webpack 5 深度解析',
      price: 89.99,
      image: 'https://picsum.photos/seed/webpack-sm/200/150',
    },
  ],
};
