import { useEffect, useState } from 'react';

interface Article {
    _id: string;
    title: string;
    content: string;
    status: 'accepted' | 'rejected' | 'pending';
}

const ArticlesPage = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [error, setError] = useState<string | null>(null); // For error handling

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const response = await fetch('http://localhost:8082/articles');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setArticles(data);
            } catch (error) {
                console.error('Failed to fetch articles:', error);
                setError('Failed to fetch articles. Please try again later.');
            }
        };
        fetchArticles();
    }, []);

    const updateArticleStatus = async (id: string, status: 'accepted' | 'rejected') => {
        try {
            const response = await fetch(`http://localhost:8082/articles/${id}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status }),
            });
            if (!response.ok) {
                throw new Error('Failed to update status');
            }
            const updatedArticle = await response.json();
            // Update the articles state
            setArticles(prevArticles =>
                prevArticles.map(article => (article._id === updatedArticle._id ? updatedArticle : article))
            );
        } catch (error) {
            console.error('Failed to update article status:', error);
        }
    };

    return (
        <div className="container"> {/* Add container class */}
            <h1>Articles</h1>
            {error && <p>{error}</p>} {/* Display error message if any */}
            {articles.length === 0 ? ( // Check if there are no articles
                <p>No articles available.</p> // Display this message if no articles are found
            ) : (
                <ul>
                    {articles.map(article => (
                        <li key={article._id} className="article"> {/* Add article class */}
                            <h2>{article.title}</h2>
                            <p>{article.content}</p>
                            <p className="status">Status: {article.status}</p>
                            <button className="button" onClick={() => updateArticleStatus(article._id, 'accepted')}>Accept</button>
                            <button className="button" onClick={() => updateArticleStatus(article._id, 'rejected')}>Reject</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ArticlesPage;
