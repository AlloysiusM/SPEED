import { useEffect, useState } from 'react';
import axios from 'axios';

export default function RejectedArticlesPage() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    // Fetch rejected articles from the backend
    axios.get('http://localhost:3000/moderation/rejected').then((res) => {
      setArticles(res.data);
    });
  }, []);

  return (
    <div>
      <h1>Rejected Articles</h1>
      <ul>
        {articles.map((article) => (
          <li key={article._id}>
            <h2>{article.title}</h2>
            <p>{article.authors} - {article.year} - {article.journal}</p>
            <p>Status: {article.status}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
