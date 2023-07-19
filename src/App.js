import React, { useState } from 'react';
import BookForm from './components/BookForm';
import BookList from './components/BookList';
import './App.css';

const App = () => {
  const [books, setBooks] = useState([]);
  const [fileDataUrls, setFileDataUrls] = useState({});
  const [authors, setAuthors] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const handleAddBook = (newBook) => {
    const fileReader = new FileReader();
    fileReader.onload = () => {
      const fileDataUrl = fileReader.result;
      const fileName = newBook.file.name;

      const updatedBooks = [...books, { ...newBook, file: fileName }];
      setBooks(updatedBooks);

      const updatedFileDataUrls = { ...fileDataUrls };
      updatedFileDataUrls[fileName] = fileDataUrl;
      setFileDataUrls(updatedFileDataUrls);
    };

    if (newBook.file) {
      fileReader.readAsDataURL(newBook.file);
    }

    // Update authors and subjects
    if (!authors.includes(newBook.author)) {
      setAuthors([...authors, newBook.author]);
    }

    if (!subjects.includes(newBook.subject)) {
      setSubjects([...subjects, newBook.subject]);
    }
  };

  const handleSortByAuthor = () => {
    const sortedBooks = [...books].sort((a, b) => {
      return a.author.localeCompare(b.author);
    });
    setBooks(sortedBooks);
  };

  const handleSortBySubject = () => {
    const sortedBooks = [...books].sort((a, b) => {
      return a.subject.localeCompare(b.subject);
    });
    setBooks(sortedBooks);
  };

  const handleConvertBlobToDataUrl = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result);
      };
      reader.onerror = reject;
      if (file) {
        reader.readAsDataURL(file);
      }
    });
  };

  const handleAddBookWithBlobDataUrl = async (newBook) => {
    try {
      const fileDataUrl = await handleConvertBlobToDataUrl(newBook.file);
      const fileName = newBook.file.name;

      const updatedBooks = [...books, { ...newBook, file: fileName }];
      setBooks(updatedBooks);

      const updatedFileDataUrls = { ...fileDataUrls };
      updatedFileDataUrls[fileName] = fileDataUrl;
      setFileDataUrls(updatedFileDataUrls);
    } catch (error) {
      console.error('Error converting Blob to data URL:', error);
    }
  };

  return (
    <div className="container">
      <h1 className="heading">Study Material App</h1>
      <BookForm
        onAddBook={handleAddBookWithBlobDataUrl}
        authors={authors}
        setAuthors={setAuthors}
        subjects={subjects}
        setSubjects={setSubjects}
      />
      <div className="sort-buttons">
        <button onClick={handleSortByAuthor}>Sort by Author</button>
        <button onClick={handleSortBySubject}>Sort by Subject</button>
      </div>
      <BookList
        books={books}
        fileDataUrls={fileDataUrls}
        handleSortByAuthor={handleSortByAuthor}
        handleSortBySubject={handleSortBySubject}
      />
    </div>
  );
};

export default App;
