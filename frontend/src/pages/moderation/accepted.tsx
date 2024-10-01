import { useEffect, useState } from 'react';
import axios from 'axios';

export default function AcceptedArticlesPage() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    // Fetch accepted articles from the backend
    axios.get('http://localhost:3000/moderation/accepted').then((res) => {
      setArticles(res.data);
    });
  }, []);

  return (
    <div>
      <h1>Accepted Articles</h1>
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
