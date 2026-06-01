/**
 * Documents.jsx — Updated to fetch from Django API
 */

import React, { useState } from 'react';
import { useAPI } from '../services/useAPI';
import { documentsAPI } from '../services/api';

const CATEGORIES = ['All', 'Guidelines', 'Orders', 'Templates', 'Reports', 'Tenders', 'Circulars'];

export default function Documents() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const apiParams = {
    ...(activeCategory !== 'All' && { category: activeCategory.toLowerCase() }),
    ...(searchQuery && { search: searchQuery }),
  };

  const { data, loading, error } = useAPI(documentsAPI.getAll, apiParams, [activeCategory, searchQuery]);
  const documents = data?.results || data || [];

  if (loading) return <div className="loading-spinner">Loading documents...</div>;
  if (error) return <div className="error-message">Failed to load documents.</div>;

  return (
    <section id="documents" className="documents-section">
      <h2>Documents & Resources</h2>
      <div className="category-tabs">
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)}
            className={`tab-btn ${activeCategory === cat ? 'active' : ''}`}>
            {cat}
          </button>
        ))}
      </div>
      <input type="text" placeholder="Search documents..." value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)} className="search-input" />
      <div className="documents-grid">
        {documents.length === 0 ? <p>No documents found.</p> : documents.map(doc => (
          <div key={doc.id} className="document-card">
            <div className="doc-badge">{doc.file_type}</div>
            <h3>{doc.title}</h3>
            <p className="doc-category">{doc.category}</p>
            {doc.description && <p className="doc-desc">{doc.description}</p>}
            <div className="doc-footer">
              {doc.file_size_display && <span>{doc.file_size_display}</span>}
              {doc.file_url && (
                <a href={doc.file_url} target="_blank" rel="noopener noreferrer" className="btn-download">
                  Download
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
