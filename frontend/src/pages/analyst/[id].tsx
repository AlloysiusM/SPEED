import { useState } from "react";
import { useRouter } from 'next/router';
import Navbar from '@/components/navbar'; 

export default function SubmitArticle() {
  const router = useRouter();
  const { id } = router.query;

  console.log(id);
  
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    journel: "", 
    yearOfPub: "",
    volume: "",
    numberOfPages: "",
    doi: "",
    category: "",
    summary: "",
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission behavior
    
    // Submit the form data to the API using the environment variable
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/articles/submit-extracted-articles`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    
    console.log(formData);
    console.log(response);
    
    if (response.ok) {
      alert("Article Analysed Successfully!");
    } else {
      alert("Error Submitting Analysed Article!");
    }
  };

  return (
    <div className="max-w-md mx-auto my-10 p-5 border border-gray-300 rounded">
      <Navbar />
      <h1 className="text-2xl font-bold mb-4">Extracted Article Information</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1" htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-2 py-1 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1" htmlFor="author">Author</label>
          <input
            type="text"
            id="author"
            name="author"
            value={formData.author}
            onChange={handleChange}
            required
            className="w-full px-2 py-1 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1" htmlFor="journel">Journel</label>
          <input
            type="text"
            id="journel"
            name="journel"
            value={formData.journel}
            onChange={handleChange}
            required
            className="w-full px-2 py-1 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1" htmlFor="yearOfPub">Year of Publication</label>
          <input
            type="text"
            id="yearOfPub"
            name="yearOfPub"
            value={formData.yearOfPub}
            onChange={handleChange}
            required
            className="w-full px-2 py-1 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1" htmlFor="volume">Volume</label>
          <input
            type="text"
            id="volume"
            name="volume"
            value={formData.volume}
            onChange={handleChange}
            required
            className="w-full px-2 py-1 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1" htmlFor="numberOfPages">Number of Pages</label>
          <input
            type="text"
            id="numberOfPages"
            name="numberOfPages"
            value={formData.numberOfPages}
            onChange={handleChange}
            required
            className="w-full px-2 py-1 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1" htmlFor="doi">DOI</label>
          <input
            type="text"
            id="doi"
            name="doi"
            value={formData.doi}
            onChange={handleChange}
            required
            className="w-full px-2 py-1 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1" htmlFor="category">Software Practice</label>
          <input
            type="text"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full px-2 py-1 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1" htmlFor="summary">Claim/Evidence</label>
          <input
            id="summary"
            name="summary"
            value={formData.summary}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded h-32"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Submit
        </button>
      </form>
    </div>
  );
}