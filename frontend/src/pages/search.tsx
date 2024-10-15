import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import RatingComponent from '@/components/ui/RatingComponent';

interface Article {
  _id: string;
  title: string;
  author: string;
  yearOfPub: string;
  volume: string;
  doi: string;
  category: string; 
  summary: string; 
}

export default function Component() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch("http://localhost:8082/articles/search", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch articles');
        }
        const data: Article[] = await response.json();
        
        setArticles(data);
        setFilteredArticles(data); // Initialize filtered articles
      } catch (err) {
        console.error(err); 
      }
    };

    fetchArticles();
  }, []);

  const handleSearch = async () => {
    if (!searchQuery) {
      setFilteredArticles(articles);
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:8082/articles/search?query=${searchQuery}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch articles');
      }

      const data: Article[] = await response.json();
      setFilteredArticles(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleReset = () => {
    setSearchQuery('');
    setFilteredArticles(articles); 
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Article Search</h1>
      
      <div className="mb-4 flex items-center">
        <input
          type="text"
          placeholder="Search by title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border border-gray-300 rounded p-2 mr-2 flex-grow"
        />
        <Button onClick={handleSearch} className="mr-2">Search</Button>
        <Button onClick={handleReset} variant="outline">Reset</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Year of Publication</TableHead>
            <TableHead>Volume</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="w-1/3">Summary</TableHead>
            <TableHead>DOI</TableHead>
            <TableHead>Rating</TableHead> {/* New column for ratings */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredArticles.length > 0 ? (
            filteredArticles.map(article => (
              <TableRow key={article._id}>
                <TableCell>{article.title}</TableCell>
                <TableCell>{article.author}</TableCell>
                <TableCell>{article.yearOfPub}</TableCell>
                <TableCell>{article.volume}</TableCell>
                <TableCell>{article.category}</TableCell>
                <TableCell className="break-words">{article.summary}</TableCell>
                <TableCell>{article.doi}</TableCell>
                <TableCell>
                  <RatingComponent articleId={article._id} /> {/* Integrate RatingComponent */}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="text-center">
                No results found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
