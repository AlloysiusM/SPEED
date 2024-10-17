import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import RatingComponent from '@/components/ui/RatingComponent';
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

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

interface Column {
  key: keyof Article;
  label: string;
}

const columns: Column[] = [
  { key: "title", label: "Title" },
  { key: "author", label: "Author" },
  { key: "yearOfPub", label: "Year of Publication" },
  { key: "volume", label: "Volume" },
  { key: "category", label: "Software Practice" },
  { key: "summary", label: "Claim/Evidence" },
  { key: "doi", label: "DOI" },
];

export default function Component() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [visibleColumns, setVisibleColumns] = useState<(keyof Article)[]>(columns.map(col => col.key));
  const [previousSearches, setPreviousSearches] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/articles/search`, {
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
        setFilteredArticles(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchArticles();

    // Load previous searches from localStorage
    const savedSearches = localStorage.getItem('previousSearches');
    if (savedSearches) {
      const parsedSearches = JSON.parse(savedSearches);
      setPreviousSearches(Array.isArray(parsedSearches) ? parsedSearches : []);
    }
  }, []);

  const handleSearch = async () => {
    // Prevent searching with an empty query
    if (!searchQuery.trim()) {
      return;
    }
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/articles/search?query=${searchQuery}`, {
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

      // Add the search query to previous searches
      const updatedSearches = [searchQuery, ...previousSearches.filter(s => s !== searchQuery)].slice(0, 5);
      setPreviousSearches(updatedSearches);
      localStorage.setItem('previousSearches', JSON.stringify(updatedSearches));
    } catch (err) {
      console.error(err);
    }
  };

  const handleReset = () => {
    setSearchQuery('');
    setFilteredArticles(articles);
  };

  const toggleColumn = (columnKey: keyof Article) => {
    setVisibleColumns(prev =>
      prev.includes(columnKey)
        ? prev.filter(key => key !== columnKey)
        : [...prev, columnKey]
    );
  };

  const handlePreviousSearchClick = (search: string) => {
    setSearchQuery(search);
    setIsOpen(false);
    handleSearch();
  };

  // Function to handle Enter key press
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSearch(); 
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Article Search</h1>
      
      <div className="mb-4 flex items-center">
        <div className="relative flex-grow mr-2">
          <Command className="rounded-lg border shadow-md">
            <CommandInput
              placeholder="Search articles..."
              value={searchQuery}
              onValueChange={setSearchQuery}
              onFocus={() => setIsOpen(true)}
              onKeyDown={handleKeyDown}
            />
            {isOpen && (
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Previous Searches">
                  {Array.isArray(previousSearches) && previousSearches.length > 0 ? (
                    previousSearches.map((search) => (
                      <CommandItem
                        key={search}
                        onSelect={() => handlePreviousSearchClick(search)}
                      >
                        {search}
                      </CommandItem>
                    ))
                  ) : (
                    <CommandEmpty>No previous searches found.</CommandEmpty>
                  )}
                </CommandGroup>
              </CommandList>
            )}
          </Command>
        </div>
        <Button onClick={handleSearch} className="mr-2">Search</Button>
        <Button onClick={handleReset} variant="outline" className="mr-2">Reset</Button>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Customize Columns</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Choose columns to display</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {columns.map((column) => (
                <div key={column.key} className="flex items-center space-x-2">
                  <Checkbox
                    id={column.key}
                    checked={visibleColumns.includes(column.key)}
                    onCheckedChange={() => toggleColumn(column.key)}
                  />
                  <label
                    htmlFor={column.key}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {column.label}
                  </label>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            {columns
              .filter(column => visibleColumns.includes(column.key))
              .map(column => (
                <TableHead key={column.key}>{column.label}</TableHead>
              ))}
            <TableHead>Rating</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredArticles.length > 0 ? (
            filteredArticles.map(article => (
              <TableRow key={article._id}>
                {columns
                  .filter(column => visibleColumns.includes(column.key))
                  .map(column => (
                    <TableCell key={column.key} className={column.key === 'summary' ? 'break-words' : ''}>
                      {article[column.key]}
                    </TableCell>
                  ))}
                <TableCell>
                  <RatingComponent articleId={article._id} />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={visibleColumns.length + 1} className="text-center">
                No results found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
