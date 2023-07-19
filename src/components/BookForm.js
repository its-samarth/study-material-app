import React, { useState } from 'react';

const BookForm = ({ onAddBook, authors, setAuthors, subjects, setSubjects }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [subject, setSubject] = useState('');
  const [file, setFile] = useState(null);
  const [newAuthor, setNewAuthor] = useState('');
  const [newSubject, setNewSubject] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (title && author && subject && file) {
      const fileBlob = new Blob([file]);

      const formData = new FormData();
      formData.append('title', title);
      formData.append('author', author);
      formData.append('subject', subject);
      formData.append('file', fileBlob, file.name);

      try {
        const response = await fetch('http://localhost:8000/api/upload', {
          method: 'POST',
          headers: {
            'Access-Control-Allow-Origin': 'http://localhost:3000',
            'Access-Control-Allow-Credentials': 'true',
          },
          body: formData,
        });

        const data = await response.json();
        const { fileId } = data;
        onAddBook({ title, author, subject, file: fileId });
        setTitle('');
        setAuthor('');
        setSubject('');
        setFile(null);
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleAuthorChange = (e) => {
    const selectedAuthor = e.target.value;
    setAuthor(selectedAuthor);
  };

  const handleSubjectChange = (e) => {
    const selectedSubject = e.target.value;
    setSubject(selectedSubject);
  };

  const handleNewAuthorChange = (e) => {
    const newAuthorValue = e.target.value;
    setNewAuthor(newAuthorValue);
  };

  const handleNewSubjectChange = (e) => {
    const newSubjectValue = e.target.value;
    setNewSubject(newSubjectValue);
  };

  const handleAddAuthor = () => {
    if (newAuthor) {
      setAuthors([...authors, newAuthor]);
      setAuthor(newAuthor);
      setNewAuthor('');
    }
  };

  const handleAddSubject = () => {
    if (newSubject) {
      setSubjects([...subjects, newSubject]);
      setSubject(newSubject);
      setNewSubject('');
    }
  };

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data" className="book-form">
      <h2 className="form-heading">Add a New Book</h2>
      <div className="form-field">
        <label htmlFor="title">Title:</label>
        <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div className="form-field">
        <label htmlFor="author">Author:</label>
        <select id="author" value={author} onChange={handleAuthorChange}>
          <option value="">Select Author</option>
          {authors.map((authorOption) => (
            <option value={authorOption} key={authorOption}>
              {authorOption}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={newAuthor}
          onChange={handleNewAuthorChange}
          placeholder="Add new author"
        />
        <button type="button" onClick={handleAddAuthor}>
          Add
        </button>
      </div>
      <div className="form-field">
        <label htmlFor="subject">Subject:</label>
        <select id="subject" value={subject} onChange={handleSubjectChange}>
          <option value="">Select Subject</option>
          {subjects.map((subjectOption) => (
            <option value={subjectOption} key={subjectOption}>
              {subjectOption}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={newSubject}
          onChange={handleNewSubjectChange}
          placeholder="Add new subject"
        />
        <button type="button" onClick={handleAddSubject}>
          Add
        </button>
      </div>
      <div className="form-field">
        <label htmlFor="file">File:</label>
        <input type="file" id="file" onChange={handleFileChange} />
      </div>
      <button type="submit" className="add-button">
        Add Book
      </button>
    </form>
  );
};

export default BookForm;
