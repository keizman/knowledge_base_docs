import React, { useState } from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Notes & Documents',
    icon: '📝',
    description: 'Access all your personal notes, documents and research materials in one organized place.',
    link: '/docs/notes'
  },
  {
    title: 'Projects',
    icon: '🚀',
    description: 'Track your ongoing projects, timelines, and related resources for quick reference.',
    link: '/docs/projects'
  },
  {
    title: 'Reference Library',
    icon: '📚',
    description: 'Browse your collection of articles, books, and learning materials organized by topic.',
    link: '/docs/library'
  },
  {
    title: 'Code Snippets',
    icon: '💻',
    description: 'Find and reuse your code snippets organized by language and functionality.',
    link: '/docs/snippets'
  },
  {
    title: 'Ideas & Inspirations',
    icon: '💡',
    description: 'Capture creative ideas, inspirations, and thoughts for future exploration.',
    link: '/docs/ideas'
  },
  {
    title: 'Learning Resources',
    icon: '🧠',
    description: 'Access courses, tutorials and educational content you\'ve collected for continuing education.',
    link: '/docs/learning'
  },
];

function Feature({ icon, title, description, link }) {
  return (
    <div className={clsx('col col--4')}>
      <div className={styles.featureCard}>
        <div className={styles.featureIconWrapper}>
          <span className={styles.featureIcon}>{icon}</span>
        </div>
        <div className={styles.featureContent}>
          <h3><a href={link} className={styles.featureLink}>{title}</a></h3>
          <p>{description}</p>
        </div>
        <div className={styles.featureAction}>
          <a href={link} className={styles.featureButton}>Explore →</a>
        </div>
      </div>
    </div>
  );
}

function SearchBar() {
  const [query, setQuery] = useState('');
  
  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search functionality here
    console.log('Searching for:', query);
  };
  
  return (
    <div className={styles.searchContainer}>
      <form onSubmit={handleSearch} className={styles.searchForm}>
        <input
          type="text"
          placeholder="Search your knowledge base..."
          className={styles.searchInput}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" className={styles.searchButton}>
          <span role="img" aria-label="search">🔍</span>
        </button>
      </form>
    </div>
  );
}

function Header() {
  return (
    <div className={styles.header}>
      <h1 className={styles.headerTitle}>Zard's Knowledge Base</h1>
      <p className={styles.headerSubtitle}>Centralized hub for knowledge management and learning</p>
      <SearchBar />
    </div>
  );
}

function QuickLinks() {
  const links = [
    { title: 'Recent Blogs', link: '/blog' },
    { title: 'Favorites', link: '/favorites' },
    { title: 'Tags', link: '/tags' },
    { title: 'Statistics', link: '/stats' },
  ];
  
  return (
    <div className={styles.quickLinksContainer}>
      <div className={styles.quickLinks}>
        {links.map((item, index) => (
          <a key={index} href={item.link} className={styles.quickLink}>
            {item.title}
          </a>
        ))}
      </div>
    </div>
  );
}

function Footer() {
  return (
    <div className={styles.footer}>
      {/* <p>Last updated: {new Date().toLocaleDateString()}</p> */}
      {/* <p>© {new Date().getFullYear()} Personal Knowledge Base</p> */}
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <div className={styles.homepageContainer}>
      <Header />
      <QuickLinks />
      <section className={styles.features}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Knowledge Collections</h2>
          <div className="row">
            {FeatureList.map((props, idx) => (
              <Feature key={idx} {...props} />
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
